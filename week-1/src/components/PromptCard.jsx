import { memo } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StarRating from "./StarRating.jsx";
import ToolDot from "./ToolDot.jsx";
import { cn } from "@/lib/utils";

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
const PREVIEW_LENGTH = 70;

function getContentPreview(content) {
  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized.length > PREVIEW_LENGTH
    ? `${normalized.slice(0, PREVIEW_LENGTH)}…`
    : normalized;
}

function PromptCard({ prompt, onDelete }) {
  return (
    <article
      className={cn(
        "group flex items-center gap-3 border-b border-border bg-surface px-4 py-3 transition-ui",
        "motion-safe:hover:-translate-y-px hover:bg-surface-hover"
      )}
    >
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium">
          <Link
            to={`/prompts/${prompt.id}`}
            className="text-text-primary transition-ui hover:text-terracotta"
          >
            {prompt.title}
          </Link>
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <ToolDot tool={prompt.tool} />
            <span>{prompt.tool}</span>
          </span>
          {prompt.model ? <span>· {prompt.model}</span> : null}
          <StarRating rating={prompt.rating} className="text-xs" />
        </div>

        {prompt.content && (
          <p className="mt-1 truncate font-mono text-xs text-text-secondary">
            {getContentPreview(prompt.content)}
          </p>
        )}

        {prompt.tags.length > 0 && (
          <p className="mt-1 truncate text-xs text-text-secondary">
            {prompt.tags.map((tag) => `#${tag}`).join(" ")}
          </p>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onDelete(prompt.id)}
        className="shrink-0 text-text-secondary opacity-0 transition-ui group-hover:opacity-100 focus-visible:opacity-100 hover:text-destructive"
        aria-label="Delete prompt"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Delete</span>
      </Button>
    </article>
  );
}

export default memo(PromptCard);
