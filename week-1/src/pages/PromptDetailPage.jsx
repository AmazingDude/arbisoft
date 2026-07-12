import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { usePrompts } from "../hooks/usePrompts.js";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import PromptCodeBlock from "@/components/PromptCodeBlock.jsx";
import StarRating from "@/components/StarRating.jsx";
import ToolDot from "@/components/ToolDot.jsx";
import { formatFullDate } from "@/lib/formatDate.js";

/**
 * "/prompts/:id" — Notion-style reading view for a single prompt.
 */
export default function PromptDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { prompts, isLoading, error, removePrompt } = usePrompts();

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

  const handleDelete = async () => {
    try {
      await removePrompt(prompt.id);
      navigate("/");
    } catch (err) {
      window.alert(err.message || "Could not delete prompt");
    }
  };

  const formattedDate = formatFullDate(prompt.createdAt);

  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex select-none items-center gap-1.5 text-sm text-text-secondary transition-ui hover:text-terracotta"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
      </div>

      <header className="space-y-4">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl">
          {prompt.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-2">
            <ToolDot tool={prompt.tool} />
            <span>{prompt.tool}</span>
            {prompt.model ? <span className="text-text-secondary/80">({prompt.model})</span> : null}
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={prompt.createdAt}>{formattedDate}</time>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="sr-only">Prompt content</h2>
        <PromptCodeBlock>{prompt.content}</PromptCodeBlock>

        <div className="flex flex-wrap items-center gap-4">
          {prompt.tags.length > 0 && (
            <p className="text-sm text-text-secondary">
              {prompt.tags.map((tag) => (
                <span key={tag} className="mr-2">
                  #{tag}
                </span>
              ))}
            </p>
          )}
          <StarRating rating={prompt.rating} className="text-base" />
        </div>
      </section>

      {prompt.notes && (
        <section className="space-y-2 border-t border-border pt-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-text-secondary">
            Notes
          </h2>
          <p className="text-sm leading-relaxed text-text-primary">{prompt.notes}</p>
        </section>
      )}

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(`/prompts/${prompt.id}/edit`)}
          className="gap-2"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete prompt
        </Button>
      </div>
    </article>
  );
}
