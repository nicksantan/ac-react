import styled, { css, keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const editableHoverStyles = css`
  position: relative;
  cursor: pointer;
  transition: outline 0.2s ease;

  &:hover {
    outline: 2px dashed #f05b2f;
    outline-offset: 4px;
  }
`;

export const EditableWrapper = styled.div<{ $isAdmin: boolean; $isEditing?: boolean }>`
  ${({ $isAdmin, $isEditing }) =>
    $isAdmin && !$isEditing ? editableHoverStyles : ''}
`;

export const EditInput = styled.input`
  width: 100%;
  padding: 8px;
  font: inherit;
  border: 2px solid #f05b2f;
  border-radius: 4px;
  outline: none;
  background: white;

  &:focus {
    box-shadow: 0 0 0 3px rgba(240, 91, 47, 0.2);
  }
`;

export const EditTextarea = styled.textarea`
  width: 100%;
  padding: 8px;
  font: inherit;
  border: 2px solid #f05b2f;
  border-radius: 4px;
  outline: none;
  background: white;
  resize: vertical;
  min-height: 100px;

  &:focus {
    box-shadow: 0 0 0 3px rgba(240, 91, 47, 0.2);
  }
`;

export const SaveIndicator = styled.span`
  display: inline-block;
  margin-left: 8px;
  color: #f05b2f;
  font-size: 12px;
  animation: ${pulse} 1s ease-in-out infinite;
`;

export const ImageEditOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  cursor: pointer;
`;

export const ImageEditWrapper = styled.div<{ $isAdmin: boolean }>`
  position: relative;
  display: inline-block;

  ${({ $isAdmin }) =>
    $isAdmin &&
    css`
      &:hover ${ImageEditOverlay} {
        opacity: 1;
      }
    `}
`;

export const EditButton = styled.button`
  background-color: #f05b2f;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d94d25;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalTitle = styled.h3`
  margin: 0 0 20px;
  color: #333;
`;

export const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const CancelButton = styled.button`
  background-color: #eee;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

export const SaveButton = styled.button`
  background-color: #f05b2f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #d94d25;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const FileInput = styled.input`
  display: block;
  width: 100%;
  padding: 12px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  cursor: pointer;

  &:hover {
    border-color: #f05b2f;
  }
`;

export const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  display: block;
  margin: 16px auto;
  border-radius: 4px;
`;

export const UploadProgress = styled.div<{ $progress: number }>`
  height: 4px;
  background-color: #eee;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 12px;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $progress }) => $progress}%;
    background-color: #f05b2f;
    transition: width 0.3s ease;
  }
`;
