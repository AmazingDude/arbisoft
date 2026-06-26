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
    <section>
      <h2>New Prompt</h2>
      <PromptForm onSubmit={handleSubmit} submitLabel="Create prompt" />
    </section>
  );
}
