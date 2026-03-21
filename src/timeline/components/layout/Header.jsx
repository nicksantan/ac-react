import React from 'react';
import styled from 'styled-components';
import { useTimeline } from '../../context/TimelineContext';
import ZoomSlider from '../ui/ZoomSlider';

const HeaderWrap = styled.header`
  height: ${({ theme }) => theme.layout.headerH}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSurface};
  flex-shrink: 0;
  z-index: 100;
`;

const AppTitle = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const Brand = styled.span`
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.acTeal};
  font-weight: 500;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.font};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: 0.5px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TodayBtn = styled.button`
  font-family: ${({ theme }) => theme.font};
  font-size: 10px;
  padding: 5px 12px;
  border: 1px solid ${({ theme }) => theme.colors.today};
  color: ${({ theme }) => theme.colors.today};
  background: ${({ theme }) => theme.colors.bgSurface};
  cursor: pointer;
  transition: all 0.15s;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  &:hover {
    background: ${({ theme }) => theme.colors.today};
    color: white;
  }
`;

function Header() {
  const { scrollToToday } = useTimeline();

  return (
    <HeaderWrap>
      <AppTitle>
        <Brand>Arcade Commons</Brand>
        <Title>Project Timeline</Title>
      </AppTitle>
      <Controls>
        <TodayBtn onClick={scrollToToday}>Today</TodayBtn>
        <ZoomSlider />
      </Controls>
    </HeaderWrap>
  );
}

export default Header;
