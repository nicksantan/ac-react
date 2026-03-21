import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';

const IndicatorWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background-color: purple;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  font-size: 30px;
`;

const EditModeText = styled.span`
  font-weight: 600;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  background-color: ${({ $active }) => $active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $active }) => $active ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'};
  }
`;

const LogoutButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const AdminLink = styled(Link)`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: normal;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

export default function AdminIndicator() {
  const { isAdmin, logout, user, editModeEnabled, toggleEditMode } = useAuth();
  const { pathname } = useLocation();

  if (!isAdmin || !user || pathname === '/timeline') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <IndicatorWrapper>
      <EditModeText>{editModeEnabled ? 'Edit Mode' : 'View Mode'}</EditModeText>
      <ToggleButton $active={editModeEnabled} onClick={toggleEditMode}>
        {editModeEnabled ? 'Editing On' : 'Editing Off'}
      </ToggleButton>
      <AdminLink to="/admin">Admin</AdminLink>
      <LogoutButton onClick={handleLogout}>
        Logout
      </LogoutButton>
    </IndicatorWrapper>
  );
}
