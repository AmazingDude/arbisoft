import { useState } from "react";
import { PROMPT_TOOLS } from "../types.js";

const EMPTY = {
  title: "",
  content: "",
  tool: "ChatGPT",
  model: "",
  rating: 3,
  tags: "", // edited as a comma-separated string, normalized on submit
  notes: "",
};

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
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <p role="alert">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="content">Content *</label>
        <textarea
          id="content"
          name="content"
          rows={6}
          value={values.content}
          onChange={(e) => setField("content", e.target.value)}
          aria-invalid={Boolean(errors.content)}
        />
        {errors.content && <p role="alert">{errors.content}</p>}
      </div>

      <div>
        <label htmlFor="tool">Tool</label>
        <select
          id="tool"
          name="tool"
          value={values.tool}
          onChange={(e) => setField("tool", e.target.value)}
        >
          {PROMPT_TOOLS.map((tool) => (
            <option key={tool} value={tool}>
              {tool}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="model">Model</label>
        <input
          id="model"
          name="model"
          value={values.model}
          onChange={(e) => setField("model", e.target.value)}
          placeholder="e.g. gpt-4o, claude-3.5-sonnet"
        />
      </div>

      <div>
        <label htmlFor="rating">Rating</label>
        <input
          id="rating"
          name="rating"
          type="number"
          min={1}
          max={5}
          value={values.rating}
          onChange={(e) => setField("rating", e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          name="tags"
          value={values.tags}
          onChange={(e) => setField("tags", e.target.value)}
          placeholder="comma, separated, tags"
        />
      </div>

      <div>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={values.notes}
          onChange={(e) => setField("notes", e.target.value)}
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
