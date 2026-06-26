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
});
