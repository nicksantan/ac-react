import styled, { keyframes } from "styled-components";
import { useContent } from "./hooks/useContent";
import { useAuth } from "./hooks/useAuth";
import { EditableImage } from "./components/editable";
import { CONTENT_MAX_WIDTH } from "./styles/constants";

const MAX_BANNER_IMAGES = 24;
const BANNER_MAX_IMAGE_BYTES = 1024 * 1024;
const BANNER_SECONDS_PER_IMAGE = 4;

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  height: auto;
  margin-top: 50px;
  margin-bottom: 50px;
`;
const scroll = keyframes`
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  `;
const BannerImages = styled.div<{ $durationSeconds: number }>`
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
  width: max-content;
  animation: ${scroll} ${({ $durationSeconds }) => $durationSeconds}s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
  img {
    padding: 20px;
    box-sizing: border-box;
    width: auto;
    max-height: 300px;
    border-radius: 30px;
    flex-shrink: 0;

    @media (max-width: 768px) {
      max-height: 150px;
    }
  }
`;

const EditContainer = styled.div`
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 50px auto 80px;
  padding: 0 20px;
`;

const EditHeading = styled.h3`
  color: white;
  text-align: center;
  margin: 0 0 16px;
  font-size: 20px;
  text-transform: none;
`;

const EditGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
`;

const ImageCellWrapper = styled.div`
  position: relative;
`;

const ImageCell = styled.div`
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 8px;
  background-color: #ddd;
`;

const RemoveButton = styled.button`
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
  z-index: 2;

  ${ImageCellWrapper}:hover & {
    opacity: 1;
  }
`;

const AddButton = styled.button`
  aspect-ratio: 4/3;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  padding: 8px;
  transition: all 0.2s;

  &:hover {
    border-color: #f05b2f;
    color: #f05b2f;
    background: rgba(240, 91, 47, 0.08);
  }
`;

const EmptyState = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  margin: 0 0 16px;
`;

const Banner = () => {
  const { content, updateContent } = useContent();
  const { isAdmin, editModeEnabled } = useAuth();
  const canEdit = isAdmin && editModeEnabled;

  const images = content.banner?.images || [];
  const imageCount = images.length;

  const handleAddBannerImage = async () => {
    if (images.length >= MAX_BANNER_IMAGES) return;
    const newImage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      url: '',
      alt: `Slide ${images.length + 1}`,
    };
    await updateContent('content/banner/images', [...images, newImage]);
  };

  const handleRemoveBannerImage = async (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    await updateContent('content/banner/images', newImages);
  };

  if (canEdit) {
    return (
      <EditContainer>
        <EditHeading>Banner Images ({imageCount}/{MAX_BANNER_IMAGES})</EditHeading>
        {imageCount === 0 && (
          <EmptyState>No banner images yet. Click below to add one.</EmptyState>
        )}
        <EditGrid>
          {images.map((img, index) => (
            <ImageCellWrapper key={img.id || index}>
              <ImageCell>
                <EditableImage
                  src={img.url || ''}
                  alt={img.alt || `Banner image ${index + 1}`}
                  contentPath={`content/banner/images/${index}/url`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  maxSizeBytes={BANNER_MAX_IMAGE_BYTES}
                />
              </ImageCell>
              <RemoveButton
                onClick={() => handleRemoveBannerImage(index)}
                title="Remove image"
              >
                ×
              </RemoveButton>
            </ImageCellWrapper>
          ))}
          {imageCount < MAX_BANNER_IMAGES && (
            <AddButton onClick={handleAddBannerImage}>
              + Add Image<br />({imageCount}/{MAX_BANNER_IMAGES})
            </AddButton>
          )}
        </EditGrid>
      </EditContainer>
    );
  }

  const populatedImages = images.filter((img) => !!img.url);
  if (populatedImages.length === 0) return null;

  const repeatedImages = [...populatedImages, ...populatedImages];

  return (
    <Container>
      <BannerImages $durationSeconds={populatedImages.length * BANNER_SECONDS_PER_IMAGE}>
        {repeatedImages.map((image, index) => (
          <img
            src={image.url}
            alt={image.alt || `Slide ${index}`}
            key={`${image.id || index}-${index}`}
          />
        ))}
      </BannerImages>
    </Container>
  );
};

export default Banner;
