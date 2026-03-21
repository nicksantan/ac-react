import { computePhases } from './phaseComputer';
import { formatDateShort } from './dateUtils';
import { PHASE_FULL_NAMES } from '../config/phases';

// Detects within-project phase overlaps only (not cross-project)
export function detectConflicts(projects) {
  const conflicts = [];
  projects.forEach(p => {
    const phases = computePhases(p);
    for (let i = 0; i < phases.length; i++) {
      for (let j = i + 1; j < phases.length; j++) {
        const a = phases[i];
        const b = phases[j];
        if (a.start <= b.end && b.start <= a.end) {
          conflicts.push({
            project: p.name,
            phaseA: a.type,
            phaseB: b.type,
            overlapStart: new Date(Math.max(a.start, b.start)),
            overlapEnd: new Date(Math.min(a.end, b.end))
          });
        }
      }
    }
  });
  return conflicts;
}

export function formatConflict(conflict) {
  return `${PHASE_FULL_NAMES[conflict.phaseA]} overlaps ${PHASE_FULL_NAMES[conflict.phaseB]} in "${conflict.project}" (${formatDateShort(conflict.overlapStart)} — ${formatDateShort(conflict.overlapEnd)})`;
}
