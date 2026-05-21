import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { useContent } from '../../hooks/useContent';
import { SaveIndicator } from './EditableStyles';

interface EditableLinkProps {
  text: string;
  href: string;
  textContentPath: string;
  hrefContentPath: string;
  className?: string;
  external?: boolean;
}

const LinkWrapper = styled.span`
  position: relative;
  display: inline-block;
`;

const EditIcon = styled.button<{ $visible: boolean }>`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: #f05b2f;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  transition: opacity 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #d94d25;
  }

  svg {
    width: 14px;
    height: 14px;
    fill: white;
  }
`;

const Popover = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  padding: 16px;
  z-index: 1000;
  min-width: 300px;
`;

const PopoverField = styled.div`
  margin-bottom: 12px;

  &:last-of-type {
    margin-bottom: 16px;
  }
`;

const PopoverLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const PopoverInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  color: #333;
  font-weight: normal;
  box-sizing: border-box;

  &:focus {
    border-color: #f05b2f;
    box-shadow: 0 0 0 2px rgba(240, 91, 47, 0.2);
  }
`;

const PopoverButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const PopoverButton = styled.button<{ $primary?: boolean }>`
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  ${({ $primary }) =>
    $primary
      ? `
        background: #f05b2f;
        color: white;
        &:hover { background: #d94d25; }
        &:disabled { background: #ccc; cursor: not-allowed; }
      `
      : `
        background: #eee;
        color: #333;
        &:hover { background: #ddd; }
      `}
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
`;

export default function EditableLink({
  text,
  href,
  textContentPath,
  hrefContentPath,
  className,
  external = false
}: EditableLinkProps) {
  const { isAdmin } = useAuth();
  const { updateContent } = useContent();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [editHref, setEditHref] = useState(href);
  const [isSaving, setIsSaving] = useState(false);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Update local state when props change
  useEffect(() => {
    setEditText(text);
    setEditHref(href);
  }, [text, href]);

  // Focus text input when popover opens
  useEffect(() => {
    if (isEditing && textInputRef.current) {
      textInputRef.current.focus();
      textInputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save both text and href
      if (editText.trim() !== text.trim()) {
        await updateContent(textContentPath, editText.trim());
      }
      if (editHref.trim() !== href.trim()) {
        await updateContent(hrefContentPath, editHref.trim());
      }
    } catch (error) {
      console.error('Failed to save link:', error);
      setEditText(text);
      setEditHref(href);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(text);
    setEditHref(href);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const linkProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  // Non-admin: render as normal link
  if (!isAdmin) {
    return (
      <a href={href} className={className} {...linkProps}>
        {text}
      </a>
    );
  }

  // Admin view
  return (
    <LinkWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a href={href} className={className} {...linkProps}>
        {text}
      </a>
      <EditIcon
        $visible={isHovered || isEditing}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsEditing(true);
        }}
        title="Edit link"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
      </EditIcon>

      {isEditing && (
        <>
          <Backdrop onClick={handleCancel} />
          <Popover>
            <PopoverField>
              <PopoverLabel>Link Text</PopoverLabel>
              <PopoverInput
                ref={textInputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter link text"
              />
            </PopoverField>
            <PopoverField>
              <PopoverLabel>URL</PopoverLabel>
              <PopoverInput
                type="text"
                value={editHref}
                onChange={(e) => setEditHref(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com"
              />
            </PopoverField>
            <PopoverButtons>
              <PopoverButton onClick={handleCancel}>Cancel</PopoverButton>
              <PopoverButton
                $primary
                onClick={handleSave}
                disabled={isSaving || !editText.trim() || !editHref.trim()}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </PopoverButton>
            </PopoverButtons>
            {isSaving && <SaveIndicator>Saving...</SaveIndicator>}
          </Popover>
        </>
      )}
    </LinkWrapper>
  );
}
