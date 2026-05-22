import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import SampleCabImg from "./assets/SampleCabImg.jpeg";
import { slugify } from "./utils/slugify";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div<{ $animationDelay?: number }>`
  width: 230px;
  display: flex;
  flex-direction: column;
  margin: 0;
  animation: ${fadeIn} 0.3s ease-out forwards;
  animation-delay: ${props => (props.$animationDelay || 0) * 0.05}s;
  opacity: 0;
  h1 {
    font-size: 36px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLink = styled(Link)`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

const ProjectInfo = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 0px 0px 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const ProjectName = styled.span`
  font-weight: bold;
    @media (max-width: 768px) {
    font-size: 0.8em;
  }
`;

const ProjectYear = styled.span`
  opacity: 0.7;
  font-size: 0.9em;
  @media (max-width: 768px) {
    font-size: 0.6em;
  }
`;

const CabThumbnail = styled.img`
  width: 100%;
  height: 245px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
`;

interface GameThumbnailProps {
  id: number;
  name: string;
  year: number;
  imageUrl?: string;
  isInstallation?: boolean;
  animationIndex?: number;
}

const GameThumbnail = ({ name, year, imageUrl, isInstallation, animationIndex = 0 }: GameThumbnailProps) => {
  // Use local fallback if imageUrl starts with /assets or is empty
  const imgSrc = imageUrl && imageUrl.startsWith('http') ? imageUrl : SampleCabImg;

  // Create link using slug for SEO-friendly URLs
  const slug = slugify(name);
  const linkPath = isInstallation ? `/installations/${slug}` : `/games/${slug}`;

  return (
    <Container $animationDelay={animationIndex}>
      <StyledLink to={linkPath}>
        <CabThumbnail src={imgSrc} alt={name} />
        <ProjectInfo>
          <ProjectName>{name}</ProjectName>
          <ProjectYear>{year}</ProjectYear>
        </ProjectInfo>
      </StyledLink>
    </Container>
  );
};

export default GameThumbnail;
