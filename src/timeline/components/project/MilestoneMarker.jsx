import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { parseDate } from '../../utils/dateUtils';
import { Tooltip } from './PhaseSegment';

const Marker = styled.div`
  position: absolute;
  top: calc(50% - ${({ theme }) => theme.layout.barH / 2}px);
  height: ${({ theme }) => theme.layout.barH}px;
  width: 2px;
  background: ${({ theme }) => theme.colors.textPrimary};
  z-index: 6;
  pointer-events: auto;
  cursor: ${({ $isAdmin }) => $isAdmin ? 'ew-resize' : 'default'};
  opacity: 0.6;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -6px;
    right: -6px;
    bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.colors.textPrimary};
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.bgSurface};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.textPrimary};
  }
`;

function MilestoneMarker({ milestone, x, projectName, isAdmin, onDragStart }) {
  const [tooltipState, setTooltipState] = useState({ visible: false, x: 0, y: 0 });

  const msDate = parseDate(milestone.date);

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
      <Marker
        data-interactive="true"
        $isAdmin={isAdmin}
        style={{ left: x }}
        onMouseDown={(e) => {
          if (isAdmin) onDragStart(e);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {tooltipState.visible && (
        <Tooltip
          phase={{ type: 'milestone', start: msDate, end: msDate, days: 0 }}
          projectName={projectName}
          milestoneLabel={milestone.label}
          x={tooltipState.x}
          y={tooltipState.y}
        />
      )}
    </>
  );
}

export default React.memo(MilestoneMarker);
