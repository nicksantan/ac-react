import React from 'react';
import styled from 'styled-components';
import { formatDateMonth, formatDateShort } from '../../utils/dateUtils';

const Pill = styled.div`
  position: absolute;
  top: 50%;
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 8px 14px 7px 12px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.09);
  z-index: 5;
  pointer-events: auto;
  cursor: ${({ $isAdmin }) => $isAdmin ? 'grab' : 'default'};
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  }

  &:active {
    cursor: ${({ $isAdmin }) => $isAdmin ? 'grabbing' : 'default'};
  }
`;

const PillName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: 0.3px;
`;

const PillDates = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.2px;
`;

const PillEvent = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.acOrange};
  letter-spacing: 0.2px;
  font-weight: 500;
`;

const PillMilestones = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.2px;
`;

const EditTag = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 9px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  padding: 1px 5px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s, color 0.15s;
  pointer-events: auto;
  z-index: 6;

  ${Pill}:hover & {
    opacity: 1;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.acTeal};
    border-color: ${({ theme }) => theme.colors.acTeal};
  }
`;

function ProjectPill({ project, firstPhase, lastPhase, eventPhase, left, anchorLeft, isAdmin, onEdit, onDragStart }) {
  return (
    <Pill
      data-interactive="true"
      $isAdmin={isAdmin}
      style={{
        left: left,
        transform: anchorLeft ? 'translate(-100%, -50%)' : 'translateY(-50%)'
      }}
      onMouseDown={(e) => {
        if (e.target.closest('[data-edit-tag]')) return;
        if (isAdmin) onDragStart(e);
      }}
    >
      <PillName>{project.name}</PillName>
      <PillDates>
        {formatDateMonth(firstPhase.start)} — {formatDateMonth(lastPhase.end)}
      </PillDates>
      {eventPhase && (
        <PillEvent>
          Event: {formatDateShort(eventPhase.start)} — {formatDateShort(eventPhase.end)}
        </PillEvent>
      )}
      {project.milestones && project.milestones.length > 0 && (
        <PillMilestones>
          {project.milestones.map(m => m.label).join(', ')}
        </PillMilestones>
      )}
      {isAdmin && (
        <EditTag
          data-edit-tag="true"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onEdit();
          }}
        >
          Edit
        </EditTag>
      )}
    </Pill>
  );
}

export default React.memo(ProjectPill);
