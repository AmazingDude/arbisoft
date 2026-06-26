import PromptCard from "./PromptCard.jsx";

/**
 * Presentational list. It receives an already-filtered array plus the delete
 * handler and just maps over it — no data fetching or filtering logic here.
 *
 * @param {{ prompts: import("../types.js").Prompt[], onDelete: (id: string) => void }} props
 */
export default function PromptList({ prompts, onDelete }) {
  if (prompts.length === 0) {
    return (
      <p className="rounded-md border border-border bg-surface px-4 py-8 text-center text-sm text-text-secondary">
        No prompts match your filters.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} onDelete={onDelete} />
      ))}
    </div>
  );
}
