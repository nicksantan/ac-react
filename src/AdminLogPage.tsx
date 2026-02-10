import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase/config';
import { useAuth } from './hooks/useAuth';
import { useContent } from './hooks/useContent';
import { ChangeLogEntry } from './types/content';
import { CONTENT_MAX_WIDTH } from './styles/constants';

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

const LogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LogEntry = styled.div<{ $reverted: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  opacity: ${props => props.$reverted ? 0.5 : 1};
`;

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const LogMeta = styled.div`
  font-size: 27px;
  color: rgba(255, 255, 255, 0.85);
`;

const LogPath = styled.div`
  font-family: monospace;
  font-size: 24px;
  color: #166534;
  margin-top: 9px;
`;

const LogTimestamp = styled.div`
  font-size: 21px;
  color: white;
  margin-top: 6px;
`;

const RevertButton = styled.button<{ $disabled?: boolean }>`
  background: ${props => props.$disabled ? 'rgba(255, 255, 255, 0.1)' : '#dc2626'};
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-size: 24px;

  &:hover {
    background: ${props => props.$disabled ? 'rgba(255, 255, 255, 0.1)' : '#b91c1c'};
  }
`;

const RevertedBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 9px 18px;
  border-radius: 4px;
  font-size: 22px;
`;

const ValueChange = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ValueBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 18px;
  font-size: 24px;
  overflow: hidden;
`;

const ValueLabel = styled.div`
  font-size: 20px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
`;

const ValueContent = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: monospace;
  font-size: 20px;
  max-height: 225px;
  overflow-y: auto;
`;

const DiffAdded = styled.span`
  background-color: rgba(34, 197, 94, 0.3);
  color: #22c55e;
  padding: 1px 2px;
  border-radius: 2px;
`;

const DiffRemoved = styled.span`
  background-color: rgba(220, 38, 38, 0.3);
  color: #fca5a5;
  text-decoration: line-through;
  padding: 1px 2px;
  border-radius: 2px;
`;

const ValueImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  object-fit: contain;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24px;
`;

const AccessDenied = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
`;

function isImageUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const lower = value.toLowerCase();
  return (
    lower.startsWith('http') &&
    (lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') ||
     lower.includes('.gif') || lower.includes('.webp') || lower.includes('firebasestorage'))
  ) || lower.startsWith('/assets/');
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '(empty)';
  }
  if (typeof value === 'string') {
    return value || '(empty string)';
  }
  return JSON.stringify(value, null, 2);
}

// Simple word-level diff algorithm
function computeWordDiff(oldStr: string, newStr: string): { type: 'same' | 'added' | 'removed'; text: string }[] {
  const oldWords = oldStr.split(/(\s+)/);
  const newWords = newStr.split(/(\s+)/);

  // Build a simple LCS-based diff
  const result: { type: 'same' | 'added' | 'removed'; text: string }[] = [];

  let oldIdx = 0;
  let newIdx = 0;

  while (oldIdx < oldWords.length || newIdx < newWords.length) {
    if (oldIdx >= oldWords.length) {
      // Rest is added
      result.push({ type: 'added', text: newWords[newIdx] });
      newIdx++;
    } else if (newIdx >= newWords.length) {
      // Rest is removed
      result.push({ type: 'removed', text: oldWords[oldIdx] });
      oldIdx++;
    } else if (oldWords[oldIdx] === newWords[newIdx]) {
      // Same word
      result.push({ type: 'same', text: oldWords[oldIdx] });
      oldIdx++;
      newIdx++;
    } else {
      // Check if old word appears later in new (it was moved/added before)
      const oldInNew = newWords.indexOf(oldWords[oldIdx], newIdx);
      const newInOld = oldWords.indexOf(newWords[newIdx], oldIdx);

      if (oldInNew === -1 && newInOld === -1) {
        // Both are different - show as removed then added
        result.push({ type: 'removed', text: oldWords[oldIdx] });
        result.push({ type: 'added', text: newWords[newIdx] });
        oldIdx++;
        newIdx++;
      } else if (oldInNew === -1 || (newInOld !== -1 && newInOld < oldInNew)) {
        // Old word doesn't appear in new, or new word appears sooner
        result.push({ type: 'removed', text: oldWords[oldIdx] });
        oldIdx++;
      } else {
        // New word doesn't appear in old
        result.push({ type: 'added', text: newWords[newIdx] });
        newIdx++;
      }
    }
  }

  return result;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }) + ' EST';
}

export default function AdminLogPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { revertChange } = useContent();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ChangeLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [reverting, setReverting] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // If not admin, don't try to load logs
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const logsRef = ref(database, 'changeLog');
    const unsubscribe = onValue(
      logsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const logEntries: ChangeLogEntry[] = Object.entries(data).map(
            ([id, entry]) => ({
              id,
              ...(entry as Omit<ChangeLogEntry, 'id'>)
            })
          );
          // Sort by timestamp descending (newest first)
          logEntries.sort((a, b) => b.timestamp - a.timestamp);
          setLogs(logEntries);
        } else {
          setLogs([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading change log:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin, authLoading]);

  const handleRevert = async (entry: ChangeLogEntry) => {
    if (reverting || entry.reverted) return;

    setReverting(entry.id);
    try {
      await revertChange(entry);
    } catch (error) {
      console.error('Failed to revert:', error);
    } finally {
      setReverting(null);
    }
  };

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

  return (
    <PageWrapper>
      <Header>
        <Title>Admin Change Log</Title>
        <BackLink onClick={() => navigate(-1)}>Back</BackLink>
      </Header>

      {loading ? (
        <LoadingState>Loading change log...</LoadingState>
      ) : logs.length === 0 ? (
        <EmptyState>No changes have been logged yet.</EmptyState>
      ) : (
        <LogList>
          {logs.map((entry) => (
            <LogEntry key={entry.id} $reverted={entry.reverted}>
              <LogHeader>
                <LogMeta>
                  <strong>{entry.userEmail}</strong>
                  <LogPath>{entry.contentPath}</LogPath>
                  <LogTimestamp>{formatDate(entry.timestamp)}</LogTimestamp>
                </LogMeta>
                {entry.reverted ? (
                  <RevertedBadge>Reverted</RevertedBadge>
                ) : (
                  <RevertButton
                    onClick={() => handleRevert(entry)}
                    $disabled={reverting === entry.id}
                  >
                    {reverting === entry.id ? 'Reverting...' : 'Revert'}
                  </RevertButton>
                )}
              </LogHeader>
              <ValueChange>
                <ValueBox>
                  <ValueLabel>Previous Value</ValueLabel>
                  {isImageUrl(entry.previousValue) ? (
                    <ValueImage src={entry.previousValue as string} alt="Previous" />
                  ) : typeof entry.previousValue === 'string' && typeof entry.newValue === 'string' ? (
                    <ValueContent>
                      {computeWordDiff(entry.previousValue || '', entry.newValue || '').map((part, i) =>
                        part.type === 'removed' ? (
                          <DiffRemoved key={i}>{part.text}</DiffRemoved>
                        ) : part.type === 'same' ? (
                          <span key={i}>{part.text}</span>
                        ) : null
                      )}
                    </ValueContent>
                  ) : (
                    <ValueContent>{formatValue(entry.previousValue)}</ValueContent>
                  )}
                </ValueBox>
                <ValueBox>
                  <ValueLabel>New Value</ValueLabel>
                  {isImageUrl(entry.newValue) ? (
                    <ValueImage src={entry.newValue as string} alt="New" />
                  ) : typeof entry.previousValue === 'string' && typeof entry.newValue === 'string' ? (
                    <ValueContent>
                      {computeWordDiff(entry.previousValue || '', entry.newValue || '').map((part, i) =>
                        part.type === 'added' ? (
                          <DiffAdded key={i}>{part.text}</DiffAdded>
                        ) : part.type === 'same' ? (
                          <span key={i}>{part.text}</span>
                        ) : null
                      )}
                    </ValueContent>
                  ) : (
                    <ValueContent>{formatValue(entry.newValue)}</ValueContent>
                  )}
                </ValueBox>
              </ValueChange>
            </LogEntry>
          ))}
        </LogList>
      )}
    </PageWrapper>
  );
}
