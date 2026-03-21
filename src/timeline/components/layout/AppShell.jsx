import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import LegendBar from './LegendBar';
import BottomNav from './BottomNav';
import TimelineContainer from '../timeline/TimelineContainer';
import Modal from '../ui/Modal';

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const TimelineBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

function AppShell() {
  return (
    <Shell>
      <Header />
      <LegendBar />
      <TimelineBody>
        <TimelineContainer />
      </TimelineBody>
      <BottomNav />
      <Modal />
    </Shell>
  );
}

export default AppShell;
