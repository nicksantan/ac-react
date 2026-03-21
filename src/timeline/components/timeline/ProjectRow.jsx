import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useTimeline } from '../../context/TimelineContext';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { computePhases } from '../../utils/phaseComputer';
import { dateToX, parseDate, formatDate, addDays } from '../../utils/dateUtils';
import { PHASE_LABELS } from '../../config/phases';
import { layoutLabels } from '../../utils/labelLayout';
import PhaseSegment from '../project/PhaseSegment';
import ProjectPill from '../project/ProjectPill';
import MilestoneMarker from '../project/MilestoneMarker';
import ExternalLabel from '../project/ExternalLabel';

const Row = styled.div`
  height: ${({ theme }) => theme.layout.rowH}px;
  position: relative;
  margin-bottom: ${({ theme }) => theme.layout.rowGap}px;
`;

function ProjectRow({ project, range, pxPerDay }) {
  const { projects, setProjects, openModal } = useTimeline();
  const { isAdmin } = useAuth();

  const phases = useMemo(() => computePhases(project), [project]);

  const handleDragStart = useCallback((e, type, payload) => {
    if (!isAdmin) return;
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    document.body.classList.add('drag-active');

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const daysDelta = Math.round(dx / pxPerDay);
      const proj = projects.find(p => p.id === project.id);
      if (!proj) return;

      if (type === 'resize') {
        const { phaseType, side, origDuration, adjacentType, adjacentOrigDuration } = payload;
        const durKey = phaseType;
        if (!durKey || durKey === 'event') return;

        const updatedProject = { ...proj, durations: { ...proj.durations } };

        if (side === 'right') {
          updatedProject.durations[durKey] = Math.max(1, origDuration + daysDelta);
          if (adjacentType && adjacentOrigDuration !== null) {
            updatedProject.durations[adjacentType] = Math.max(0, adjacentOrigDuration - daysDelta);
          }
        } else {
          updatedProject.durations[durKey] = Math.max(1, origDuration - daysDelta);
          if (adjacentType && adjacentOrigDuration !== null) {
            updatedProject.durations[adjacentType] = Math.max(0, adjacentOrigDuration + daysDelta);
          }
        }

        setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
      } else if (type === 'move') {
        const { origAnchorStart, origAnchorEnd, origMilestones } = payload;
        const newStart = formatDate(addDays(parseDate(origAnchorStart), daysDelta));
        const newEnd = formatDate(addDays(parseDate(origAnchorEnd), daysDelta));
        const newMilestones = (origMilestones || []).map(ms => ({
          ...ms,
          date: formatDate(addDays(parseDate(ms.date), daysDelta))
        }));

        setProjects(prev => prev.map(p =>
          p.id === project.id
            ? { ...p, anchor: { start: newStart, end: newEnd }, milestones: newMilestones }
            : p
        ));
      } else if (type === 'milestone') {
        const { milestoneIndex, origDate } = payload;
        const newDate = formatDate(addDays(parseDate(origDate), daysDelta));

        setProjects(prev => prev.map(p => {
          if (p.id !== project.id) return p;
          const newMilestones = [...p.milestones];
          newMilestones[milestoneIndex] = { ...newMilestones[milestoneIndex], date: newDate };
          return { ...p, milestones: newMilestones };
        }));
      }
    };

    const handleMouseUp = () => {
      document.body.classList.remove('drag-active');
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    if (type === 'move') {
      document.body.style.cursor = 'grabbing';
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [isAdmin, pxPerDay, project.id, projects, setProjects]);

  // Build label items for external placement
  const { labelItems, phaseElements, milestoneElements } = useMemo(() => {
    const labelItems = [];
    const phaseElements = [];
    const milestoneElements = [];

    const PHASE_TYPES_ORDER = [
      'briefing', 'rnd', 'production', 'prep',
      'buffer_pre', 'loadin', 'event', 'loadout',
      'buffer_post', 'documentation'
    ];

    phases.forEach((phase, i) => {
      const x = dateToX(phase.start, range.start, pxPerDay);
      const w = phase.days * pxPerDay;
      const label = PHASE_LABELS[phase.type];

      // Check if label fits inline
      let showInline = false;
      if (label) {
        const inlineMinW = label.length * 7.5 + 16;
        if (w >= inlineMinW) {
          showInline = true;
        } else if (w > 8) {
          labelItems.push({ centerX: x + w / 2, text: label, isMilestone: false });
        }
      }

      // Get adjacent phase type for drag resize
      const idx = PHASE_TYPES_ORDER.indexOf(phase.type);
      const adjacentLeft = idx > 0 ? PHASE_TYPES_ORDER[idx - 1] : null;
      const adjacentRight = idx < PHASE_TYPES_ORDER.length - 1 ? PHASE_TYPES_ORDER[idx + 1] : null;

      phaseElements.push({
        phase,
        x,
        w,
        showInline,
        label,
        adjacentLeft,
        adjacentRight,
        key: `phase-${phase.type}`
      });
    });

    (project.milestones || []).forEach((ms, i) => {
      const msDate = parseDate(ms.date);
      const x = dateToX(msDate, range.start, pxPerDay);
      milestoneElements.push({ ms, x, index: i, key: `ms-${i}` });
      labelItems.push({ centerX: x, text: ms.label.toUpperCase(), isMilestone: true });
    });

    return { labelItems, phaseElements, milestoneElements };
  }, [phases, project.milestones, range, pxPerDay]);

  const layoutResult = useMemo(() => layoutLabels(labelItems), [labelItems]);

  // Pill position
  const firstPhase = phases[0];
  const lastPhase = phases[phases.length - 1];
  const eventPhase = phases.find(ph => ph.type === 'event');
  const pillX = dateToX(firstPhase.start, range.start, pxPerDay);
  const pillOffset = pillX - 8;

  return (
    <Row>
      <ProjectPill
        project={project}
        firstPhase={firstPhase}
        lastPhase={lastPhase}
        eventPhase={eventPhase}
        left={Math.max(8, pillOffset)}
        anchorLeft={pillOffset >= 8}
        isAdmin={isAdmin}
        onEdit={() => openModal(project.id)}
        onDragStart={(e) => handleDragStart(e, 'move', {
          origAnchorStart: project.anchor.start,
          origAnchorEnd: project.anchor.end,
          origMilestones: project.milestones?.map(m => ({ ...m }))
        })}
      />

      {phaseElements.map(({ phase, x, w, showInline, label, adjacentLeft, adjacentRight, key }) => (
        <PhaseSegment
          key={key}
          phase={phase}
          x={x}
          width={w}
          showInline={showInline}
          label={label}
          isAdmin={isAdmin}
          projectName={project.name}
          onDragStart={(e, side) => {
            const adjacent = side === 'left' ? adjacentLeft : adjacentRight;
            handleDragStart(e, 'resize', {
              phaseType: phase.type,
              side,
              origDuration: project.durations[phase.type] || phase.days,
              adjacentType: adjacent,
              adjacentOrigDuration: adjacent ? (project.durations[adjacent] ?? null) : null
            });
          }}
        />
      ))}

      {milestoneElements.map(({ ms, x, index, key }) => (
        <MilestoneMarker
          key={key}
          milestone={ms}
          x={x}
          projectName={project.name}
          isAdmin={isAdmin}
          onDragStart={(e) => handleDragStart(e, 'milestone', {
            milestoneIndex: index,
            origDate: ms.date
          })}
        />
      ))}

      {layoutResult.map((item, i) => (
        <ExternalLabel
          key={`ext-${i}`}
          text={item.text}
          centerX={item.centerX}
          side={item.side}
          isMilestone={item.isMilestone}
        />
      ))}
    </Row>
  );
}

export default React.memo(ProjectRow);
