import { Link, useParams, useNavigate } from "react-router-dom";
import { usePrompts } from "../hooks/usePrompts.js";

/**
 * "/prompts/:id" — detail view for a single prompt.
 *
 * Reads from the already-loaded Context list rather than re-fetching, since the
 * dashboard fetch populates global state. (A direct-load fetch-by-id could be
 * added in Week 2 alongside the real API.)
 */
export default function PromptDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { prompts, isLoading, removePrompt } = usePrompts();

  if (isLoading) return <p>Loading…</p>;

  const prompt = prompts.find((p) => p.id === id);

  if (!prompt) {
    return (
      <section>
        <p>Prompt not found.</p>
        <Link to="/">Back to dashboard</Link>
      </section>
    );
  }

  const handleDelete = async () => {
    await removePrompt(prompt.id);
    navigate("/");
  };

  return (
    <section>
      <Link to="/">← Back</Link>
      <h2>{prompt.title}</h2>

      <p>
        <strong>Tool:</strong> {prompt.tool}
        {prompt.model ? ` (${prompt.model})` : ""}
      </p>
      <p>
        <strong>Rating:</strong> {prompt.rating}/5
      </p>
      <p>
        <strong>Created:</strong>{" "}
        {new Date(prompt.createdAt).toLocaleString()}
      </p>

      {prompt.tags.length > 0 && (
        <p>
          <strong>Tags:</strong> {prompt.tags.map((t) => `#${t}`).join(" ")}
        </p>
      )}

      <h3>Prompt</h3>
      <pre>{prompt.content}</pre>

      {prompt.notes && (
        <>
          <h3>Notes</h3>
          <p>{prompt.notes}</p>
        </>
      )}

      <button type="button" onClick={handleDelete}>
        Delete prompt
      </button>
    </section>
  );
}
