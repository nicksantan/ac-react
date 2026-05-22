import Banner from "./Banner";
import styled from "styled-components";
import LogoImg from "./assets/resized-logo-and-text.png";
import { useContent } from "./hooks/useContent";
import { useImagePreload } from "./hooks/useImagePreload";
import { EditableText, EditableImage } from "./components/editable";
import { CONTENT_MAX_WIDTH } from "./styles/constants";

const LogoWrapper = styled.div`
  margin: auto;
  display: block;
  max-width: 600px;
  margin-top: 10px;
  text-align: center;
`;

const MissionStatement = styled.h1`
  text-align: center;
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 10px auto;
  padding: 0 20px;
  font-size: 36px;
  text-transform: none;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const MissionDescription = styled.h2`
  text-align: center;
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 30px auto;
  padding: 0 20px;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ContentArea = styled.div`
  min-height: 400px;
`;

const Home = () => {
  const { content, loading } = useContent();

  // Use local image as fallback if no Firebase URL
  const logoSrc = content.home?.logoUrl?.startsWith('http')
    ? content.home.logoUrl
    : LogoImg;

  const imageLoaded = useImagePreload(logoSrc);
  const isReady = !loading && imageLoaded;

  return (
    <ContentArea className={`content-fade ${isReady ? 'loaded' : ''}`}>
        <LogoWrapper>
          <EditableImage
            src={logoSrc}
            alt="Arcade Commons Logo"
            contentPath="content/home/logoUrl"
            className=""
            style={{ width: '100%' }}
          />
        </LogoWrapper>

        <EditableText
          value={content.home.missionHeading}
          contentPath="content/home/missionHeading"
          as={MissionStatement}
        />
        <EditableText
          value={content.home.missionDescription}
          contentPath="content/home/missionDescription"
          as={MissionDescription}
          multiline
          markdown
        />
        <Banner />
    </ContentArea>
  );
};

export default Home;
