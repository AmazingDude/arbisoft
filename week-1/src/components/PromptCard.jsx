import { memo } from "react";
import { Link } from "react-router-dom";

/**
 * Single prompt summary in the list.
 *
 * Wrapped in React.memo so it only re-renders when its own props change.
 * That pairs with the useCallback'd onDelete handler from the parent: a stable
 * function identity lets memo actually skip re-renders when the list re-renders
 * for unrelated reasons (e.g. typing in the search box).
 *
 * @param {{ prompt: import("../types.js").Prompt, onDelete: (id: string) => void }} props
 */
function PromptCard({ prompt, onDelete }) {
  return (
    <article>
      <h3>
        <Link to={`/prompts/${prompt.id}`}>{prompt.title}</Link>
      </h3>
      <p>
        <span>{prompt.tool}</span>
        {prompt.model ? <span> · {prompt.model}</span> : null}
        <span> · {"★".repeat(prompt.rating)}</span>
      </p>
      {prompt.tags.length > 0 && (
        <ul>
          {prompt.tags.map((tag) => (
            <li key={tag}>#{tag}</li>
          ))}
        </ul>
      )}
      <button type="button" onClick={() => onDelete(prompt.id)}>
        Delete
      </button>
    </article>
  );
}

export default memo(PromptCard);
