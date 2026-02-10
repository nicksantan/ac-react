import styled from 'styled-components';
import { useContent } from './hooks/useContent';
import { EditableText, EditableLink, EditableImage } from './components/editable';
import { CONTENT_MAX_WIDTH } from './styles/constants';

const ContentWrapper = styled.div`
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 0 auto;
  padding: 0px 20px 40px 20px;

  @media (max-width: 768px) {
    text-align: center;

    p {
      text-align: center;
    }
  }
`;

const IntroSection = styled.section`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  align-items: start;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const IntroImagesColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const IntroImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const ColumnsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 50px;
  text-align: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ColumnHeader = styled.h2`
  font-size: 38px;
  font-weight: bold;
  margin-bottom: 20px;
  text-transform: uppercase;
 
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    fill: white;
  }

  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const LinkWrapper = styled.div`
  font-size: 20px;
  margin: 8px 0;
  text-align: center;
`;

// Email icon SVG component
const EmailIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

// Discord icon SVG component
const DiscordIcon = () => (
  <svg viewBox="0 0 127.14 96.36" xmlns="http://www.w3.org/2000/svg">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
  </svg>
);

// Withfriends logo SVG component (original colors)
const WithfriendsLogo = () => (
  <svg viewBox="0 0 235.3 39.5" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path fill="#1F1F1F" d="M3.6,11.7h7.3l3.2,16.9h0.1l3.5-16.9h7.6l3.2,16.9h0.1l3.7-16.9h7.3l-8,24h-6.9L21.3,20h-0.1l-3.6,15.6h-6.9L3.6,11.7z"/>
      <path fill="#1F1F1F" d="M40.6,9V3.6h7V9H40.6z M47.6,11.7v24h-7v-24H47.6z"/>
      <path fill="#1F1F1F" d="M63.7,16.5h-4.2v11.8c0,1.9,0.9,2.4,2.2,2.4c0.8,0,1.8-0.1,2.1-0.1V36c-0.9,0.1-3,0.3-4.5,0.3c-6,0-6.8-3.7-6.8-7.2V16.5h-3.4v-4.3h3.4V5.2h7v6.9h4.2V16.5z"/>
      <path fill="#1F1F1F" d="M65.6,3.6h7v10.4h0.1c1.4-1.8,4.4-2.9,6.6-2.9c5,0,7.5,2.9,7.5,7.7v16.8h-7V21.3c0-3.7-2-4.5-3.5-4.5c-1.6,0-3.6,1-3.6,5.5v13.4h-7V3.6z"/>
      <path fill="#FF877B" d="M97.5,16.5h-3.7v-4.3h3.7V9.8c0-2.7,0.9-6.6,6.8-6.6c1.5,0,3.7,0.2,4.6,0.5v5.1h-2c-1.2,0-2.4,0.4-2.4,1.7v1.5h4.3v4.3h-4.3v19.2h-7V16.5z"/>
      <path fill="#FF877B" d="M110.8,11.7h7v2.4c1.5-1.4,4.1-2.3,6.6-2.5l0,6.2l-0.8,0.1c-4.2,0.5-5.9,1.2-5.9,3.9v13.9h-7V11.7z"/>
      <path fill="#FF877B" d="M126.3,9V3.6h7V9H126.3z M133.3,11.7v23.9h-7V11.7H133.3z"/>
      <path fill="#FF877B" d="M141.9,25.1c0,4.6,3,6,5.2,6c2.6,0,3.8-1.4,5.8-4.2l5.3,2.7c-2.4,4.5-6.3,6.6-11.6,6.6c-7.4,0-11.7-5.1-11.7-11.9c0-8.5,4.5-13.3,11.7-13.3c8.7,0,11.7,6.7,11.7,14H141.9z M151.3,20.8c-0.2-3.5-2.7-4.6-4.8-4.6c-2,0-4.5,1.4-4.8,4.6H151.3z"/>
      <path fill="#FF877B" d="M160.2,11.7h7v2.1c1.8-2.1,4.8-2.7,6.9-2.7c5.7,0,7.2,3.3,7.2,6.9v17.7h-7v-15c0-2.3-0.7-3.9-3.4-3.9c-2.8,0-3.7,1.8-3.7,4v14.9h-7V11.7z"/>
      <path fill="#FF877B" d="M207.3,35.6h-6.8v-2.3h-0.1c-1.2,1.5-3.3,3-6.4,3c-5.8,0-10.4-3.7-10.5-12.4c-0.1-9.5,5.4-12.8,10.2-12.8c1.9,0,4.5,0.4,6.6,2.5v-10h7V35.6z M195.3,16.2c-3.3,0-4.8,2.9-4.8,7.5c0,3.9,0.9,7.5,4.8,7.5c3.6,0,4.9-3.4,4.9-8C200.2,18.9,199,16.2,195.3,16.2z"/>
      <path fill="#FF877B" d="M227.2,18.8c-1.4-1.7-4.4-2.6-6.6-2.6c-1.8,0-3,0.6-3,1.8c0,4.1,14.2,0.7,14.2,9.7c0,6.3-5.6,8.6-10.8,8.6c-5.2,0-8.2-1.5-11.7-4.7l4.4-3.8c2.2,2.1,4.4,3.4,7.6,3.4c1.2,0,3.8-0.3,3.8-2.4c0-3.7-14.2-0.8-14.2-9.3c0-6,5.3-8.4,10.1-8.4c3.7,0,7.3,1.3,10.6,3.5L227.2,18.8z"/>
    </g>
  </svg>
);

const WithfriendsLogoWrapper = styled.div`
  width: 240px;
  height: 80px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LinkDivider = styled.div`
  width: 80%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 4px 0;
`;

export default function GetInvolvedPage() {
  const { content, loading } = useContent();

  const isReady = !loading;

  return (
    <ContentWrapper className={`content-fade ${isReady ? 'loaded' : ''}`}>

      <h1>Get Involved</h1>

      <IntroSection>
        <IntroImagesColumn>
          <IntroImageWrapper>
            <EditableImage
              src={content.getInvolved.introImageUrl}
              alt="Get Involved"
              contentPath="content/getInvolved/introImageUrl"
            />
          </IntroImageWrapper>
        </IntroImagesColumn>
        <div>
          <EditableText
            value={content.getInvolved.intro}
            contentPath="content/getInvolved/intro"
            as="p"
            multiline
          />
          <EditableText
            value={content.getInvolved.howToHelp}
            contentPath="content/getInvolved/howToHelp"
            as="p"
            multiline
          />
          <EditableText
            value={content.getInvolved.closing}
            contentPath="content/getInvolved/closing"
            as="p"
            multiline
            markdown
          />
        </div>
      </IntroSection>

      <ColumnsContainer>
        <Column>
          <ColumnHeader>Contact</ColumnHeader>
          <IconWrapper as="a" href={content.getInvolved.contactEmail.href}>
            <EmailIcon />
          </IconWrapper>
          <LinkWrapper>
            <EditableLink
              text={content.getInvolved.contactEmail.text}
              href={content.getInvolved.contactEmail.href}
              textContentPath="content/getInvolved/contactEmail/text"
              hrefContentPath="content/getInvolved/contactEmail/href"
            />
          </LinkWrapper>
        </Column>

        <Column>
          <ColumnHeader>Donate</ColumnHeader>
          <WithfriendsLogoWrapper
            as="a"
            href={content.getInvolved.donateLinks.membership.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WithfriendsLogo />
          </WithfriendsLogoWrapper>
          <LinkWrapper>
            <EditableLink
              text={content.getInvolved.donateLinks.membership.text}
              href={content.getInvolved.donateLinks.membership.href}
              textContentPath="content/getInvolved/donateLinks/membership/text"
              hrefContentPath="content/getInvolved/donateLinks/membership/href"
              external
            />
          </LinkWrapper>
          <LinkDivider />
          <LinkWrapper>
            <EditableLink
              text={content.getInvolved.donateLinks.oneTime.text}
              href={content.getInvolved.donateLinks.oneTime.href}
              textContentPath="content/getInvolved/donateLinks/oneTime/text"
              hrefContentPath="content/getInvolved/donateLinks/oneTime/href"
              external
            />
          </LinkWrapper>
        </Column>

        <Column>
          <ColumnHeader>Community</ColumnHeader>
          <IconWrapper
            as="a"
            href={content.getInvolved.discordLink.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordIcon />
          </IconWrapper>
          <LinkWrapper>
            <EditableLink
              text={content.getInvolved.discordLink.text}
              href={content.getInvolved.discordLink.href}
              textContentPath="content/getInvolved/discordLink/text"
              hrefContentPath="content/getInvolved/discordLink/href"
              external
            />
          </LinkWrapper>
        </Column>
      </ColumnsContainer>

    </ContentWrapper>
  );
}
