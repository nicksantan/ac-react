import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useTimeline } from '../../context/TimelineContext';
import { getTimelineRange } from '../../utils/phaseComputer';
import { daysBetween } from '../../utils/dateUtils';
import TimeAxis from './TimeAxis';
import GridLines from './GridLines';
import TodayLine from './TodayLine';
import ProjectRows from './ProjectRows';

const Canvas = styled.div`
  position: relative;
  min-height: 100%;
`;

function TimelineCanvas() {
  const { projects, zoomLevel } = useTimeline();

  const { range, totalDays, totalWidth } = useMemo(() => {
    const range = getTimelineRange(projects);
    const totalDays = daysBetween(range.start, range.end);
    const totalWidth = totalDays * zoomLevel;
    return { range, totalDays, totalWidth };
  }, [projects, zoomLevel]);

  return (
    <Canvas style={{ width: totalWidth }}>
      <TimeAxis range={range} totalDays={totalDays} pxPerDay={zoomLevel} />
      <GridLines range={range} pxPerDay={zoomLevel} />
      <TodayLine range={range} pxPerDay={zoomLevel} totalWidth={totalWidth} />
      <ProjectRows range={range} pxPerDay={zoomLevel} />
    </Canvas>
  );
}

export default TimelineCanvas;
