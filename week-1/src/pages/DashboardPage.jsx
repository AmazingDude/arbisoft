import { useCallback, useMemo, useState } from "react";
import { usePrompts } from "../hooks/usePrompts.js";
import SearchBar from "../components/SearchBar.jsx";
import TagFilter from "../components/TagFilter.jsx";
import PromptList from "../components/PromptList.jsx";

/**
 * "/" — list view with search + tag filter.
 *
 * Search/tag UI state is local to this page. The expensive part (deriving the
 * filtered list) is wrapped in useMemo so it only recomputes when prompts,
 * the query, or the selected tags actually change — not on every render.
 */
export default function DashboardPage() {
  const { prompts, isLoading, error, removePrompt } = usePrompts();
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // All unique tags across prompts, for the TagFilter.
  const allTags = useMemo(() => {
    const set = new Set();
    prompts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [prompts]);

  // Derived, filtered list — memoized so typing/filtering stays cheap.
  const visiblePrompts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) => {
      const matchesQuery =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.notes.toLowerCase().includes(q);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => p.tags.includes(tag));

      return matchesQuery && matchesTags;
    });
  }, [prompts, query, selectedTags]);

  // Stable handlers passed down to memoized children.
  const handleToggleTag = useCallback((tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleClearTags = useCallback(() => setSelectedTags([]), []);

  const handleDelete = useCallback(
    (id) => {
      removePrompt(id);
    },
    [removePrompt]
  );

  if (isLoading) return <p>Loading prompts…</p>;
  if (error) return <p role="alert">Failed to load prompts: {error}</p>;

  return (
    <section>
      <h2>Prompt Dashboard</h2>

      <SearchBar value={query} onChange={setQuery} />
      <TagFilter
        tags={allTags}
        selectedTags={selectedTags}
        onToggle={handleToggleTag}
        onClear={handleClearTags}
      />

      <p>
        {visiblePrompts.length} of {prompts.length} prompts
      </p>

      <PromptList prompts={visiblePrompts} onDelete={handleDelete} />
    </section>
  );
}
