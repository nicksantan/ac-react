const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

export function formatDateShort(date) {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function formatDateMonth(date) {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function dateToX(date, rangeStart, pxPerDay) {
  return daysBetween(rangeStart, date) * pxPerDay;
}
