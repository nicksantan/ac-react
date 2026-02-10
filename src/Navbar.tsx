import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TfiMenu } from "react-icons/tfi";
import OneLineLogo from "./assets/ac-logo-oneline.png";
import SmallLogo from "./assets/small-ac-logo.png";

const Container = styled.nav`
  width: 100%;
  background-color: #f05b2f;
  height: 60px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  box-sizing: border-box;
  font-weight: 700;
  position: relative;

  @media (max-width: 768px) {
    position: sticky;
    top: 0;
    z-index: 100;
    border: none;
    box-shadow: none;
  }

  a {
    color: white;
    font-size: 20px;
    padding: 0 10px;
    text-decoration: none;
    &:hover {
      opacity: 0.7;
      cursor: pointer;
    }
  }
`;

const DesktopLogo = styled.img`
  height: 90px;
  position: relative;
  top: 3px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const MobileLogo = styled.img`
  height: 45px;
  display: none;

  @media (max-width: 900px) {
    display: block;
  }
`;

const LinkContainer = styled.div`
  @media (max-width: 900px) {
    display: none;
  }
`;

const HamburgerIcon = styled.div`
  display: none;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;

  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 900px) {
    display: flex;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 60px;
  right: 0;
  background: #f05b2f;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  z-index: 99;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const MenuItem = styled.div`
  padding: 16px 24px;
  color: white;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  text-align: right;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Sunset = styled.div`
  height: 22px;
  width: 100%;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SunsetTwo = styled(Sunset)`
  background-color: #fdcb7e;
`;

const SunsetThree = styled(Sunset)`
  background-color: #fff4ae;
`;

const SunsetFour = styled(Sunset)`
  background-color: #9bc854;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'About', path: '/About' },
    { label: 'Get Involved', path: '/Involved' },
    { label: 'Games', path: '/Games' },
  ];

  const handleMenuClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !(e.target as Element).closest('nav')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <Container>
        <Link to="/">
          <DesktopLogo src={OneLineLogo} alt="Arcade Commons" />
          <MobileLogo src={SmallLogo} alt="Arcade Commons" />
        </Link>
        <LinkContainer>
          <Link to="/About">About</Link>
          <Link to="/Involved">Get Involved</Link>
          <Link to="/Games">Games</Link>
        </LinkContainer>
        <HamburgerIcon onClick={() => setIsOpen(!isOpen)}>
          <TfiMenu />
        </HamburgerIcon>
        <MobileMenu $isOpen={isOpen}>
          {menuItems.map((item) => (
            <MenuItem key={item.path} onClick={() => handleMenuClick(item.path)}>
              {item.label}
            </MenuItem>
          ))}
        </MobileMenu>
      </Container>
      <SunsetTwo />
      <SunsetThree />
      <SunsetFour />
    </>
  );
};

export default Navbar;
