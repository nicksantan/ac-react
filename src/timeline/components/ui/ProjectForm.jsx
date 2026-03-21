import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTimeline } from '../../context/TimelineContext';
import { detectConflicts, formatConflict } from '../../utils/conflictDetector';
import { DEFAULT_DURATIONS, PHASE_FORM_FIELDS } from '../../config/phases';

const Body = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
  font-weight: 500;
`;

const Input = styled.input`
  font-family: ${({ theme }) => theme.font};
  font-size: 12px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.textPrimary};
  width: 100%;
  outline: none;
  transition: border-color 0.15s;
  border-radius: 2px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.acTeal};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const SectionLabel = styled.div`
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.acTeal};
  margin-bottom: 16px;
  margin-top: ${({ $mt }) => $mt || '8px'};
  font-weight: 500;
  padding-bottom: 6px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};
`;

const DurationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
`;

const DurItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PhaseDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 1px;
  flex-shrink: 0;
`;

const DurLabel = styled.label`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textPrimary};
  flex: 1;
  min-width: 0;
  letter-spacing: 0;
  text-transform: none;
  margin-bottom: 0;
  font-weight: 400;
`;

const DurInput = styled.input`
  font-family: ${({ theme }) => theme.font};
  width: 52px;
  text-align: center;
  font-size: 11px;
  padding: 4px 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  border-radius: 2px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.acTeal};
  }
`;

const MilestoneRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RemoveBtn = styled.button`
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  background: none;
  border: none;
  font-family: ${({ theme }) => theme.font};

  &:hover {
    color: ${({ theme }) => theme.colors.conflict};
  }
`;

const AddMilestoneBtn = styled.button`
  font-family: ${({ theme }) => theme.font};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.acTeal};
  background: none;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  padding: 6px 12px;
  cursor: pointer;
  width: 100%;
  margin-top: 4px;
  transition: all 0.15s;
  letter-spacing: 0.5px;
  border-radius: 2px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.acTeal};
    background: rgba(10,175,150,0.04);
  }
`;

const ConflictWarning = styled.div`
  background: rgba(211, 47, 47, 0.06);
  border: 1px solid rgba(211, 47, 47, 0.2);
  color: ${({ theme }) => theme.colors.conflict};
  padding: 10px 14px;
  font-size: 11px;
  margin-bottom: 16px;
  line-height: 1.5;
  border-radius: 2px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderSubtle};
`;

const DeleteBtn = styled.button`
  font-family: ${({ theme }) => theme.font};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.conflict};
  border: 1px solid transparent;
  background: none;
  cursor: pointer;
  padding: 6px 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 500;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.conflict};
    background: rgba(211,47,47,0.04);
    padding: 6px 14px;
  }
`;

const SaveBtn = styled.button`
  font-family: ${({ theme }) => theme.font};
  font-size: 11px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 7px 16px;
  background: ${({ theme }) => theme.colors.acTeal};
  color: white;
  border: 1px solid ${({ theme }) => theme.colors.acTeal};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.acTealHover};
    border-color: ${({ theme }) => theme.colors.acTealHover};
  }
`;

function ProjectForm() {
  const {
    projects, editingProjectId, addProject, updateProject, deleteProject, closeModal
  } = useTimeline();

  const existingProject = editingProjectId
    ? projects.find(p => p.id === editingProjectId)
    : null;

  const [name, setName] = useState('');
  const [anchorStart, setAnchorStart] = useState('');
  const [anchorEnd, setAnchorEnd] = useState('');
  const [durations, setDurations] = useState({ ...DEFAULT_DURATIONS });
  const [milestones, setMilestones] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const nameRef = useRef(null);

  useEffect(() => {
    if (existingProject) {
      setName(existingProject.name);
      setAnchorStart(existingProject.anchor.start);
      setAnchorEnd(existingProject.anchor.end);
      setDurations({ ...existingProject.durations });
      setMilestones((existingProject.milestones || []).map(m => ({ ...m })));
    } else {
      setName('');
      setAnchorStart('');
      setAnchorEnd('');
      setDurations({ ...DEFAULT_DURATIONS });
      setMilestones([]);
    }
    setConflicts([]);
    setTimeout(() => nameRef.current?.focus(), 100);
  }, [existingProject]);

  const handleDurationChange = (key, value) => {
    setDurations(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
  };

  const addMilestone = () => {
    setMilestones(prev => [...prev, { label: '', date: '' }]);
  };

  const updateMilestone = (index, field, value) => {
    setMilestones(prev => prev.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    ));
  };

  const removeMilestone = (index) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim() || !anchorStart || !anchorEnd) {
      alert('Please fill in the project name and anchor dates.');
      return;
    }

    const projectData = {
      id: editingProjectId || 'proj-' + Date.now(),
      name: name.trim(),
      anchor: { start: anchorStart, end: anchorEnd },
      durations,
      milestones: milestones.filter(m => m.label.trim() && m.date)
    };

    // Check for conflicts
    const tempProjects = editingProjectId
      ? projects.map(p => p.id === editingProjectId ? projectData : p)
      : [...projects, projectData];

    const allConflicts = detectConflicts(tempProjects);
    const myConflicts = allConflicts.filter(c => c.project === name.trim());

    if (myConflicts.length > 0) {
      setConflicts(myConflicts);
      return;
    }

    if (editingProjectId) {
      updateProject(projectData);
    } else {
      addProject(projectData);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!editingProjectId) return;
    const projName = existingProject?.name || 'this project';
    if (window.confirm(`Remove "${projName}" from the timeline?`)) {
      deleteProject(editingProjectId);
      closeModal();
    }
  };

  return (
    <>
      <Body>
        {conflicts.length > 0 && (
          <ConflictWarning>
            {conflicts.map((c, i) => (
              <div key={i} dangerouslySetInnerHTML={{ __html: formatConflict(c).replace(
                /^(.+?) overlaps (.+?) /,
                '<strong>$1</strong> overlaps <strong>$2</strong> '
              )}} />
            ))}
          </ConflictWarning>
        )}

        <FormGroup>
          <Label>Project Name</Label>
          <Input
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. 93 Canal Street"
          />
        </FormGroup>

        <SectionLabel>Anchor — Event / Delivery</SectionLabel>
        <FormRow>
          <FormGroup>
            <Label>Event Start</Label>
            <Input
              type="date"
              value={anchorStart}
              onChange={(e) => setAnchorStart(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Event End</Label>
            <Input
              type="date"
              value={anchorEnd}
              onChange={(e) => setAnchorEnd(e.target.value)}
            />
          </FormGroup>
        </FormRow>

        <SectionLabel>Phase Durations (days)</SectionLabel>
        <DurationGrid>
          {PHASE_FORM_FIELDS.map(field => (
            <DurItem key={field.key}>
              <PhaseDot
                style={{
                  background: field.bg,
                  opacity: field.opacity || 1,
                  border: field.border || 'none'
                }}
              />
              <DurLabel>{field.label}</DurLabel>
              <DurInput
                type="number"
                min="0"
                value={durations[field.key] || 0}
                onChange={(e) => handleDurationChange(field.key, e.target.value)}
              />
            </DurItem>
          ))}
        </DurationGrid>

        <SectionLabel $mt="24px">Milestones</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {milestones.map((ms, i) => (
            <MilestoneRow key={i}>
              <Input
                type="text"
                placeholder="Label"
                value={ms.label}
                onChange={(e) => updateMilestone(i, 'label', e.target.value)}
                style={{ flex: 1 }}
              />
              <Input
                type="date"
                value={ms.date}
                onChange={(e) => updateMilestone(i, 'date', e.target.value)}
                style={{ flex: 1 }}
              />
              <RemoveBtn onClick={() => removeMilestone(i)}>&times;</RemoveBtn>
            </MilestoneRow>
          ))}
        </div>
        <AddMilestoneBtn onClick={addMilestone}>+ Add milestone</AddMilestoneBtn>
      </Body>
      <Footer>
        {editingProjectId ? (
          <DeleteBtn onClick={handleDelete}>Delete project</DeleteBtn>
        ) : (
          <div />
        )}
        <SaveBtn onClick={handleSave}>Save</SaveBtn>
      </Footer>
    </>
  );
}

export default ProjectForm;
