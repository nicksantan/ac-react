import styled from 'styled-components';
import LogoImg from './assets/resized-logo-and-text.png';
import { useContent } from './hooks/useContent';
import { useImagePreload } from './hooks/useImagePreload';
import { EditableText, EditableImage } from './components/editable';
import { CONTENT_MAX_WIDTH } from './styles/constants';

const ContentWrapper = styled.div`
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 0 auto;
  padding: 0px 20px 40px 20px;
`;

const LogoWrapper = styled.div`
  margin: auto;
  display: block;
  max-width: 500px;
  margin-top: 10px;
  margin-bottom: 30px;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const BulletList = styled.ul`
  font-size: 20px;
  line-height: 1.5;
  margin: 30px auto;
  padding-left: 30px;
  max-width: ${CONTENT_MAX_WIDTH};
  text-align: left;

  li {
    margin-bottom: 10px;
  }
`;

export default function AboutPage() {
  const { content, loading } = useContent();

  const logoSrc = content.home?.logoUrl?.startsWith('http')
    ? content.home.logoUrl
    : LogoImg;

  const imageLoaded = useImagePreload(logoSrc);
  const isReady = !loading && imageLoaded;

  return (
    <ContentWrapper className={`content-fade ${isReady ? 'loaded' : ''}`}>
        <LogoWrapper>
          <EditableImage
            src={logoSrc}
            alt="Arcade Commons Logo"
            contentPath="content/home/logoUrl"
            style={{ width: '100%' }}
          />
        </LogoWrapper>

        <Section>
          <EditableText
            value={content.about.intro}
            contentPath="content/about/intro"
            as="p"
            multiline
          />
        </Section>

        <Section>
          <EditableText
            value={content.about.history}
            contentPath="content/about/history"
            as="p"
            multiline
          />

          <BulletList>
            <li>
              <EditableText
                value={content.about.highlights[0]}
                contentPath="content/about/highlights/0"
                as="span"
                markdown
              />
            </li>
            <li>
              <EditableText
                value={content.about.highlights[1]}
                contentPath="content/about/highlights/1"
                as="span"
                markdown
              />
            </li>
            <li>
              <EditableText
                value={content.about.highlights[2]}
                contentPath="content/about/highlights/2"
                as="span"
                markdown
              />
            </li>
            <li>
              <EditableText
                value={content.about.highlights[3]}
                contentPath="content/about/highlights/3"
                as="span"
                markdown
              />
            </li>
            <li>
              <EditableText
                value={content.about.highlights[4]}
                contentPath="content/about/highlights/4"
                as="span"
                markdown
              />
            </li>
          </BulletList>
        </Section>

        <Section>
          <EditableText
            value={content.about.closing}
            contentPath="content/about/closing"
            as="p"
            multiline
          />
        </Section>
      </ContentWrapper>
  );
}
