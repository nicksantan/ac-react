import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #0aaf96;
`;

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <PageContainer>
      <Navbar />
      <Outlet />
      <Footer />
    </PageContainer>
  );
};

export default Layout;
