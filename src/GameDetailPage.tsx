import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { TfiLink, TfiDownload } from 'react-icons/tfi';
import { FaSteam } from 'react-icons/fa';
import { SiItchdotio } from 'react-icons/si';
import { useContent } from './hooks/useContent';
import { useAuth } from './hooks/useAuth';
import { EditableText, EditableImage } from './components/editable';
import { findGameBySlug } from './utils/slugify';
import { CONTENT_MAX_WIDTH } from './styles/constants';
import { GameLink } from './types/content';

const ContentWrapper = styled.div`
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 0 auto;
  padding: 0px 20px 40px 20px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  color: white;
  text-decoration: none;
  margin-bottom: 30px;
  margin-top: 30px;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }

  &::before {
    content: '< ';
  }
`;

const GameCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: 400px 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  background: #f5f5f5;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 900px) {
    order: 2;
  }
`;

const MainImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 3/5;
  overflow: hidden;
  border-radius: 8px;
  background-color: #ddd;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const GalleryImageWrapper = styled.div`
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 6px;
  background-color: #ddd;
`;

const AddGalleryButton = styled.button`
  aspect-ratio: 4/3;
  border: 2px dashed #ccc;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    border-color: #f05b2f;
    color: #f05b2f;
    background: rgba(240, 91, 47, 0.05);
  }
`;

const RemoveGalleryButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
`;

const GalleryImageContainer = styled.div`
  position: relative;

  &:hover ${RemoveGalleryButton} {
    opacity: 1;
  }
`;

const RightColumn = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 900px) {
    order: 1;
  }
`;

const TitleSection = styled.div``;

const GameTitle = styled.h1`
  font-size: 42px;
  line-height: 42px;
  text-transform: none;
  color: #333;
  margin: 0 0 12px;
  text-align: left;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const GameYear = styled.span`
  font-size: 18px;
  color: #666;
  font-weight: 700;
`;

const AvailabilityBadge = styled.span<{ $available: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${({ $available }) => ($available ? '#4caf50' : '#999')};
  color: white;
`;

const CreatorsLine = styled.div`
  font-size: 18px;
  color: #555;
  margin-top: 8px;
`;

const CollaboratorsLine = styled.div`
  font-size: 14px;
  color: #777;
  margin-top: 4px;
`;

const Section = styled.div``;

const SectionTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f05b2f;
`;

const SectionText = styled.div`
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  margin: 0;

  p {
    font-size: inherit;
    color: inherit;
    line-height: inherit;
    margin: 0 0 1em 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const PlaceholderText = styled.p`
  font-size: 16px;
  color: #999;
  font-style: italic;
  margin: 0;
`;

const LinksSection = styled.div``;

const LinksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LinkItem = styled.a`
  color: #f05b2f;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const LinkIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 18px;
`;

const IconSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  min-width: 90px;
`;

const EditableLinkItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
`;

const LinkInput = styled.input`
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  flex: 1;
`;

const RemoveLinkButton = styled.button`
  padding: 6px 10px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #b91c1c;
  }
`;

const AddLinkButton = styled.button`
  padding: 8px 16px;
  background: rgba(240, 91, 47, 0.1);
  color: #f05b2f;
  border: 1px dashed #f05b2f;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 8px;

  &:hover {
    background: rgba(240, 91, 47, 0.2);
  }
`;

const NotFoundMessage = styled.div`
  text-align: center;
  color: white;
  font-size: 18px;
  padding: 60px;
`;

const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  cursor: pointer;
`;

const LightboxImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
`;

const LightboxCloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: white;
  }
`;

const ClickableGalleryWrapper = styled(GalleryImageWrapper)`
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { games, loading, updateContent } = useContent();
  const { isAdmin, editModeEnabled } = useAuth();
  const canEdit = isAdmin && editModeEnabled;
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Determine if this is an installation based on URL path
  const isInstallationRoute = location.pathname.startsWith('/installations/');

  // Find the game by slug
  const arcadeResult = !isInstallationRoute && slug
    ? findGameBySlug(games.arcadeCabinets, slug)
    : null;
  const installResult = isInstallationRoute && slug
    ? findGameBySlug(games.installationGames, slug)
    : null;

  // If not found in the expected category, try the other (for backwards compatibility)
  const fallbackArcade = !arcadeResult && !isInstallationRoute ? null :
    (!installResult && isInstallationRoute && slug ? findGameBySlug(games.arcadeCabinets, slug) : null);
  const fallbackInstall = !installResult && !isInstallationRoute && slug
    ? findGameBySlug(games.installationGames, slug)
    : null;

  const result = arcadeResult || installResult || fallbackArcade || fallbackInstall;
  const displayGame = result?.game;
  const gameKey = result?.key || '';
  const isArcade = !!(arcadeResult || fallbackArcade);

  if (!loading && !displayGame) {
    return (
      <ContentWrapper>
        <BackLink to="/Games">Back to Games</BackLink>
        <NotFoundMessage>Game not found</NotFoundMessage>
      </ContentWrapper>
    );
  }

  if (!displayGame) {
    return (
      <ContentWrapper className="content-fade">
        <BackLink to="/Games">Back to Games</BackLink>
      </ContentWrapper>
    );
  }

  const contentBasePath = isArcade
    ? `games/arcadeCabinets/${gameKey}`
    : `games/installationGames/${gameKey}`;

  const aboutSectionTitle = isArcade ? 'About the Game' : 'About the Work';

  // Get gallery images (dynamic, up to 16)
  const galleryImages = displayGame.galleryImages || [];
  const links = displayGame.links || [];
  const canAddMoreImages = canEdit && galleryImages.length < 16;

  const handleAddGalleryImage = async () => {
    if (galleryImages.length >= 16) return;
    const newImages = [...galleryImages, ''];
    await updateContent(`${contentBasePath}/galleryImages`, newImages);
  };

  const handleRemoveGalleryImage = async (index: number) => {
    const newImages = galleryImages.filter((_, i) => i !== index);
    await updateContent(`${contentBasePath}/galleryImages`, newImages);
  };

  const handleAddLink = async () => {
    const newLinks = [...links, { label: 'New Link', url: 'https://', icon: 'link' as const }];
    await updateContent(`${contentBasePath}/links`, newLinks);
  };

  const handleUpdateLink = async (index: number, field: 'label' | 'url' | 'icon', value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    await updateContent(`${contentBasePath}/links`, newLinks);
  };

  const getLinkIcon = (iconType?: string) => {
    switch (iconType) {
      case 'download':
        return <TfiDownload />;
      case 'steam':
        return <FaSteam />;
      case 'itch':
        return <SiItchdotio />;
      default:
        return <TfiLink />;
    }
  };

  const handleRemoveLink = async (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    await updateContent(`${contentBasePath}/links`, newLinks);
  };

  return (
    <ContentWrapper className={`content-fade ${!loading && displayGame ? 'loaded' : ''}`}>
      <BackLink to="/Games">Back to Games</BackLink>

      <GameCard>
        <LeftColumn>
          <MainImageWrapper>
            <EditableImage
              src={displayGame.mainImageUrl || displayGame.imageUrl}
              alt={displayGame.name}
              contentPath={`${contentBasePath}/mainImageUrl`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </MainImageWrapper>

          <GalleryGrid>
            {galleryImages.map((imgUrl, index) => (
              <GalleryImageContainer key={index}>
                {canEdit ? (
                  <GalleryImageWrapper>
                    <EditableImage
                      src={imgUrl || ''}
                      alt={`${displayGame.name} gallery ${index + 1}`}
                      contentPath={`${contentBasePath}/galleryImages/${index}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </GalleryImageWrapper>
                ) : (
                  <ClickableGalleryWrapper onClick={() => setLightboxImage(imgUrl)}>
                    <img
                      src={imgUrl || ''}
                      alt={`${displayGame.name} gallery ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </ClickableGalleryWrapper>
                )}
                {canEdit && (
                  <RemoveGalleryButton onClick={() => handleRemoveGalleryImage(index)}>
                    ×
                  </RemoveGalleryButton>
                )}
              </GalleryImageContainer>
            ))}
            {canAddMoreImages && (
              <AddGalleryButton onClick={handleAddGalleryImage}>
                + Add Image<br />({galleryImages.length}/16)
              </AddGalleryButton>
            )}
          </GalleryGrid>
        </LeftColumn>

        <RightColumn>
          <TitleSection>
            <EditableText
              value={displayGame.name}
              contentPath={`${contentBasePath}/name`}
              as={GameTitle}
            />

            <MetaRow>
              <GameYear>{displayGame.year}</GameYear>
              <AvailabilityBadge $available={displayGame.available}>
                {displayGame.available ? 'Publicly Available' : 'Not Currently Available'}
              </AvailabilityBadge>
            </MetaRow>

            <CreatorsLine>
              By{' '}
              <EditableText
                value={displayGame.creators || 'Unknown'}
                contentPath={`${contentBasePath}/creators`}
                as="span"
                markdown
              />
            </CreatorsLine>
            {(displayGame.collaborators || canEdit) && (
              <CollaboratorsLine>
                <EditableText
                  value={displayGame.collaborators || ''}
                  contentPath={`${contentBasePath}/collaborators`}
                  as="span"
                  placeholder="Add collaborators..."
                  markdown
                />
              </CollaboratorsLine>
            )}
          </TitleSection>

          <Section>
            <SectionTitle>{aboutSectionTitle}</SectionTitle>
            {displayGame.aboutDescription || canEdit ? (
              <EditableText
                value={displayGame.aboutDescription || ''}
                contentPath={`${contentBasePath}/aboutDescription`}
                as={SectionText}
                multiline
                markdown
                placeholder="Add a description about this game or work..."
              />
            ) : (
              <PlaceholderText>No description available.</PlaceholderText>
            )}
          </Section>

          <Section>
            <SectionTitle>About the Build</SectionTitle>
            {displayGame.buildDescription || canEdit ? (
              <EditableText
                value={displayGame.buildDescription || ''}
                contentPath={`${contentBasePath}/buildDescription`}
                as={SectionText}
                multiline
                markdown
                placeholder="Describe the physical fabrication and build process..."
              />
            ) : (
              <PlaceholderText>No build information available.</PlaceholderText>
            )}
          </Section>

          <Section>
            <SectionTitle>Current Status</SectionTitle>
            {displayGame.currentStatus || canEdit ? (
              <EditableText
                value={displayGame.currentStatus || ''}
                contentPath={`${contentBasePath}/currentStatus`}
                as={SectionText}
                multiline
                markdown
                placeholder="Describe where this arcade/installation is currently located and its status..."
              />
            ) : (
              <PlaceholderText>No status information available.</PlaceholderText>
            )}
          </Section>

          <LinksSection>
            <SectionTitle>Links</SectionTitle>
            {canEdit ? (
              <LinksList>
                {links.map((link: GameLink, index: number) => (
                  <EditableLinkItem key={index}>
                    <IconSelect
                      value={link.icon || 'link'}
                      onChange={(e) => handleUpdateLink(index, 'icon', e.target.value)}
                    >
                      <option value="link">Link</option>
                      <option value="download">Download</option>
                      <option value="steam">Steam</option>
                      <option value="itch">itch.io</option>
                    </IconSelect>
                    <LinkInput
                      value={link.label}
                      onChange={(e) => handleUpdateLink(index, 'label', e.target.value)}
                      placeholder="Link label"
                    />
                    <LinkInput
                      value={link.url}
                      onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                      placeholder="URL"
                    />
                    <RemoveLinkButton onClick={() => handleRemoveLink(index)}>
                      Remove
                    </RemoveLinkButton>
                  </EditableLinkItem>
                ))}
                <AddLinkButton onClick={handleAddLink}>+ Add Link</AddLinkButton>
              </LinksList>
            ) : links.length > 0 ? (
              <LinksList>
                {links.map((link: GameLink, index: number) => (
                  <LinkItem key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                    <LinkIcon>{getLinkIcon(link.icon)}</LinkIcon>
                    {link.label}
                  </LinkItem>
                ))}
              </LinksList>
            ) : (
              <PlaceholderText>No links available.</PlaceholderText>
            )}
          </LinksSection>
        </RightColumn>
      </GameCard>

      {lightboxImage && (
        <LightboxOverlay onClick={() => setLightboxImage(null)}>
          <LightboxCloseButton onClick={() => setLightboxImage(null)}>
            ×
          </LightboxCloseButton>
          <LightboxImage
            src={lightboxImage}
            alt="Gallery image"
            onClick={(e) => e.stopPropagation()}
          />
        </LightboxOverlay>
      )}
    </ContentWrapper>
  );
}
