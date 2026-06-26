import { useCallback, useMemo, useState } from "react";
import { usePrompts } from "../hooks/usePrompts.js";
import SearchBar from "../components/SearchBar.jsx";
import TagFilter from "../components/TagFilter.jsx";
import PromptList from "../components/PromptList.jsx";

/**
 * "/" — list view with search + tag filter.
 */
export default function DashboardPage() {
  const { prompts, isLoading, error, removePrompt } = usePrompts();
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const allTags = useMemo(() => {
    const set = new Set();
    prompts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [prompts]);

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

  if (isLoading) {
    return (
      <p className="text-sm text-text-secondary">Loading prompts…</p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Failed to load prompts: {error}
      </p>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            Prompt Dashboard
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {visiblePrompts.length} of {prompts.length} prompts
          </p>
        </div>
        <SearchBar value={query} onChange={setQuery} className="sm:ml-auto" />
      </div>

      <TagFilter
        tags={allTags}
        selectedTags={selectedTags}
        onToggle={handleToggleTag}
        onClear={handleClearTags}
      />

      <PromptList prompts={visiblePrompts} onDelete={handleDelete} />
    </section>
  );
}
