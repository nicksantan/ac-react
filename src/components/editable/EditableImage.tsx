import { useState, useRef, ChangeEvent } from 'react';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import styled from 'styled-components';
import { storage } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuth';
import { useContent } from '../../hooks/useContent';
import {
  ImageEditWrapper,
  ImageEditOverlay,
  EditButton,
  EmptyImagePlaceholder,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalButtonGroup,
  CancelButton,
  SaveButton,
  FileInput,
  UploadProgress
} from './EditableStyles';

interface EditableImageProps {
  src: string;
  alt: string;
  contentPath: string;
  className?: string;
  style?: React.CSSProperties;
  maxSizeBytes?: number;
}

const DEFAULT_MAX_SIZE_BYTES = 5 * 1024 * 1024;

// Preview container that mirrors the actual image styling
const PreviewContainer = styled.div<{ $style?: React.CSSProperties }>`
  width: 100%;
  max-width: 300px;
  margin: 16px auto;
  border-radius: 4px;
  overflow: hidden;
  background: #f0f0f0;
  position: relative;
`;

const PreviewImage = styled.img<{ $objectFit?: string }>`
  width: 100%;
  height: 100%;
  object-fit: ${({ $objectFit }) => $objectFit || 'contain'};
  display: block;
`;

const PreviewLabel = styled.div`
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 8px;
`;

export default function EditableImage({
  src,
  alt,
  contentPath,
  className,
  style,
  maxSizeBytes = DEFAULT_MAX_SIZE_BYTES
}: EditableImageProps) {
  const { isAdmin, editModeEnabled } = useAuth();
  const canEdit = isAdmin && editModeEnabled;
  const { updateContent } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      const maxMB = maxSizeBytes / (1024 * 1024);
      const maxDisplay = maxMB >= 1 ? `${maxMB}MB` : `${Math.round(maxSizeBytes / 1024)}KB`;
      setError(`Image must be less than ${maxDisplay}`);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${selectedFile.name}`;
      const imageRef = storageRef(storage, `images/${filename}`);

      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(imageRef, selectedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setError('Failed to upload image. Please try again.');
          setIsUploading(false);
        },
        async () => {
          // Upload complete - get download URL
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // Update content in database
          await updateContent(contentPath, downloadUrl);

          // Reset and close modal
          setIsModalOpen(false);
          setSelectedFile(null);
          setPreviewUrl(null);
          setUploadProgress(0);
          setIsUploading(false);
        }
      );
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload image. Please try again.');
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setUploadProgress(0);
  };

  // Non-admin or edit mode disabled: render as normal image
  if (!canEdit) {
    return <img src={src} alt={alt} className={className} style={style} />;
  }

  const hasImage = !!src;

  return (
    <>
      {hasImage ? (
        <ImageEditWrapper $isAdmin={canEdit}>
          <img src={src} alt={alt} className={className} style={style} />
          <ImageEditOverlay onClick={() => setIsModalOpen(true)}>
            <EditButton>Change Image</EditButton>
          </ImageEditOverlay>
        </ImageEditWrapper>
      ) : (
        <EmptyImagePlaceholder
          onClick={() => setIsModalOpen(true)}
          className={className}
          style={style}
        >
          <EditButton as="span">+ Add Image</EditButton>
        </EmptyImagePlaceholder>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={handleCancel}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Upload New Image</ModalTitle>

            <FileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />

            {previewUrl && (
              <div>
                <PreviewContainer
                  style={{
                    aspectRatio: style?.aspectRatio as string || (style?.height && style?.width ? undefined : '16/9'),
                    maxHeight: '250px'
                  }}
                >
                  <PreviewImage
                    src={previewUrl}
                    alt="Preview"
                    $objectFit={style?.objectFit as string || 'cover'}
                  />
                </PreviewContainer>
                <PreviewLabel>Preview (showing how image will appear)</PreviewLabel>
              </div>
            )}

            {error && (
              <p style={{ color: '#c00', fontSize: '14px' }}>{error}</p>
            )}

            {isUploading && (
              <UploadProgress $progress={uploadProgress} />
            )}

            <ModalButtonGroup>
              <CancelButton onClick={handleCancel} disabled={isUploading}>
                Cancel
              </CancelButton>
              <SaveButton
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? `Uploading ${Math.round(uploadProgress)}%` : 'Upload'}
              </SaveButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
