import { parseDate, addDays, daysBetween } from './dateUtils';

export function computePhases(project) {
  const anchorStart = parseDate(project.anchor.start);
  const anchorEnd = parseDate(project.anchor.end);
  const eventDays = daysBetween(anchorStart, anchorEnd) + 1;
  const d = project.durations;

  // Expand left from event start
  const loadinEnd = addDays(anchorStart, -1);
  const loadinStart = addDays(loadinEnd, -(d.loadin - 1));

  const bufPreEnd = addDays(loadinStart, -1);
  const bufPreStart = addDays(bufPreEnd, -(d.buffer_pre - 1));

  const prepEnd = addDays(bufPreStart, -1);
  const prepStart = addDays(prepEnd, -(d.prep - 1));

  const prodEnd = addDays(prepStart, -1);
  const prodStart = addDays(prodEnd, -(d.production - 1));

  const rndEnd = addDays(prodStart, -1);
  const rndStart = addDays(rndEnd, -(d.rnd - 1));

  const briefEnd = addDays(rndStart, -1);
  const briefStart = addDays(briefEnd, -(d.briefing - 1));

  // Expand right from event end
  const loadoutStart = addDays(anchorEnd, 1);
  const loadoutEnd = addDays(loadoutStart, d.loadout - 1);

  const bufPostStart = addDays(loadoutEnd, 1);
  const bufPostEnd = addDays(bufPostStart, d.buffer_post - 1);

  const docStart = addDays(bufPostEnd, 1);
  const docEnd = addDays(docStart, d.documentation - 1);

  return [
    { type: 'briefing', start: briefStart, end: briefEnd, days: d.briefing },
    { type: 'rnd', start: rndStart, end: rndEnd, days: d.rnd },
    { type: 'production', start: prodStart, end: prodEnd, days: d.production },
    { type: 'prep', start: prepStart, end: prepEnd, days: d.prep },
    { type: 'buffer_pre', start: bufPreStart, end: bufPreEnd, days: d.buffer_pre },
    { type: 'loadin', start: loadinStart, end: loadinEnd, days: d.loadin },
    { type: 'event', start: anchorStart, end: anchorEnd, days: eventDays },
    { type: 'loadout', start: loadoutStart, end: loadoutEnd, days: d.loadout },
    { type: 'buffer_post', start: bufPostStart, end: bufPostEnd, days: d.buffer_post },
    { type: 'documentation', start: docStart, end: docEnd, days: d.documentation },
  ];
}

export function getTimelineRange(projects) {
  let earliest = new Date('2099-01-01');
  let latest = new Date('2000-01-01');

  projects.forEach(p => {
    const phases = computePhases(p);
    phases.forEach(ph => {
      if (ph.start < earliest) earliest = new Date(ph.start);
      if (ph.end > latest) latest = new Date(ph.end);
    });
  });

  earliest = addDays(earliest, -30);
  latest = addDays(latest, 30);
  earliest.setDate(1);

  return { start: earliest, end: latest };
}
