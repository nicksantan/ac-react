import React, { useCallback } from 'react';
import styled from 'styled-components';
import { PHASE_FULL_NAMES } from '../../config/phases';
import { formatDateShort } from '../../utils/dateUtils';

const Segment = styled.div`
  position: absolute;
  height: ${({ theme }) => theme.layout.barH}px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  transition: opacity 0.15s, filter 0.15s, box-shadow 0.15s;
  border-radius: 2px;
  cursor: default;

  background: ${({ $phaseStyle }) => $phaseStyle.bg};
  color: ${({ $phaseStyle }) => $phaseStyle.color};
  opacity: ${({ $phaseStyle }) => $phaseStyle.opacity};
  box-shadow: ${({ $phaseStyle }) => $phaseStyle.shadow || 'none'};
  ${({ $phaseStyle }) => $phaseStyle.dashed ? `border: 1px dashed #D0CEC9;` : ''}

  &:hover {
    opacity: 1 !important;
    filter: brightness(1.05);
    z-index: 3;
    ${({ $phaseStyle }) => $phaseStyle.dashed
      ? ''
      : $phaseStyle.shadow
        ? `box-shadow: ${$phaseStyle.shadow}, 0 0 0 2px rgba(240,91,47,0.4);`
        : 'box-shadow: 0 0 0 2px rgba(10,175,150,0.3);'
    }
  }

  .drag-active & {
    transition: none !important;
  }
`;

const PhaseLabel = styled.span`
  pointer-events: none;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 4px);
`;

const DragHandle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
  z-index: 4;
  ${({ $side }) => $side === 'left' ? 'left: -3px;' : 'right: -3px;'}

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 16px;
    border-radius: 1px;
    background: rgba(255,255,255,0.5);
    opacity: 0;
    transition: opacity 0.15s;
  }

  ${Segment}:hover &::after {
    opacity: 1;
  }
`;

function PhaseSegment({ phase, x, width, showInline, label, isAdmin, projectName, onDragStart }) {
  const phaseStyle = getPhaseStyle(phase.type);
  const showHandles = isAdmin
    && phase.type !== 'buffer_pre'
    && phase.type !== 'buffer_post'
    && phase.type !== 'event';

  const [tooltipState, setTooltipState] = React.useState({ visible: false, x: 0, y: 0 });

  const handleMouseEnter = useCallback((e) => {
    setTooltipState({ visible: true, x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e) => {
    setTooltipState(prev => prev.visible ? { ...prev, x: e.clientX, y: e.clientY } : prev);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltipState({ visible: false, x: 0, y: 0 });
  }, []);

  return (
    <>
      <Segment
        data-interactive="true"
        $phaseStyle={phaseStyle}
        style={{ left: x, width: Math.max(width, 1) }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {showInline && label && <PhaseLabel>{label}</PhaseLabel>}
        {showHandles && (
          <>
            <DragHandle
              $side="left"
              data-interactive="true"
              onMouseDown={(e) => onDragStart(e, 'left')}
            />
            <DragHandle
              $side="right"
              data-interactive="true"
              onMouseDown={(e) => onDragStart(e, 'right')}
            />
          </>
        )}
      </Segment>
      {tooltipState.visible && (
        <Tooltip
          phase={phase}
          projectName={projectName}
          x={tooltipState.x}
          y={tooltipState.y}
        />
      )}
    </>
  );
}

// Inline tooltip to avoid portal complexity
const TooltipBox = styled.div`
  position: fixed;
  background: #FFFFFF;
  border: 1px solid #D0CEC9;
  padding: 10px 14px;
  font-size: 11px;
  color: #141413;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-radius: 3px;
  max-width: 260px;
`;

const TtPhase = styled.div`
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #4A4A48;
  margin-bottom: 4px;
  font-weight: 500;
`;

const TtName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const TtDates = styled.div`
  font-size: 11px;
  color: #141413;
`;

const TtDuration = styled.div`
  font-size: 11px;
  color: #4A4A48;
  margin-top: 2px;
`;

function Tooltip({ phase, projectName, milestoneLabel, x, y }) {
  const isMilestone = phase.type === 'milestone';
  const pad = 12;
  let tx = x + pad;
  let ty = y + pad;

  if (tx + 260 > window.innerWidth) tx = x - 260 - pad;
  if (ty + 100 > window.innerHeight) ty = y - 100 - pad;

  return (
    <TooltipBox style={{ left: tx, top: ty }}>
      <TtPhase>{isMilestone ? 'Milestone' : (PHASE_FULL_NAMES[phase.type] || phase.type)}</TtPhase>
      <TtName>{isMilestone ? milestoneLabel : projectName}</TtName>
      <TtDates>
        {formatDateShort(phase.start)}
        {phase.days > 1 ? ` — ${formatDateShort(phase.end)}` : ''}
      </TtDates>
      {phase.days > 0 && (
        <TtDuration>{phase.days} day{phase.days !== 1 ? 's' : ''}</TtDuration>
      )}
    </TooltipBox>
  );
}

function getPhaseStyle(type) {
  const styles = {
    briefing: { bg: '#C8C8C6', color: '#555', opacity: 0.7 },
    rnd: { bg: '#0AAF96', color: '#fff', opacity: 0.85 },
    production: { bg: '#ADD56D', color: '#3D5A10', opacity: 0.9 },
    prep: { bg: '#FDCB7E', color: '#7A5B1A', opacity: 0.85 },
    buffer_pre: { bg: '#EAEAE8', color: '#737370', opacity: 0.8, dashed: true },
    loadin: { bg: '#0AAF96', color: '#fff', opacity: 0.9 },
    event: { bg: '#F05B2F', color: '#fff', opacity: 1.0, shadow: '0 1px 6px rgba(240,91,47,0.3)' },
    loadout: { bg: '#0AAF96', color: '#fff', opacity: 0.7 },
    buffer_post: { bg: '#EAEAE8', color: '#737370', opacity: 0.8, dashed: true },
    documentation: { bg: '#C8C8C6', color: '#555', opacity: 0.6 },
  };
  return styles[type] || styles.briefing;
}

export { Tooltip };
export default React.memo(PhaseSegment);
