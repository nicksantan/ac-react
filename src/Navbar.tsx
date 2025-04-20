import React from "react";
import styled from "styled-components";
import OneLineLogo from "./assets/ac-logo-oneline.png";

const Container = styled.nav`
  width: 100%;
  background-color: #f05b2f;
  height: 50px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  box-sizing: border-box;
  font-weight: 700;

  img {
    height: 90px;
  }
  a {
    color: white;
    padding: 0 10px;
    text-decoration: none;
    &:hover {
      opacity: 0.7;
      cursor: pointer;
    }
  }
`;
const LinkContainer = styled.div``;

const Navbar = () => {
  return (
    <Container>
      <a href="/">
        <img src={OneLineLogo} />
      </a>
      <LinkContainer>
        <a href="/About">About</a>
        <a href="/Involved">Get Involved</a>
        <a href="/Games">Games</a>
        <a href="/History">History</a>
      </LinkContainer>
    </Container>
  );
};

export default Navbar;
