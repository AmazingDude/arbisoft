import { useNavigate } from "react-router-dom";
import { usePrompts } from "../hooks/usePrompts.js";
import PromptForm from "../components/PromptForm.jsx";

/**
 * "/prompts/new" — create a new prompt, then navigate to its detail page.
 */
export default function NewPromptPage() {
  const { addPrompt } = usePrompts();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    const created = await addPrompt(data);
    navigate(`/prompts/${created.id}`);
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
          New Prompt
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Capture a prompt, tool, and rating for your journal.
        </p>
      </div>
      <PromptForm onSubmit={handleSubmit} submitLabel="Create prompt" />
    </section>
  );
}
