export const PHASE_TYPES = [
  'briefing', 'rnd', 'production', 'prep',
  'buffer_pre', 'loadin', 'event', 'loadout',
  'buffer_post', 'documentation'
];

export const PHASE_LABELS = {
  briefing: 'BRIEF',
  rnd: 'R&D',
  production: 'BUILD',
  prep: 'PREP',
  buffer_pre: '',
  loadin: 'LOAD-IN',
  event: 'EVENT',
  loadout: 'LOAD-OUT',
  buffer_post: '',
  documentation: 'DOC'
};

export const PHASE_FULL_NAMES = {
  briefing: 'Briefing',
  rnd: 'R&D / Planning',
  production: 'Production / Build',
  prep: 'Prep / QA',
  buffer_pre: 'Buffer (pre)',
  loadin: 'Load-in',
  event: 'Event / Delivery',
  loadout: 'Load-out',
  buffer_post: 'Buffer (post)',
  documentation: 'Documentation'
};

export const PHASE_TO_DURATION = {
  briefing: 'briefing',
  rnd: 'rnd',
  production: 'production',
  prep: 'prep',
  buffer_pre: 'buffer_pre',
  loadin: 'loadin',
  loadout: 'loadout',
  buffer_post: 'buffer_post',
  documentation: 'documentation'
};

export const DEFAULT_DURATIONS = {
  briefing: 7,
  rnd: 14,
  production: 30,
  prep: 7,
  buffer_pre: 2,
  loadin: 5,
  loadout: 3,
  buffer_post: 2,
  documentation: 7
};

export const LEGEND_ITEMS = [
  { key: 'briefing', label: 'Brief', bg: '#C8C8C6', opacity: 0.7 },
  { key: 'rnd', label: 'R&D', bg: '#0AAF96', opacity: 0.85 },
  { key: 'production', label: 'Build', bg: '#ADD56D', opacity: 0.9 },
  { key: 'prep', label: 'Prep', bg: '#FDCB7E', opacity: 0.85 },
  { key: 'buffer', label: 'Buffer', bg: '#EAEAE8', border: '1px dashed #D0CEC9' },
  { key: 'loadin', label: 'Load-in', bg: '#0AAF96', opacity: 0.9 },
  { key: 'event', label: 'Event', bg: '#F05B2F' },
  { key: 'loadout', label: 'Load-out', bg: '#0AAF96', opacity: 0.7 },
  { key: 'documentation', label: 'Doc', bg: '#C8C8C6', opacity: 0.6 },
];

// Phase duration form fields config
export const PHASE_FORM_FIELDS = [
  { key: 'briefing', label: 'Briefing', bg: '#B8B8B8', opacity: 0.45 },
  { key: 'rnd', label: 'R&D / Planning', bg: '#0AAF96', opacity: 0.75 },
  { key: 'production', label: 'Production', bg: '#ADD56D', opacity: 0.85 },
  { key: 'prep', label: 'Prep / QA', bg: '#FDCB7E', opacity: 0.75 },
  { key: 'buffer_pre', label: 'Buffer (pre)', bg: '#EAEAE8', border: '1px solid #E0DEDA' },
  { key: 'loadin', label: 'Load-in', bg: '#0AAF96', opacity: 0.85 },
  { key: 'loadout', label: 'Load-out', bg: '#0AAF96', opacity: 0.6 },
  { key: 'buffer_post', label: 'Buffer (post)', bg: '#EAEAE8', border: '1px solid #E0DEDA' },
  { key: 'documentation', label: 'Documentation', bg: '#B8B8B8', opacity: 0.4 },
];
