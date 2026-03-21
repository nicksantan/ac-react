import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useTimeline } from '../../context/TimelineContext';
import { computePhases } from '../../utils/phaseComputer';
import ProjectRow from './ProjectRow';

const RowsContainer = styled.div`
  position: relative;
  z-index: 2;
  padding-top: ${({ theme }) => theme.layout.rowGap}px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  gap: 8px;
`;

const EmptyHint = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textFaint};
`;

function ProjectRows({ range, pxPerDay }) {
  const { projects, visibleProjects } = useTimeline();

  const sortedVisible = useMemo(() => {
    return projects
      .filter(p => visibleProjects.has(p.id))
      .sort((a, b) => {
        const aStart = computePhases(a)[0].start;
        const bStart = computePhases(b)[0].start;
        return aStart - bStart;
      });
  }, [projects, visibleProjects]);

  if (sortedVisible.length === 0) {
    return (
      <RowsContainer>
        <EmptyState>
          <span>No projects visible</span>
          <EmptyHint>Toggle project visibility in the bar below</EmptyHint>
        </EmptyState>
      </RowsContainer>
    );
  }

  return (
    <RowsContainer>
      {sortedVisible.map(project => (
        <ProjectRow
          key={project.id}
          project={project}
          range={range}
          pxPerDay={pxPerDay}
        />
      ))}
    </RowsContainer>
  );
}

export default ProjectRows;
