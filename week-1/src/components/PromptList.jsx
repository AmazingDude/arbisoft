import PromptCard from "./PromptCard.jsx";

/**
 * Presentational list. It receives an already-filtered array plus the delete
 * handler and just maps over it — no data fetching or filtering logic here.
 *
 * @param {{ prompts: import("../types.js").Prompt[], onDelete: (id: string) => void }} props
 */
export default function PromptList({ prompts, onDelete }) {
  if (prompts.length === 0) {
    return <p>No prompts match your filters.</p>;
  }

  return (
    <div>
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} onDelete={onDelete} />
      ))}
    </div>
  );
}
