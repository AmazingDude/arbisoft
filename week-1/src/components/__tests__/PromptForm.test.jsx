import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PromptForm from "../PromptForm.jsx";

describe("PromptForm", () => {
  it("blocks submit and shows errors when title + content are empty", async () => {
    const onSubmit = vi.fn();
    render(<PromptForm onSubmit={onSubmit} />);

    await userEvent.click(
      screen.getByRole("button", { name: /create|save/i })
    );

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/content is required/i)).toBeInTheDocument();
  });

  it("submits a normalized payload when valid", async () => {
    const onSubmit = vi.fn();
    render(<PromptForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/title/i), "My prompt");
    await userEvent.type(screen.getByLabelText(/content/i), "Do the thing");
    await userEvent.type(screen.getByLabelText(/tags/i), "a, b , ,c");
    await userEvent.click(
      screen.getByRole("button", { name: /create|save/i })
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "My prompt",
        content: "Do the thing",
        tags: ["a", "b", "c"],
      })
    );
  });

  it("calls onSubmit with the correct data when all fields are filled in validly", async () => {
    const onSubmit = vi.fn();
    render(<PromptForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/title/i), "Refactor helper");
    await userEvent.type(
      screen.getByLabelText(/content/i),
      "Refactor this function"
    );
    await userEvent.selectOptions(screen.getByLabelText(/tool/i), "Claude");
    await userEvent.type(
      screen.getByLabelText(/model/i),
      "claude-3.5-sonnet"
    );
    await userEvent.clear(screen.getByLabelText(/rating/i));
    await userEvent.type(screen.getByLabelText(/rating/i), "5");
    await userEvent.type(
      screen.getByLabelText(/tags/i),
      "react, refactor"
    );
    await userEvent.type(screen.getByLabelText(/notes/i), "Works great");

    await userEvent.click(
      screen.getByRole("button", { name: /create|save/i })
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Refactor helper",
      content: "Refactor this function",
      tool: "Claude",
      model: "claude-3.5-sonnet",
      rating: 5,
      tags: ["react", "refactor"],
      notes: "Works great",
    });
  });
});
