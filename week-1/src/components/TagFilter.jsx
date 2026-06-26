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
    <div>
      <span>Filter by tag: </span>
      {tags.map((tag) => {
        const active = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(tag)}
          >
            {active ? "✓ " : ""}#{tag}
          </button>
        );
      })}
      {selectedTags.length > 0 && (
        <button type="button" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
}
