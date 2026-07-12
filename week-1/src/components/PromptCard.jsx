import { memo } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StarRating from "./StarRating.jsx";
import ToolDot from "./ToolDot.jsx";
import { formatRelativeTime } from "@/lib/formatDate.js";
import { cn } from "@/lib/utils";

/**
 * Single prompt summary in the list.
 *
 * The main row body is a <Link> (full-row click). Delete sits outside that
 * link so a delete click never navigates to the detail page.
 *
 * Wrapped in React.memo so it only re-renders when its own props change.
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
  const relativeCreatedAt = formatRelativeTime(prompt.createdAt);

  return (
    <article
      className={cn(
        "group flex items-stretch border-b border-border bg-surface transition-ui",
        "motion-safe:hover:-translate-y-px hover:bg-surface-hover"
      )}
    >
      <Link
        to={`/prompts/${prompt.id}`}
        aria-label={prompt.title}
        className="min-w-0 flex-1 cursor-pointer px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-terracotta"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="min-w-0 truncate text-sm font-medium text-text-primary transition-ui group-hover:text-terracotta">
            {prompt.title}
          </h3>
          {relativeCreatedAt ? (
            <time
              dateTime={prompt.createdAt}
              className="shrink-0 text-xs text-text-secondary"
            >
              {relativeCreatedAt}
            </time>
          ) : null}
        </div>

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
      </Link>

      <div className="flex shrink-0 items-center pr-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(prompt.id);
          }}
          className="text-text-secondary opacity-0 transition-ui group-hover:opacity-100 focus-visible:opacity-100 hover:text-destructive"
          aria-label="Delete prompt"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </article>
  );
}

export default memo(PromptCard);
