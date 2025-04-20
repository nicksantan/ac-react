import React from "react";
import Navbar from "./Navbar";
import Banner from "./Banner";
import styled from "styled-components";
import LogoImg from "./assets/resized-logo-and-text.png";

const Logo = styled.img`
  margin: auto;
  display: block;
  width: 500px;
  margin-top: 10px;
`;

const MissionStatement = styled.h1`
  text-align: center;
  width: 900px;
  margin: auto;
  margin: 10px auto;
`;
const MissionDescription = styled.h2`
  text-align: center;
  width: 900px;
  margin: auto;
  margin: 30px auto;
  font-weight: 400;
`;

const Sunset = styled.div`
  height: 22px;
  width: 100%;
`;
const SunsetOne = styled(Sunset)`
  background-color: #f05b2f;
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

const Photos = styled.section``;

const Home = () => {
  return (
    <>
      <Navbar />
      <SunsetTwo />
      <SunsetThree />
      <SunsetFour />
      <Logo src={LogoImg} />

      <MissionStatement>
        Arcade Commons is a collective of artists, developers, designers, and
        fabricators that make independent arcade cabinets and other physical
        game installations
      </MissionStatement>
      <MissionDescription>
        Our mission is to help creators with the resources they need to create
        installation art and arcade games. We educate, counsel, and support
        creators on how to fabricate arcade cabinets and develop fun, accessible
        games for everyone. Learn how you can play games we've helped make or
        get involved!
      </MissionDescription>
      <Banner />
    </>
  );
};

export default Home;
