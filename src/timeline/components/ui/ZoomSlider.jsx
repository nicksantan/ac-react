import React from 'react';
import styled from 'styled-components';
import { useTimeline } from '../../context/TimelineContext';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 400;
`;

const Slider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 120px;
  height: 2px;
  background: ${({ theme }) => theme.colors.border};
  outline: none;
  border-radius: 1px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    border: 2px solid ${({ theme }) => theme.colors.bgSurface};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.border};
    transition: background 0.15s;
  }

  &::-webkit-slider-thumb:hover {
    background: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const Value = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  min-width: 28px;
  text-align: right;
`;

function ZoomSlider() {
  const { zoomLevel, setZoomLevel, ZOOM_MIN, ZOOM_MAX } = useTimeline();

  return (
    <Wrap>
      <Label>Zoom</Label>
      <Slider
        type="range"
        min={ZOOM_MIN}
        max={ZOOM_MAX}
        step={0.5}
        value={zoomLevel}
        onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
      />
      <Value>{zoomLevel}x</Value>
    </Wrap>
  );
}

export default ZoomSlider;
