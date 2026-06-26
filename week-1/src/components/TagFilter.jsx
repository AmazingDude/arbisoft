import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Renders the list of available tags as toggle buttons. Selection state is
 * lifted to the parent (Dashboard) and passed back in, keeping this stateless.
 *
 * @param {{
 *   tags: string[],
 *   selectedTags: string[],
 *   onToggle: (tag: string) => void,
 *   onClear: () => void,
 * }} props
 */
export default function TagFilter({ tags, selectedTags, onToggle, onClear }) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        Tags
      </span>
      {tags.map((tag) => {
        const active = selectedTags.includes(tag);
        return (
          <Button
            key={tag}
            type="button"
            variant={active ? "default" : "secondary"}
            size="sm"
            aria-pressed={active}
            onClick={() => onToggle(tag)}
            className={cn(
              "h-7 rounded-full px-3",
              active && "bg-terracotta text-white hover:bg-terracotta/90"
            )}
          >
            #{tag}
          </Button>
        );
      })}
      {selectedTags.length > 0 && (
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      )}
    </div>
  );
}
