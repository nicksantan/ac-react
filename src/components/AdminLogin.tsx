import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0aaf96;
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const AdminCard = styled(LoginCard)`
  max-width: 500px;
`;

const AdminLinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
`;

const AdminLink = styled(Link)`
  display: block;
  padding: 16px 20px;
  background-color: #f8f8f8;
  color: #333;
  text-decoration: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid #eee;

  &:hover {
    background-color: #f05b2f;
    color: white;
    border-color: #f05b2f;
  }
`;

const LogoutButton = styled.button`
  display: block;
  width: 100%;
  padding: 14px 20px;
  background-color: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 20px;

  &:hover {
    background-color: #fee;
    color: #c00;
    border-color: #fcc;
  }
`;

const UserInfo = styled.div`
  background-color: #e8f4fd;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #1976d2;
`;

const AdminBadge = styled.span`
  display: inline-block;
  background-color: #f05b2f;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
  font-size: 24px;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  background-color: white;
  color: #333;
  padding: 14px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f8f8f8;
    border-color: #ccc;
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }
`;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332A8.997 8.997 0 009.003 18z" fill="#34A853"/>
    <path d="M3.964 10.712A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.33z" fill="#FBBC05"/>
    <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0A8.997 8.997 0 00.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
  </svg>
);

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c00;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 20px;
`;

const InfoMessage = styled.div`
  background-color: #e8f4fd;
  color: #1976d2;
  padding: 12px;
  border-radius: 4px;
  font-size: 13px;
  margin-top: 20px;
  line-height: 1.5;
`;

const BackLink = styled.a`
  display: block;
  margin-top: 20px;
  color: #666;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    color: #f05b2f;
  }
`;

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginWithGoogle, logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, not an error
        setError('');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Show admin dashboard if logged in
  if (user) {
    return (
      <LoginContainer>
        <AdminCard>
          <Title>Admin Dashboard</Title>
          <UserInfo>
            Signed in as {user.email}
            {isAdmin && <AdminBadge>Admin</AdminBadge>}
          </UserInfo>

          {isAdmin ? (
            <AdminLinkList>
              <AdminLink to="/admin-games">Manage Games</AdminLink>
              <AdminLink to="/admin-log">Edit Log</AdminLink>
            </AdminLinkList>
          ) : (
            <InfoMessage>
              You are signed in but do not have admin privileges. Contact your administrator to request access.
            </InfoMessage>
          )}

          <LogoutButton onClick={handleLogout}>Sign Out</LogoutButton>
          <BackLink href="/">Back to Home</BackLink>
        </AdminCard>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Admin Login</Title>
        <Subtitle>Sign in with your organization Google account</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin} disabled={isSubmitting}>
          <GoogleIcon />
          {isSubmitting ? 'Signing in...' : 'Sign in with Google'}
        </GoogleButton>

        <InfoMessage>
          Only authorized admins can edit site content. If you sign in but don't see edit controls, contact your administrator.
        </InfoMessage>

        <BackLink href="/">Back to Home</BackLink>
      </LoginCard>
    </LoginContainer>
  );
}
