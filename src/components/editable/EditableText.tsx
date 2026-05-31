import { useState, useRef, useEffect, KeyboardEvent, ElementType, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../hooks/useAuth';
import { useContent } from '../../hooks/useContent';
import { EditableWrapper, EditInput, EditTextarea, SaveIndicator } from './EditableStyles';

interface EditableTextProps {
  value: string;
  contentPath: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  markdown?: boolean;
}

const TextWrapper = styled(EditableWrapper)`
  display: inline;
`;

const PlaceholderText = styled.span`
  color: #999;
  font-style: italic;
`;

// Styled wrapper for markdown content to inherit parent styles
const MarkdownWrapper = styled.span`
  display: inline;
  font-size: inherit;
  color: inherit;
  line-height: inherit;

  a {
    color: inherit;
  }

  p {
    display: block;
    font-size: inherit;
    color: inherit;
    line-height: inherit;
    margin: 0 0 1em 0;

    &:last-child {
      margin-bottom: 0;
    }

    &:first-child:last-child {
      display: inline;
    }
  }
`;

export default function EditableText({
  value,
  contentPath,
  as: Component = 'span',
  className,
  multiline = false,
  placeholder = 'Enter text...',
  markdown = false
}: EditableTextProps) {
  const { isAdmin, editModeEnabled } = useAuth();
  const canEdit = isAdmin && editModeEnabled;
  const { updateContent } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  // Initialize with empty string to prevent uncontrolled input warning
  const [editValue, setEditValue] = useState(value ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update edit value when prop changes
  useEffect(() => {
    setEditValue(value ?? '');
  }, [value]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      const ref = multiline ? textareaRef.current : inputRef.current;
      if (ref) {
        ref.focus();
        ref.select();
      }
    }
  }, [isEditing, multiline]);

  const handleSave = async () => {
    const currentValue = value ?? '';
    const newValue = editValue ?? '';

    if (newValue.trim() === currentValue.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await updateContent(contentPath, newValue.trim());
    } catch (error) {
      console.error('Failed to save:', error);
      setEditValue(currentValue); // Revert on error
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditValue(value ?? '');
      setIsEditing(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };

  // Render content (with optional markdown)
  const renderContent = (text: string) => {
    if (markdown && text) {
      return (
        <MarkdownWrapper>
          <ReactMarkdown
            components={{
              // Use React Router Link for internal routes, regular <a> for external
              a: ({ href, children }) => {
                if (href?.startsWith('/')) {
                  return <Link to={href}>{children}</Link>;
                }
                return (
                  <a
                    href={href}
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                );
              }
            }}
          >
            {text}
          </ReactMarkdown>
        </MarkdownWrapper>
      );
    }
    return text;
  };

  // Non-admin or edit mode disabled: render as normal text
  if (!canEdit) {
    return <Component className={className}>{renderContent(value)}</Component>;
  }

  // Admin in edit mode
  if (isEditing) {
    return (
      <div style={{ display: 'inline-block', width: '100%' }}>
        {multiline ? (
          <EditTextarea
            ref={textareaRef}
            value={editValue}
            onChange={handleChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={className}
          />
        ) : (
          <EditInput
            ref={inputRef}
            value={editValue}
            onChange={handleChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={className}
          />
        )}
        {isSaving && <SaveIndicator>Saving...</SaveIndicator>}
      </div>
    );
  }

  // Admin view mode: clickable to edit
  return (
    <TextWrapper
      $isAdmin={canEdit}
      $isEditing={isEditing}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      <Component className={className}>
        {value ? renderContent(value) : <PlaceholderText>{placeholder}</PlaceholderText>}
      </Component>
    </TextWrapper>
  );
}
