import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from './hooks/useAuth';
import { useContent } from './hooks/useContent';
import { CONTENT_MAX_WIDTH } from './styles/constants';
import { Game, InstallationGame, GameLink } from './types/content';
import { uploadImage } from './utils/imageUpload';
import SampleCabImg from './assets/SampleCabImg.jpeg';

const PageWrapper = styled.div`
  max-width: ${CONTENT_MAX_WIDTH};
  margin: 0 auto;
  padding: 0px 20px 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  margin: 0;
`;

const BackLink = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 24px;
`;

const AddButton = styled.button`
  background: #22c55e;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;

  &:hover {
    background: #16a34a;
  }
`;

const GameList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const GameItem = styled.div<{ $inactive?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px 20px;
  opacity: ${props => props.$inactive ? 0.5 : 1};
`;

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const GameImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
`;

const GameDetails = styled.div``;

const GameName = styled.div`
  font-size: 24px;
  font-weight: 600;
`;

const GameMeta = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 6px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const EditButton = styled.button`
  background: #3b82f6;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
  }
`;

const StatusButton = styled.button<{ $isActive?: boolean }>`
  background: ${props => props.$isActive ? '#dc2626' : '#22c55e'};
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background: ${props => props.$isActive ? '#b91c1c' : '#16a34a'};
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
  }
`;

const ViewLink = styled(Link)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 18px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const EditForm = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 24px;
`;

const EditFormTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 12px;
`;

const EditSection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const EditSectionTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
`;

const AddForm = styled.form`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const FormTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 24px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const FormField = styled.div<{ $fullWidth?: boolean }>`
  flex: ${props => props.$fullWidth ? '1 1 100%' : '1'};
  min-width: ${props => props.$fullWidth ? '100%' : '200px'};
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
  }

  &:focus {
    outline: none;
    border-color: #f05b2f;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  box-sizing: border-box;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
  }

  &:focus {
    outline: none;
    border-color: #f05b2f;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #f05b2f;
  }
`;

const FormButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: #22c55e;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;

  &:hover {
    background: #16a34a;
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
  }
`;

const ImageUploadArea = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const ImagePreview = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

const ImageUploadButton = styled.label`
  display: inline-block;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #f05b2f;
  }

  input {
    display: none;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

const GalleryItem = styled.div`
  position: relative;
  aspect-ratio: 1;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
`;

const GalleryRemoveButton = styled.button`
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

  &:hover {
    background: #dc2626;
  }
`;

const AddGalleryButton = styled.label`
  aspect-ratio: 1;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24px;
  transition: all 0.2s;

  &:hover {
    border-color: #f05b2f;
    color: #f05b2f;
  }

  input {
    display: none;
  }
`;

const LinkRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const LinkInput = styled(Input)`
  flex: 1;
  min-width: 150px;
`;

const LinkSelect = styled(Select)`
  width: auto;
  min-width: 100px;
`;

const RemoveLinkButton = styled.button`
  padding: 10px 14px;
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
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #f05b2f;
  }
`;

const AccessDenied = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 18px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 0px 20px 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid #dc2626;
  color: #fca5a5;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const UploadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  font-size: 18px;
`;

interface EditState {
  name: string;
  year: string;
  available: string;
  imageUrl: string;
  mainImageUrl: string;
  creators: string;
  collaborators: string;
  aboutDescription: string;
  buildDescription: string;
  currentStatus: string;
  galleryImages: string[];
  links: GameLink[];
}

const defaultEditState: EditState = {
  name: '',
  year: '',
  available: 'false',
  imageUrl: '',
  mainImageUrl: '',
  creators: '',
  collaborators: '',
  aboutDescription: '',
  buildDescription: '',
  currentStatus: '',
  galleryImages: [],
  links: [],
};

export default function AdminGamesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { games, loading: contentLoading, addGame, updateContent } = useContent();
  const navigate = useNavigate();

  const [showArcadeForm, setShowArcadeForm] = useState(false);
  const [showInstallationForm, setShowInstallationForm] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Arcade cabinet form state
  const [arcadeName, setArcadeName] = useState('');
  const [arcadeYear, setArcadeYear] = useState(new Date().getFullYear().toString());
  const [arcadeAvailable, setArcadeAvailable] = useState('false');

  // Installation game form state
  const [installationName, setInstallationName] = useState('');
  const [installationYear, setInstallationYear] = useState(new Date().getFullYear().toString());
  const [installationAvailable, setInstallationAvailable] = useState('false');

  // Edit state
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<'arcadeCabinets' | 'installationGames' | null>(null);
  const [editState, setEditState] = useState<EditState>(defaultEditState);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleAddArcade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arcadeName.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await addGame('arcadeCabinets', {
        name: arcadeName.trim(),
        year: parseInt(arcadeYear, 10),
        available: arcadeAvailable === 'true',
        active: true,
        imageUrl: SampleCabImg
      });
      setArcadeName('');
      setArcadeYear(new Date().getFullYear().toString());
      setArcadeAvailable('false');
      setShowArcadeForm(false);
    } catch (err) {
      console.error('Failed to add arcade game:', err);
      setError(err instanceof Error ? err.message : 'Failed to add arcade game. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddInstallation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!installationName.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await addGame('installationGames', {
        name: installationName.trim(),
        year: parseInt(installationYear, 10),
        available: installationAvailable === 'true',
        active: true,
        imageUrl: SampleCabImg
      });
      setInstallationName('');
      setInstallationYear(new Date().getFullYear().toString());
      setInstallationAvailable('false');
      setShowInstallationForm(false);
    } catch (err) {
      console.error('Failed to add installation game:', err);
      setError(err instanceof Error ? err.message : 'Failed to add installation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (type: 'arcadeCabinets' | 'installationGames', gameKey: string) => {
    setToggling(gameKey);
    try {
      const game = type === 'arcadeCabinets'
        ? games.arcadeCabinets[gameKey]
        : games.installationGames[gameKey];
      const updatedGame = {
        ...game,
        active: !(game.active ?? true)
      };
      await updateContent(`games/${type}/${gameKey}`, updatedGame);
    } catch (error) {
      console.error('Failed to toggle game status:', error);
    } finally {
      setToggling(null);
    }
  };

  const startEdit = (type: 'arcadeCabinets' | 'installationGames', game: (Game | InstallationGame) & { key: string }) => {
    setEditingKey(game.key);
    setEditingType(type);
    setError(null);
    setEditState({
      name: game.name,
      year: game.year.toString(),
      available: game.available ? 'true' : 'false',
      imageUrl: game.imageUrl || '',
      mainImageUrl: game.mainImageUrl || '',
      creators: game.creators || '',
      collaborators: game.collaborators || '',
      aboutDescription: game.aboutDescription || '',
      buildDescription: game.buildDescription || '',
      currentStatus: game.currentStatus || '',
      galleryImages: game.galleryImages || [],
      links: game.links || [],
    });
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditingType(null);
    setEditState(defaultEditState);
    setError(null);
  };

  const handleImageUpload = async (
    file: File,
    field: 'imageUrl' | 'mainImageUrl'
  ) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, `games/${editingType}/${editingKey}`);
      setEditState(prev => ({ ...prev, [field]: url }));
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (file: File) => {
    if (editState.galleryImages.length >= 16) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, `games/${editingType}/${editingKey}/gallery`);
      setEditState(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, url]
      }));
    } catch (error) {
      console.error('Failed to upload gallery image:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setEditState(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  const addLink = () => {
    setEditState(prev => ({
      ...prev,
      links: [...prev.links, { label: '', url: '', icon: 'link' }]
    }));
  };

  const updateLink = (index: number, field: keyof GameLink, value: string) => {
    setEditState(prev => {
      const newLinks = [...prev.links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, links: newLinks };
    });
  };

  const removeLink = (index: number) => {
    setEditState(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!editName.trim() || !editingKey || !editingType) return;

    setSubmitting(true);
    setError(null);
    try {
      const game = editingType === 'arcadeCabinets'
        ? games.arcadeCabinets[editingKey]
        : games.installationGames[editingKey];

      // Build updated game object, using null for empty optional fields
      // to properly clear them in Firebase
      const filteredLinks = editState.links.filter(l => l.label && l.url);

      const updatedGame: Record<string, unknown> = {
        ...game,
        name: editState.name.trim(),
        year: parseInt(editState.year, 10),
        available: editState.available === 'true',
        imageUrl: editState.imageUrl || game.imageUrl,
        mainImageUrl: editState.mainImageUrl || null,
        creators: editState.creators || null,
        collaborators: editState.collaborators || null,
        aboutDescription: editState.aboutDescription || null,
        buildDescription: editState.buildDescription || null,
        currentStatus: editState.currentStatus || null,
        galleryImages: editState.galleryImages.length > 0 ? editState.galleryImages : null,
        links: filteredLinks.length > 0 ? filteredLinks : null,
      };

      await updateContent(`games/${editingType}/${editingKey}`, updatedGame);
      cancelEdit();
    } catch (err) {
      console.error('Failed to update game:', err);
      setError(err instanceof Error ? err.message : 'Failed to save changes. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const editName = editState.name;

  if (authLoading) {
    return (
      <PageWrapper>
        <LoadingState>Loading...</LoadingState>
      </PageWrapper>
    );
  }

  if (!isAdmin) {
    return (
      <PageWrapper>
        <AccessDenied>
          <h2>Access Denied</h2>
          <p>You must be logged in as an admin to view this page.</p>
          <BackLink onClick={() => navigate('/')}>Go Home</BackLink>
        </AccessDenied>
      </PageWrapper>
    );
  }

  const arcadeGamesArray = Object.entries(games.arcadeCabinets).map(([key, game]) => ({
    ...game,
    key
  }));

  const installationGamesArray = Object.entries(games.installationGames).map(([key, game]) => ({
    ...game,
    key
  }));

  const renderEditForm = (gameType: 'arcadeCabinets' | 'installationGames') => (
    <EditForm>
      <EditFormTitle>Edit {editState.name}</EditFormTitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Basic Info */}
      <EditSection>
        <EditSectionTitle>Basic Information</EditSectionTitle>
        <FormRow>
          <FormField>
            <Label>Game Name</Label>
            <Input
              type="text"
              value={editState.name}
              onChange={(e) => setEditState(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter game name"
            />
          </FormField>
          <FormField>
            <Label>Year</Label>
            <Input
              type="number"
              value={editState.year}
              onChange={(e) => setEditState(prev => ({ ...prev, year: e.target.value }))}
              min="1970"
              max="2099"
            />
          </FormField>
          <FormField>
            <Label>Publicly Available</Label>
            <Select
              value={editState.available}
              onChange={(e) => setEditState(prev => ({ ...prev, available: e.target.value }))}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </Select>
          </FormField>
        </FormRow>
        <FormRow>
          <FormField $fullWidth>
            <Label>Creators</Label>
            <Input
              type="text"
              value={editState.creators}
              onChange={(e) => setEditState(prev => ({ ...prev, creators: e.target.value }))}
              placeholder="e.g., John Doe, Jane Smith"
            />
          </FormField>
        </FormRow>
        <FormRow>
          <FormField $fullWidth>
            <Label>Collaborators (optional)</Label>
            <Input
              type="text"
              value={editState.collaborators}
              onChange={(e) => setEditState(prev => ({ ...prev, collaborators: e.target.value }))}
              placeholder="e.g., Additional contributors..."
            />
          </FormField>
        </FormRow>
      </EditSection>

      {/* Images */}
      <EditSection>
        <EditSectionTitle>Images</EditSectionTitle>
        <FormRow>
          <FormField>
            <Label>Thumbnail (shown in grid)</Label>
            <ImageUploadArea>
              {editState.imageUrl && (
                <ImagePreview src={editState.imageUrl} alt="Thumbnail" />
              )}
              <ImageUploadButton>
                Change Thumbnail
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'imageUrl');
                  }}
                />
              </ImageUploadButton>
            </ImageUploadArea>
          </FormField>
          <FormField>
            <Label>Main Image (shown on detail page)</Label>
            <ImageUploadArea>
              {editState.mainImageUrl && (
                <ImagePreview src={editState.mainImageUrl} alt="Main" />
              )}
              <ImageUploadButton>
                {editState.mainImageUrl ? 'Change' : 'Upload'} Main Image
                <input
                  ref={mainImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'mainImageUrl');
                  }}
                />
              </ImageUploadButton>
            </ImageUploadArea>
          </FormField>
        </FormRow>

        <Label style={{ marginTop: '16px' }}>Gallery Images ({editState.galleryImages.length}/16)</Label>
        <GalleryGrid>
          {editState.galleryImages.map((img, index) => (
            <GalleryItem key={index}>
              <GalleryImage src={img} alt={`Gallery ${index + 1}`} />
              <GalleryRemoveButton onClick={() => removeGalleryImage(index)}>×</GalleryRemoveButton>
            </GalleryItem>
          ))}
          {editState.galleryImages.length < 16 && (
            <AddGalleryButton>
              +
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleGalleryUpload(file);
                }}
              />
            </AddGalleryButton>
          )}
        </GalleryGrid>
      </EditSection>

      {/* Descriptions */}
      <EditSection>
        <EditSectionTitle>Descriptions</EditSectionTitle>
        <FormRow>
          <FormField $fullWidth>
            <Label>About the {gameType === 'arcadeCabinets' ? 'Game' : 'Work'}</Label>
            <TextArea
              value={editState.aboutDescription}
              onChange={(e) => setEditState(prev => ({ ...prev, aboutDescription: e.target.value }))}
              placeholder="Describe the game or installation..."
            />
          </FormField>
        </FormRow>
        <FormRow>
          <FormField $fullWidth>
            <Label>About the Build</Label>
            <TextArea
              value={editState.buildDescription}
              onChange={(e) => setEditState(prev => ({ ...prev, buildDescription: e.target.value }))}
              placeholder="Describe the physical fabrication and build process..."
            />
          </FormField>
        </FormRow>
        <FormRow>
          <FormField $fullWidth>
            <Label>Current Status</Label>
            <TextArea
              value={editState.currentStatus}
              onChange={(e) => setEditState(prev => ({ ...prev, currentStatus: e.target.value }))}
              placeholder="Where is this currently located? What's its status?"
            />
          </FormField>
        </FormRow>
      </EditSection>

      {/* Links */}
      <EditSection>
        <EditSectionTitle>Links</EditSectionTitle>
        {editState.links.map((link, index) => (
          <LinkRow key={index}>
            <LinkSelect
              value={link.icon || 'link'}
              onChange={(e) => updateLink(index, 'icon', e.target.value)}
            >
              <option value="link">Link</option>
              <option value="download">Download</option>
              <option value="steam">Steam</option>
              <option value="itch">itch.io</option>
            </LinkSelect>
            <LinkInput
              value={link.label}
              onChange={(e) => updateLink(index, 'label', e.target.value)}
              placeholder="Link label"
            />
            <LinkInput
              value={link.url}
              onChange={(e) => updateLink(index, 'url', e.target.value)}
              placeholder="https://..."
            />
            <RemoveLinkButton onClick={() => removeLink(index)}>Remove</RemoveLinkButton>
          </LinkRow>
        ))}
        <AddLinkButton type="button" onClick={addLink}>+ Add Link</AddLinkButton>
      </EditSection>

      <FormButtons>
        <CancelButton type="button" onClick={cancelEdit}>
          Cancel
        </CancelButton>
        <SubmitButton
          type="button"
          onClick={handleSave}
          disabled={submitting || !editName.trim()}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </SubmitButton>
      </FormButtons>
    </EditForm>
  );

  return (
    <PageWrapper>
      {uploading && <UploadingOverlay>Uploading image...</UploadingOverlay>}

      <Header>
        <Title>Manage Games</Title>
        <BackLink onClick={() => navigate(-1)}>Back</BackLink>
      </Header>

      {contentLoading ? (
        <LoadingState>Loading games...</LoadingState>
      ) : (
        <>
          <Section>
            <SectionHeader>
              <SectionTitle>Arcade Cabinets</SectionTitle>
              <AddButton onClick={() => setShowArcadeForm(true)}>+ Add Arcade Game</AddButton>
            </SectionHeader>

            {showArcadeForm && (
              <AddForm onSubmit={handleAddArcade}>
                <FormTitle>Add New Arcade Cabinet</FormTitle>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <FormRow>
                  <FormField>
                    <Label>Game Name</Label>
                    <Input
                      type="text"
                      value={arcadeName}
                      onChange={(e) => setArcadeName(e.target.value)}
                      placeholder="Enter game name"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Year</Label>
                    <Input
                      type="number"
                      value={arcadeYear}
                      onChange={(e) => setArcadeYear(e.target.value)}
                      min="1970"
                      max="2099"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Publicly Available</Label>
                    <Select
                      value={arcadeAvailable}
                      onChange={(e) => setArcadeAvailable(e.target.value)}
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </Select>
                  </FormField>
                </FormRow>
                <FormButtons>
                  <CancelButton type="button" onClick={() => setShowArcadeForm(false)}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit" disabled={submitting || !arcadeName.trim()}>
                    {submitting ? 'Adding...' : 'Add Game'}
                  </SubmitButton>
                </FormButtons>
              </AddForm>
            )}

            <GameList>
              {arcadeGamesArray.length === 0 ? (
                <EmptyState>No arcade cabinets yet. Add one above!</EmptyState>
              ) : (
                arcadeGamesArray.map((game) => (
                  editingKey === game.key && editingType === 'arcadeCabinets' ? (
                    <div key={game.key}>
                      {renderEditForm('arcadeCabinets')}
                    </div>
                  ) : (
                    <GameItem key={game.key} $inactive={game.active === false}>
                      <GameInfo>
                        <GameImage src={game.imageUrl} alt={game.name} />
                        <GameDetails>
                          <GameName>{game.name}</GameName>
                          <GameMeta>
                            Year: {game.year} | Available: {game.available ? 'Yes' : 'No'} | {game.active === false ? 'Inactive' : 'Active'}
                          </GameMeta>
                        </GameDetails>
                      </GameInfo>
                      <ButtonGroup>
                        <ViewLink to={`/games/${game.key}`}>View</ViewLink>
                        <EditButton onClick={() => startEdit('arcadeCabinets', game)}>
                          Edit
                        </EditButton>
                        <StatusButton
                          $isActive={game.active !== false}
                          onClick={() => handleToggleActive('arcadeCabinets', game.key)}
                          disabled={toggling === game.key}
                        >
                          {toggling === game.key ? 'Updating...' : (game.active === false ? 'Mark Active' : 'Mark Inactive')}
                        </StatusButton>
                      </ButtonGroup>
                    </GameItem>
                  )
                ))
              )}
            </GameList>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Installation Games</SectionTitle>
              <AddButton onClick={() => setShowInstallationForm(true)}>+ Add Installation</AddButton>
            </SectionHeader>

            {showInstallationForm && (
              <AddForm onSubmit={handleAddInstallation}>
                <FormTitle>Add New Installation Game</FormTitle>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <FormRow>
                  <FormField>
                    <Label>Game Name</Label>
                    <Input
                      type="text"
                      value={installationName}
                      onChange={(e) => setInstallationName(e.target.value)}
                      placeholder="Enter game name"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Year</Label>
                    <Input
                      type="number"
                      value={installationYear}
                      onChange={(e) => setInstallationYear(e.target.value)}
                      min="1970"
                      max="2099"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Publicly Available</Label>
                    <Select
                      value={installationAvailable}
                      onChange={(e) => setInstallationAvailable(e.target.value)}
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </Select>
                  </FormField>
                </FormRow>
                <FormButtons>
                  <CancelButton type="button" onClick={() => setShowInstallationForm(false)}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit" disabled={submitting || !installationName.trim()}>
                    {submitting ? 'Adding...' : 'Add Game'}
                  </SubmitButton>
                </FormButtons>
              </AddForm>
            )}

            <GameList>
              {installationGamesArray.length === 0 ? (
                <EmptyState>No installation games yet. Add one above!</EmptyState>
              ) : (
                installationGamesArray.map((game) => (
                  editingKey === game.key && editingType === 'installationGames' ? (
                    <div key={game.key}>
                      {renderEditForm('installationGames')}
                    </div>
                  ) : (
                    <GameItem key={game.key} $inactive={game.active === false}>
                      <GameInfo>
                        <GameImage src={game.imageUrl} alt={game.name} />
                        <GameDetails>
                          <GameName>{game.name}</GameName>
                          <GameMeta>
                            Year: {game.year} | Available: {game.available ? 'Yes' : 'No'} | {game.active === false ? 'Inactive' : 'Active'}
                          </GameMeta>
                        </GameDetails>
                      </GameInfo>
                      <ButtonGroup>
                        <ViewLink to={`/installations/${game.key}`}>View</ViewLink>
                        <EditButton onClick={() => startEdit('installationGames', game)}>
                          Edit
                        </EditButton>
                        <StatusButton
                          $isActive={game.active !== false}
                          onClick={() => handleToggleActive('installationGames', game.key)}
                          disabled={toggling === game.key}
                        >
                          {toggling === game.key ? 'Updating...' : (game.active === false ? 'Mark Active' : 'Mark Inactive')}
                        </StatusButton>
                      </ButtonGroup>
                    </GameItem>
                  )
                ))
              )}
            </GameList>
          </Section>
        </>
      )}
    </PageWrapper>
  );
}
