/**
 * Compact relative timestamps for list rows.
 * Examples: "just now", "2h ago", "3d ago", "Jul 3"
 *
 * @param {string | Date} value
 * @param {Date} [now]
 * @returns {string}
 */
export function formatRelativeTime(value, now = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return formatShortDate(date, now);

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return formatShortDate(date, now);
}

/**
 * Full calendar date for detail views, e.g. "July 3, 2026".
 *
 * @param {string | Date} value
 * @returns {string}
 */
export function formatFullDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(date, now) {
  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}
