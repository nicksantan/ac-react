import styled, { keyframes } from "styled-components";
import img1 from "./assets/img1.jpeg";
import img2 from "./assets/img2.jpeg";
import img3 from "./assets/img3.jpeg";
import img4 from "./assets/img4.jpeg";
import img5 from "./assets/img5.jpeg";

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  height: 300px;
  height: auto; /* Adjust
  margin-bottom: 300px;
  margin-top: 50px;
 
   
`;
const scroll = keyframes`
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  `;
const BannerImages = styled.div`
  border: 1px dashed rgba(255, 255, 255, 0.4);
  background: -moz-radial-gradient(
      0% 2%,
      circle,
      rgba(96, 16, 48, 0) 9px,
      rgba(255, 255, 255, 0.4) 10px,
      rgba(96, 16, 48, 0) 11px
    ),
    -moz-radial-gradient(100% 100%, rgba(96, 16, 48, 0) 9px, rgba(
            255,
            255,
            255,
            0.4
          )
          10px, rgba(96, 16, 48, 0) 11px),
    none;
  background: -webkit-radial-gradient(
      0% 2%,
      circle,
      rgba(96, 16, 48, 0) 9px,
      rgba(255, 255, 255, 0.4) 10px,
      rgba(96, 16, 48, 0) 11px
    ),
    -webkit-radial-gradient(100% 100%, rgba(96, 16, 48, 0) 9px, rgba(
            255,
            255,
            255,
            0.4
          )
          10px, rgba(96, 16, 48, 0) 11px),
    none;
  background: -ms-radial-gradient(
      0% 2%,
      circle,
      rgba(96, 16, 48, 0) 9px,
      rgba(255, 255, 255, 0.4) 10px,
      rgba(96, 16, 48, 0) 11px
    ),
    -ms-radial-gradient(100% 100%, rgba(96, 16, 48, 0) 9px, rgba(
            255,
            255,
            255,
            0.4
          )
          10px, rgba(96, 16, 48, 0) 11px),
    none;
  background: -o-radial-gradient(
      0% 2%,
      circle,
      rgba(96, 16, 48, 0) 9px,
      rgba(255, 255, 255, 0.4) 10px,
      rgba(96, 16, 48, 0) 11px
    ),
    -o-radial-gradient(100% 100%, rgba(96, 16, 48, 0) 9px, rgba(
            255,
            255,
            255,
            0.4
          )
          10px, rgba(96, 16, 48, 0) 11px),
    none;
  background: radial-gradient(
      0% 2%,
      circle,
      rgba(96, 16, 48, 0) 9px,
      rgba(255, 255, 255, 0.4) 10px,
      rgba(96, 16, 48, 0) 11px
    ),
    radial-gradient(
      100% 100%,
      rgba(96, 16, 48, 0) 9px,
      rgba(255, 255, 255, 0.4) 10px,
      rgba(96, 16, 48, 0) 11px
    ),
    none;
  background-size: 20px 20px;
  display: flex;
  align-items: center;
  width: calc(300%); /* Double the width for seamless looping */
  animation: ${scroll} 20s linear infinite; /* Adjust the duration for desired speed */
  img {
    padding: 20px;
    box-sizing: border-box;
    width: calc(100% / 10); /* Adjust based on the number of images */
    height: 100%;
    object-fit: cover;
    border-radius: 30px;
  }
`;

// import './Banner.css';

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  // Add more image URLs as needed
];

const Banner = () => {
  const repeatedImages = [...images, ...images];

  return (
    <Container>
      <BannerImages>
        {repeatedImages.map((image, index) => (
          <img src={image} alt={`Slide ${index}`} key={index} />
        ))}
      </BannerImages>
    </Container>
  );
};

export default Banner;
