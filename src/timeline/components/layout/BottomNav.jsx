import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTimeline } from '../../context/TimelineContext';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { computePhases } from '../../utils/phaseComputer';

const Nav = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSurface};
  flex-shrink: 0;
  z-index: 10;
  height: 46px;
`;

const Arrow = styled.button`
  display: ${({ $visible }) => $visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 100%;
  background: ${({ theme }) => theme.colors.bgSurface};
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  font-family: ${({ theme }) => theme.font};
  flex-shrink: 0;
  transition: color 0.15s, background 0.15s;
  z-index: 2;
  ${({ $side, theme }) => $side === 'left'
    ? `border-right: 1px solid ${theme.colors.borderSubtle};`
    : `border-left: 1px solid ${theme.colors.borderSubtle};`
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.bgElevated};
  }
`;

const ScrollArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  overflow: hidden;
  flex: 1;
  height: 100%;
  scroll-behavior: smooth;
`;

const Chip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.acTeal : theme.colors.border};
  border-radius: 3px;
  background: ${({ $active }) =>
    $active ? 'rgba(10,175,150,0.05)' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    background: ${({ theme }) => theme.colors.bgElevated};
  }

  input[type="checkbox"] {
    accent-color: ${({ theme }) => theme.colors.acTeal};
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
`;

const ChipName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: 0.2px;
`;

const ChipEdit = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 2px;
  transition: color 0.15s;
  letter-spacing: 0.3px;

  &:hover {
    color: ${({ theme }) => theme.colors.acTeal};
  }
`;

const AddButton = styled.button`
  flex-shrink: 0;
  margin-left: auto;
  height: 100%;
  border: none;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  padding: 0 20px;
  font-family: ${({ theme }) => theme.font};
  font-size: 11px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.bgSurface};
  color: ${({ theme }) => theme.colors.acTeal};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.acTeal};
    color: white;
  }
`;

function BottomNav() {
  const { projects, visibleProjects, toggleVisibility, openModal } = useTimeline();
  const { isAdmin } = useAuth();
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = useCallback(() => {
    const area = scrollRef.current;
    if (!area) return;
    const overflows = area.scrollWidth > area.clientWidth + 2;
    setShowLeft(overflows && area.scrollLeft > 4);
    setShowRight(overflows && area.scrollLeft < area.scrollWidth - area.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [updateArrows, projects]);

  const scrollChips = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += direction * 160;
      setTimeout(updateArrows, 200);
    }
  };

  const sortedProjects = projects.slice().sort((a, b) => {
    const aStart = computePhases(a)[0].start;
    const bStart = computePhases(b)[0].start;
    return aStart - bStart;
  });

  return (
    <Nav>
      <Arrow $visible={showLeft} $side="left" onClick={() => scrollChips(-1)}>
        &#8249;
      </Arrow>
      <ScrollArea ref={scrollRef} onScroll={updateArrows}>
        {sortedProjects.map(project => {
          const isVisible = visibleProjects.has(project.id);
          return (
            <Chip
              key={project.id}
              $active={isVisible}
              onClick={(e) => {
                if (e.target.classList?.contains('chip-edit-action')) return;
                toggleVisibility(project.id);
              }}
            >
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => toggleVisibility(project.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <ChipName>{project.name}</ChipName>
              {isAdmin && (
                <ChipEdit
                  className="chip-edit-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(project.id);
                  }}
                >
                  Edit
                </ChipEdit>
              )}
            </Chip>
          );
        })}
      </ScrollArea>
      <Arrow $visible={showRight} $side="right" onClick={() => scrollChips(1)}>
        &#8250;
      </Arrow>
      {isAdmin && (
        <AddButton onClick={() => openModal()}>+ Project</AddButton>
      )}
    </Nav>
  );
}

export default BottomNav;
