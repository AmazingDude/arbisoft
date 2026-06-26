import { cn } from "@/lib/utils";

/**
 * Amber star rating display. Keeps ★ characters in the DOM for tests/a11y.
 * @param {{ rating: number, className?: string, showEmpty?: boolean }} props
 */
export default function StarRating({ rating, className, showEmpty = true }) {
  const filled = "★".repeat(rating);
  const empty = showEmpty ? "☆".repeat(Math.max(0, 5 - rating)) : "";

  return (
    <span
      className={cn("text-amber tracking-tight", className)}
      aria-label={`${rating} out of 5 stars`}
    >
      {filled}
      {empty}
    </span>
  );
}
