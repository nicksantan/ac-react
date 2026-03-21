import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTimeline } from '../../context/TimelineContext';
import ProjectForm from './ProjectForm';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.15);
  backdrop-filter: blur(2px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  width: 560px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 16px 48px rgba(0,0,0,0.12);
  border-radius: 4px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};
`;

const ModalTitle = styled.h2`
  font-family: ${({ theme }) => theme.font};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const CloseBtn = styled.button`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  background: none;
  border: none;
  font-family: ${({ theme }) => theme.font};
  padding: 4px 8px;
  transition: color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

function Modal() {
  const { modalOpen, closeModal, editingProjectId } = useTimeline();

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') closeModal();
  }, [closeModal]);

  useEffect(() => {
    if (modalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [modalOpen, handleKeyDown]);

  if (!modalOpen) return null;

  return (
    <Overlay onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <ModalBox>
        <ModalHeader>
          <ModalTitle>{editingProjectId ? 'Edit Project' : 'Add Project'}</ModalTitle>
          <CloseBtn onClick={closeModal}>&times;</CloseBtn>
        </ModalHeader>
        <ProjectForm />
      </ModalBox>
    </Overlay>
  );
}

export default Modal;
