import React from 'react';
import styled from 'styled-components';

const Label = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9.5px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  font-weight: ${({ $isMilestone }) => $isMilestone ? 500 : 400};
  color: ${({ $isMilestone, theme }) =>
    $isMilestone ? theme.colors.textSecondary : theme.colors.textMuted};
  white-space: nowrap;
  pointer-events: none;
  z-index: 6;
  line-height: 1;
  ${({ $isMilestone }) => $isMilestone ? 'letter-spacing: 0.6px;' : ''}

  ${({ $side, theme }) => $side === 'above'
    ? `bottom: calc(50% + ${theme.layout.barH / 2}px + 6px);`
    : `top: calc(50% + ${theme.layout.barH / 2}px + 6px);`
  }
`;

function ExternalLabel({ text, centerX, side, isMilestone }) {
  return (
    <Label
      style={{ left: centerX }}
      $side={side}
      $isMilestone={isMilestone}
    >
      {text}
    </Label>
  );
}

export default React.memo(ExternalLabel);
