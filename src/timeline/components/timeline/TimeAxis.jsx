import React, { useMemo } from 'react';
import styled from 'styled-components';
import { addDays, dateToX } from '../../utils/dateUtils';

const Axis = styled.div`
  position: sticky;
  top: 0;
  height: ${({ theme }) => theme.layout.axisH}px;
  background: ${({ theme }) => theme.colors.bgSurface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 5;
  display: flex;
  align-items: flex-end;
`;

const MonthLabel = styled.span`
  position: absolute;
  bottom: 8px;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  transform: translateX(6px);
`;

const TickLine = styled.div`
  position: absolute;
  bottom: 0;
  width: 1px;
  height: ${({ $type }) => $type === 'month' ? '12px' : '6px'};
  background: ${({ $type, theme }) =>
    $type === 'month' ? theme.colors.border : theme.colors.borderSubtle};
`;

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function TimeAxis({ range, totalDays, pxPerDay }) {
  const ticks = useMemo(() => {
    const items = [];
    let d = new Date(range.start);

    while (d <= range.end) {
      const x = dateToX(d, range.start, pxPerDay);

      if (d.getDate() === 1) {
        items.push({
          type: 'month',
          x,
          label: MONTHS[d.getMonth()] + ' ' + d.getFullYear(),
          key: `m-${d.getTime()}`
        });
      } else if (d.getDay() === 1 && pxPerDay >= 2.5) {
        items.push({
          type: 'week',
          x,
          key: `w-${d.getTime()}`
        });
      }

      d = addDays(d, 1);
    }
    return items;
  }, [range, pxPerDay]);

  return (
    <Axis style={{ width: totalDays * pxPerDay }}>
      {ticks.map(tick => (
        <React.Fragment key={tick.key}>
          {tick.label && (
            <MonthLabel style={{ left: tick.x }}>{tick.label}</MonthLabel>
          )}
          <TickLine style={{ left: tick.x }} $type={tick.type} />
        </React.Fragment>
      ))}
    </Axis>
  );
}

export default React.memo(TimeAxis);
