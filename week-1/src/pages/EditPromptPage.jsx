import { Link, useNavigate, useParams } from "react-router-dom";
import { usePrompts } from "../hooks/usePrompts.js";
import PromptForm from "../components/PromptForm.jsx";
import { buttonVariants } from "@/components/ui/button-variants";

/**
 * "/prompts/:id/edit" — edit an existing prompt via PATCH, then return to detail.
 */
export default function EditPromptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { prompts, isLoading, error, updatePrompt } = usePrompts();

  if (isLoading) {
    return <p className="text-sm text-text-secondary">Loading…</p>;
  }

  if (error) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Failed to load prompts: {error}
      </p>
    );
  }

  const prompt = prompts.find((p) => p.id === id);

  if (!prompt) {
    return (
      <section className="mx-auto max-w-2xl space-y-4 text-center">
        <p className="text-text-secondary">Prompt not found.</p>
        <Link to="/" className={buttonVariants({ variant: "secondary" })}>
          Back to dashboard
        </Link>
      </section>
    );
  }

  const handleSubmit = async (data) => {
    try {
      await updatePrompt(prompt.id, data);
      navigate(`/prompts/${prompt.id}`);
    } catch (err) {
      window.alert(err.message || "Could not save changes");
    }
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
          Edit Prompt
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Update this prompt and save your changes.
        </p>
      </div>
      <PromptForm
        key={prompt.id}
        initialData={prompt}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
    </section>
  );
}
