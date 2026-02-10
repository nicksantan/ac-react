import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ref, onValue, set, get, push } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { ContentData, GamesData, ChangeLogEntry } from '../types/content';

// Deep merge utility - merges source into target, preserving nested defaults
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge<T>(target: T, source: any): T {
  if (!source || typeof source !== 'object') {
    return target;
  }

  const result = { ...target } as Record<string, unknown>;

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = (target as Record<string, unknown>)[key];

    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      // Recursively merge nested objects
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      // Use source value for primitives and arrays
      result[key] = sourceValue;
    }
  }

  return result as T;
}

// Default content that matches the current hardcoded values
const defaultContent: ContentData = {
  home: {
    missionHeading: 'Arcade Commons is a collective of artists, developers, designers, and fabricators that make independent arcade cabinets and other physical game installations',
    missionDescription: 'Our mission is to help creators with the resources they need to create installation art and arcade games. We educate, counsel, and support creators on how to fabricate arcade cabinets and develop fun, accessible games for everyone. Learn how you can play games we\'ve helped make or get involved!',
    logoUrl: '/assets/resized-logo-and-text.png'
  },
  games: {
    pageHeading: 'GAMES / PROJECTS',
    pageIntro: 'Here is a selection of arcade games and other projects we\'ve helped creators realize over the years. Click View Publicly Available to see games you can go check out right now!',
    sectionHeaders: {
      arcadeCabinets: 'Arcade Cabinets',
      installationGames: 'Installation Games / Alt Control Games'
    }
  },
  banner: {
    images: [
      { id: '1', url: '/assets/img1.jpeg', alt: 'Slide 1' },
      { id: '2', url: '/assets/img2.jpeg', alt: 'Slide 2' },
      { id: '3', url: '/assets/img3.jpeg', alt: 'Slide 3' },
      { id: '4', url: '/assets/img4.jpeg', alt: 'Slide 4' },
      { id: '5', url: '/assets/img5.jpeg', alt: 'Slide 5' }
    ]
  },
  navbar: {
    links: [
      { id: 'about', label: 'About', href: '/About' },
      { id: 'involved', label: 'Get Involved', href: '/Involved' },
      { id: 'games', label: 'Games', href: '/Games' },
      { id: 'history', label: 'History', href: '/History' }
    ]
  },
  about: {
    intro: 'Arcade Commons is a non-profit (501c3) collective of artists, designers, fabricators, and other creators that make indie arcade cabinets and other physical game installations based out of Brooklyn, NY.',
    history: 'Formerly known as Death by Audio Arcade, we have been making hardware and building experiences since 2013. Some highlights from our past include:',
    highlights: [
      'Launching the MAGFest Indie Arcade in 2013 with Crystal Brawl',
      'Partnering with Low Level Festival in 2014 and 2016',
      'Showcasing at the Smithsonian American Art Museum Arcade in 2017 and 2019',
      'Creating pop-up arcades in a different venue for each month of 2018',
      'Helping open Wonderville Arcade in 2019 and collaborating on the arcade gallery space'
    ],
    closing: "Thanks to the efforts of our larger community, Arcade Commons has been able to fund a studio space in Brooklyn that's allowed us to better connect with and empower creators in the larger New York indie game scene."
  },
  getInvolved: {
    intro: 'Want to help support indie arcade creators? Want help with our own indie arcade game project? There are many ways to get involved with Arcade Commons, from volunteering to help build works, donating to our organization, or joining our discord to engage with other developers, fabricators, designers and players!',
    introImageUrl: '/assets/SampleCabImg.jpeg',
    introImageUrl2: '/assets/SampleCabImg.jpeg',
    howToHelp: 'Whether you\'re a developer, artist, fabricator, or just someone who loves arcade games, we\'d love to have you be part of our community.',
    closing: 'Reach out to us to learn more about how you can contribute to the growing, inclusive indie arcade scene. Feel free to email us, check out our [Instagram](https://instagram.com/arcadecommons), or join our public [Discord server](https://discord.gg/arcadecommons)!',
    contactEmail: {
      text: 'contact@arcadecommons.org',
      href: 'mailto:contact@arcadecommons.org'
    },
    donateLinks: {
      membership: {
        text: 'Become a member on Withfriends',
        href: 'https://withfriends.co/arcade_commons/join'
      },
      oneTime: {
        text: 'Make a one-time donation with Withfriends',
        href: 'https://withfriends.co/arcade_commons/donate'
      }
    },
    discordLink: {
      text: 'Join our discord server!',
      href: 'https://discord.gg/arcadecommons'
    }
  }
};

const defaultGames: GamesData = {
  arcadeCabinets: {
    'game_1': { id: 1, name: 'HOVERBURGER', year: 2023, available: false, active: true, imageUrl: '/assets/SampleCabImg.jpeg' },
    'game_2': { id: 2, name: 'DYEBREAKER', year: 2024, available: false, active: true, imageUrl: '/assets/SampleCabImg.jpeg' },
    'game_3': { id: 3, name: 'PARTICLE MACE', year: 2014, available: false, active: true, imageUrl: '/assets/SampleCabImg.jpeg' },
    'game_4': { id: 4, name: 'NOTHING GOOD CAN COME OF THIS', year: 2015, available: false, active: true, imageUrl: '/assets/SampleCabImg.jpeg' },
  },
  installationGames: {
    'install_1': { id: 1, name: 'Salmon Roll', year: 2020, available: false, active: true, imageUrl: '/assets/SampleCabImg.jpeg' },
    'install_2': { id: 2, name: 'Circumnavigators', year: 2019, available: false, active: true, imageUrl: '/assets/SampleCabImg.jpeg' },
    'install_3': { id: 3, name: 'Drink Rink', year: 2021, available: false, active: true, imageUrl: '/assets/SampleCabImg.jpeg' },
  }
};

interface ContentContextType {
  content: ContentData;
  games: GamesData;
  loading: boolean;
  error: Error | null;
  updateContent: (path: string, value: unknown) => Promise<void>;
  updateGame: (gameKey: string, updates: Partial<GamesData['arcadeCabinets'][string]>) => Promise<void>;
  revertChange: (logEntry: ChangeLogEntry) => Promise<void>;
  addGame: (type: 'arcadeCabinets' | 'installationGames', game: Omit<GamesData['arcadeCabinets'][string], 'id'> | Omit<GamesData['installationGames'][string], 'id'>) => Promise<string>;
  deleteGame: (type: 'arcadeCabinets' | 'installationGames', gameKey: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentData>(defaultContent);
  const [games, setGames] = useState<GamesData>(defaultGames);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Listen for content changes
    const contentRef = ref(database, 'content');
    const contentUnsubscribe = onValue(
      contentRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setContent(deepMerge(defaultContent, data));
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error loading content:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Listen for games changes
    const gamesRef = ref(database, 'games');
    const gamesUnsubscribe = onValue(
      gamesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setGames(deepMerge(defaultGames, data));
        }
      },
      (err) => {
        console.error('Error loading games:', err);
      }
    );

    return () => {
      contentUnsubscribe();
      gamesUnsubscribe();
    };
  }, []);

  const updateContent = async (path: string, value: unknown) => {
    const userEmail = auth.currentUser?.email || 'unknown';

    // Get the current value before updating
    const contentRef = ref(database, path);
    const snapshot = await get(contentRef);
    const previousValue = snapshot.val();

    // Update the content
    await set(contentRef, value);

    // Log the change
    const logEntry: Omit<ChangeLogEntry, 'id'> = {
      timestamp: Date.now(),
      userEmail,
      contentPath: path,
      previousValue,
      newValue: value,
      reverted: false
    };

    const changeLogRef = ref(database, 'changeLog');
    await push(changeLogRef, logEntry);
  };

  const updateGame = async (
    gameKey: string,
    updates: Partial<GamesData['arcadeCabinets'][string]>
  ) => {
    const currentGame = games.arcadeCabinets[gameKey];
    if (currentGame) {
      const gameRef = ref(database, `games/arcadeCabinets/${gameKey}`);
      await set(gameRef, { ...currentGame, ...updates });
    }
  };

  const revertChange = async (logEntry: ChangeLogEntry) => {
    const userEmail = auth.currentUser?.email || 'unknown';

    // Restore the previous value
    const contentRef = ref(database, logEntry.contentPath);
    await set(contentRef, logEntry.previousValue);

    // Mark the original log entry as reverted
    const originalLogRef = ref(database, `changeLog/${logEntry.id}/reverted`);
    await set(originalLogRef, true);

    // Log the revert action
    const revertLogEntry: Omit<ChangeLogEntry, 'id'> = {
      timestamp: Date.now(),
      userEmail,
      contentPath: logEntry.contentPath,
      previousValue: logEntry.newValue,
      newValue: logEntry.previousValue,
      reverted: false
    };

    const changeLogRef = ref(database, 'changeLog');
    await push(changeLogRef, revertLogEntry);
  };

  const addGame = async (
    type: 'arcadeCabinets' | 'installationGames',
    game: Omit<GamesData['arcadeCabinets'][string], 'id'> | Omit<GamesData['installationGames'][string], 'id'>
  ): Promise<string> => {
    const userEmail = auth.currentUser?.email || 'unknown';

    // Generate a new unique key
    const gamesListRef = ref(database, `games/${type}`);
    const newGameRef = push(gamesListRef);
    const newKey = newGameRef.key!;

    // Find the next available ID
    const currentGames = type === 'arcadeCabinets' ? games.arcadeCabinets : games.installationGames;
    const maxId = Object.values(currentGames).reduce((max, g) => Math.max(max, g.id), 0);
    const newId = maxId + 1;

    const newGame = { ...game, id: newId };

    // Save the new game
    await set(newGameRef, newGame);

    // Log the change
    const logEntry: Omit<ChangeLogEntry, 'id'> = {
      timestamp: Date.now(),
      userEmail,
      contentPath: `games/${type}/${newKey}`,
      previousValue: null,
      newValue: newGame,
      reverted: false
    };

    const changeLogRef = ref(database, 'changeLog');
    await push(changeLogRef, logEntry);

    return newKey;
  };

  const deleteGame = async (
    type: 'arcadeCabinets' | 'installationGames',
    gameKey: string
  ): Promise<void> => {
    const userEmail = auth.currentUser?.email || 'unknown';

    // Get current value before deleting
    const gameRef = ref(database, `games/${type}/${gameKey}`);
    const snapshot = await get(gameRef);
    const previousValue = snapshot.val();

    if (!previousValue) return;

    // Delete the game
    await set(gameRef, null);

    // Log the change
    const logEntry: Omit<ChangeLogEntry, 'id'> = {
      timestamp: Date.now(),
      userEmail,
      contentPath: `games/${type}/${gameKey}`,
      previousValue,
      newValue: null,
      reverted: false
    };

    const changeLogRef = ref(database, 'changeLog');
    await push(changeLogRef, logEntry);
  };

  return (
    <ContentContext.Provider
      value={{ content, games, loading, error, updateContent, updateGame, revertChange, addGame, deleteGame }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

export { ContentContext };
