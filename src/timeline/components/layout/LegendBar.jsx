import React from 'react';
import styled from 'styled-components';
import { LEGEND_ITEMS } from '../../config/phases';

const Bar = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  padding: 8px 28px;
  background: ${({ theme }) => theme.colors.bgSurface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  flex-shrink: 0;
  z-index: 6;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${({ $bg }) => $bg};
  opacity: ${({ $opacity }) => $opacity || 1};
  border: ${({ $border }) => $border || 'none'};
`;

const Label = styled.span`
  font-size: 11px;
  letter-spacing: 0.3px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

function LegendBar() {
  return (
    <Bar>
      {LEGEND_ITEMS.map(item => (
        <Item key={item.key}>
          <Dot $bg={item.bg} $opacity={item.opacity} $border={item.border} />
          <Label>{item.label}</Label>
        </Item>
      ))}
    </Bar>
  );
}

export default LegendBar;
