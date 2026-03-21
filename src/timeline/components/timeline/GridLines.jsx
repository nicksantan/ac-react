import React, { useMemo } from 'react';
import styled from 'styled-components';
import { addDays, dateToX } from '../../utils/dateUtils';

const Grid = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.layout.axisH}px;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
`;

const Line = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: ${({ $type, theme }) =>
    $type === 'month' ? theme.colors.borderSubtle : theme.colors.bgRecessed};
`;

function GridLines({ range, pxPerDay }) {
  const lines = useMemo(() => {
    const items = [];
    let d = new Date(range.start);

    while (d <= range.end) {
      const x = dateToX(d, range.start, pxPerDay);

      if (d.getDate() === 1) {
        items.push({ type: 'month', x, key: `gm-${d.getTime()}` });
      } else if (d.getDay() === 1 && pxPerDay >= 3) {
        items.push({ type: 'week', x, key: `gw-${d.getTime()}` });
      }

      d = addDays(d, 1);
    }
    return items;
  }, [range, pxPerDay]);

  return (
    <Grid>
      {lines.map(line => (
        <Line key={line.key} style={{ left: line.x }} $type={line.type} />
      ))}
    </Grid>
  );
}

export default React.memo(GridLines);
