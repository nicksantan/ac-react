import React, { useMemo } from 'react';
import styled from 'styled-components';
import { dateToX } from '../../utils/dateUtils';

const Line = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: ${({ theme }) => theme.colors.today};
  z-index: 4;
  pointer-events: none;

  &::before {
    content: 'TODAY';
    position: absolute;
    top: 4px;
    left: 4px;
    font-size: 9px;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.colors.today};
    font-family: ${({ theme }) => theme.font};
    font-weight: 500;
    white-space: nowrap;
  }
`;

function TodayLine({ range, pxPerDay, totalWidth }) {
  const x = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateToX(today, range.start, pxPerDay);
  }, [range, pxPerDay]);

  if (x < 0 || x > totalWidth) return null;

  return <Line style={{ left: x }} />;
}

export default React.memo(TodayLine);
