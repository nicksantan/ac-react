import React, { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTimeline } from '../../context/TimelineContext';
import { computePhases, getTimelineRange } from '../../utils/phaseComputer';
import { daysBetween } from '../../utils/dateUtils';
import TimelineCanvas from './TimelineCanvas';

const Container = styled.div`
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  position: relative;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.borderStrong};
  }
`;

function TimelineContainer() {
  const { containerRef, zoomLevel, setZoomLevel, projects } = useTimeline();
  const panRef = useRef({ isPanning: false, startX: 0, scrollStart: 0 });
  const dragActiveRef = useRef(false);

  // Scroll-wheel zoom with cursor-centered pivot
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey || (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !e.shiftKey)) {
        e.preventDefault();
        const sensitivity = e.ctrlKey ? 0.02 : 0.15;
        const delta = -e.deltaY * sensitivity;
        setZoomLevel(zoomLevel + delta, e.clientX);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [containerRef, zoomLevel, setZoomLevel]);

  // Initial scroll to earliest project
  useEffect(() => {
    if (!containerRef.current || projects.length === 0) return;
    const timer = setTimeout(() => {
      let earliest = new Date('2099-01-01');
      projects.forEach(p => {
        const phases = computePhases(p);
        if (phases[0].start < earliest) earliest = new Date(phases[0].start);
      });
      const range = getTimelineRange(projects);
      const x = daysBetween(range.start, earliest) * zoomLevel;
      if (containerRef.current) {
        containerRef.current.scrollLeft = Math.max(0, x - 40);
      }
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pan handling
  const handleMouseDown = useCallback((e) => {
    if (dragActiveRef.current) return;
    if (e.target.closest('[data-interactive]')) return;

    panRef.current = {
      isPanning: true,
      startX: e.clientX,
      scrollStart: containerRef.current?.scrollLeft || 0
    };
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
    e.preventDefault();
  }, [containerRef]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!panRef.current.isPanning) return;
      if (containerRef.current) {
        containerRef.current.scrollLeft = panRef.current.scrollStart - (e.clientX - panRef.current.startX);
      }
    };

    const handleMouseUp = () => {
      if (panRef.current.isPanning) {
        panRef.current.isPanning = false;
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grab';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [containerRef]);

  return (
    <Container ref={containerRef} onMouseDown={handleMouseDown}>
      <TimelineCanvas />
    </Container>
  );
}

export default TimelineContainer;
