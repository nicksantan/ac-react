export interface HomeContent {
  missionHeading: string;
  missionDescription: string;
  logoUrl: string;
}

export interface GamesPageContent {
  pageHeading: string;
  pageIntro: string;
  sectionHeaders: {
    arcadeCabinets: string;
    installationGames: string;
  };
}

export interface BannerImage {
  id: string;
  url: string;
  alt: string;
}

export interface BannerContent {
  images: BannerImage[];
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface NavbarContent {
  links: NavLink[];
}

export interface AboutContent {
  intro: string;
  history: string;
  highlights: string[];
  closing: string;
}

export interface ContentLink {
  text: string;
  href: string;
}

export interface GetInvolvedContent {
  intro: string;
  introImageUrl: string;
  introImageUrl2: string;
  howToHelp: string;
  closing: string;
  contactEmail: ContentLink;
  donateLinks: {
    membership: ContentLink;
    oneTime: ContentLink;
  };
  discordLink: ContentLink;
}

export interface ContentData {
  home: HomeContent;
  games: GamesPageContent;
  banner: BannerContent;
  navbar: NavbarContent;
  about: AboutContent;
  getInvolved: GetInvolvedContent;
}

export interface GameLink {
  label: string;
  url: string;
  icon?: 'link' | 'download' | 'steam' | 'itch';
}

export interface Game {
  id: number;
  name: string;
  year: number;
  available: boolean;
  active: boolean;
  imageUrl: string;
  // Detail page fields
  creators?: string;
  collaborators?: string;
  mainImageUrl?: string;
  galleryImages?: string[];
  aboutDescription?: string;
  buildDescription?: string;
  currentStatus?: string;
  links?: GameLink[];
}

export interface InstallationGame {
  id: number;
  name: string;
  year: number;
  available: boolean;
  active: boolean;
  imageUrl: string;
  // Detail page fields
  creators?: string;
  collaborators?: string;
  mainImageUrl?: string;
  galleryImages?: string[];
  aboutDescription?: string;
  buildDescription?: string;
  currentStatus?: string;
  links?: GameLink[];
}

export interface GamesData {
  arcadeCabinets: Record<string, Game>;
  installationGames: Record<string, InstallationGame>;
}

export interface ChangeLogEntry {
  id: string;
  timestamp: number;
  userEmail: string;
  contentPath: string;
  previousValue: unknown;
  newValue: unknown;
  reverted: boolean;
}
