import { useState } from "react";
import { PROMPT_TOOLS } from "../types.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const EMPTY = {
  title: "",
  content: "",
  tool: "ChatGPT",
  model: "",
  rating: 3,
  tags: "",
  notes: "",
};

const fieldClass = "space-y-2";

/**
 * Controlled form for creating/editing a prompt.
 * Validation rule (Week 1 scope): title + content are required.
 *
 * @param {{
 *   initialValues?: Partial<import("../types.js").Prompt>,
 *   onSubmit: (data: Omit<import("../types.js").Prompt, "id" | "createdAt">) => (void | Promise<unknown>),
 *   submitLabel?: string,
 * }} props
 */
export default function PromptForm({
  initialValues,
  onSubmit,
  submitLabel = "Save prompt",
}) {
  const [values, setValues] = useState(() => ({
    ...EMPTY,
    ...initialValues,
    tags: Array.isArray(initialValues?.tags)
      ? initialValues.tags.join(", ")
      : EMPTY.tags,
  }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (name, value) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const validate = () => {
    const next = {};
    if (!values.title.trim()) next.title = "Title is required";
    if (!values.content.trim()) next.content = "Content is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: values.title.trim(),
      content: values.content.trim(),
      tool: values.tool,
      model: values.model.trim(),
      rating: Number(values.rating),
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      notes: values.notes.trim(),
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className={fieldClass}>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && (
          <p role="alert" className="text-sm text-destructive">
            {errors.title}
          </p>
        )}
      </div>

      <div className={fieldClass}>
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          name="content"
          rows={8}
          value={values.content}
          onChange={(e) => setField("content", e.target.value)}
          aria-invalid={Boolean(errors.content)}
          className="prompt-code min-h-[180px] resize-y"
        />
        {errors.content && (
          <p role="alert" className="text-sm text-destructive">
            {errors.content}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className={fieldClass}>
          <Label htmlFor="tool">Tool</Label>
          <select
            id="tool"
            name="tool"
            value={values.tool}
            onChange={(e) => setField("tool", e.target.value)}
            className={cn(
              "flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-text-primary transition-ui",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
          >
            {PROMPT_TOOLS.map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </select>
        </div>

        <div className={fieldClass}>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            value={values.model}
            onChange={(e) => setField("model", e.target.value)}
            placeholder="e.g. gpt-4o, claude-3.5-sonnet"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className={fieldClass}>
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min={1}
            max={5}
            value={values.rating}
            onChange={(e) => setField("rating", e.target.value)}
          />
        </div>

        <div className={fieldClass}>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            value={values.tags}
            onChange={(e) => setField("tags", e.target.value)}
            placeholder="comma, separated, tags"
          />
        </div>
      </div>

      <div className={fieldClass}>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          value={values.notes}
          onChange={(e) => setField("notes", e.target.value)}
        />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
