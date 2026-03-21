const seedProjects = [
  {
    id: 'proj-1',
    name: '93 Canal Street',
    anchor: { start: '2026-06-07', end: '2026-06-09' },
    durations: {
      briefing: 7,
      rnd: 14,
      production: 30,
      prep: 7,
      buffer_pre: 2,
      loadin: 5,
      loadout: 3,
      buffer_post: 2,
      documentation: 7
    },
    milestones: [
      { label: 'Contract', date: '2026-05-01' }
    ]
  },
  {
    id: 'proj-2',
    name: 'Meow Wolf',
    anchor: { start: '2026-10-10', end: '2026-10-14' },
    durations: {
      briefing: 10,
      rnd: 21,
      production: 45,
      prep: 10,
      buffer_pre: 3,
      loadin: 7,
      loadout: 4,
      buffer_post: 3,
      documentation: 10
    },
    milestones: [
      { label: 'Deposit Due', date: '2026-08-01' },
      { label: 'Final Walkthrough', date: '2026-10-08' }
    ]
  }
];

export default seedProjects;
