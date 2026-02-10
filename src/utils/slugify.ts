/**
 * Converts a string to a URL-friendly slug
 * e.g., "NOTHING GOOD CAN COME OF THIS" -> "nothing-good-can-come-of-this"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

/**
 * Finds a game by matching its slugified name against a slug
 */
export function findGameBySlug<T extends { name: string }>(
  games: Record<string, T>,
  slug: string
): { key: string; game: T } | null {
  for (const [key, game] of Object.entries(games)) {
    if (slugify(game.name) === slug) {
      return { key, game };
    }
  }
  return null;
}
