import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from './config/theme';
import GlobalStyle from './styles/GlobalStyle';
import { TimelineProvider } from './context/TimelineContext';
import AppShell from './components/layout/AppShell';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const FullScreen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.textPrimary};
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
`;

const GatePage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'DM Mono', monospace;
  color: #4A4A48;
  gap: 16px;
`;

const BackLink = styled.button`
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #0AAF96;
  background: none;
  border: 1px solid #0AAF96;
  padding: 6px 16px;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.15s;

  &:hover {
    background: #0AAF96;
    color: white;
  }
`;

function TimelinePage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <GatePage>
        <span>Loading...</span>
      </GatePage>
    );
  }

  if (!isAdmin) {
    return (
      <GatePage>
        <span style={{ fontSize: 13 }}>Admin access required</span>
        <BackLink onClick={() => navigate('/')}>Back to site</BackLink>
      </GatePage>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <FullScreen>
        <TimelineProvider>
          <AppShell />
        </TimelineProvider>
      </FullScreen>
    </ThemeProvider>
  );
}

export default TimelinePage;
