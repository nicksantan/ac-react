import React from "react";
import styled from "styled-components";
import OneLineLogo from "./assets/ac-logo-oneline.png";
import Navbar from "./Navbar";
import SampleCabImg from "./assets/SampleCabImg.jpeg";

const Container = styled.nav`
  width: 230px;
  margin: auto;
  display: flex;
  flex-direction: column;
  margin: 0;
  h1 {
    font-size: 36px;
  }

  a {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    &:hover {
      cursor: pointer;
      opacity: 0.7;
    }
  }
`;

const ProjectName = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-weight: bold;
  padding: 10px;
  border-radius: 0px 0px 10px 10px;
`;

const CabThumbnail = styled.img`
  width: 100%;
  border-radius: 10px 10px 0 0;
`;

const GameThumbnail = (props: { name: string }) => {
  return (
    <Container>
      <a href="/Games/Hoverburger">
        <>
          <CabThumbnail src={SampleCabImg} />

          <ProjectName>{props.name}</ProjectName>
        </>
      </a>
    </Container>
  );
};

export default GameThumbnail;
