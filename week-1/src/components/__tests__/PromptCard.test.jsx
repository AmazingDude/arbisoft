import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import PromptCard from "../PromptCard.jsx";

const samplePrompt = {
  id: "p1",
  title: "Refactor a React component",
  content: "Refactor the following component...",
  tool: "Claude",
  model: "claude-3.5-sonnet",
  rating: 4,
  tags: ["react", "refactor"],
  notes: "Great for cleanup",
  createdAt: "2026-06-01T09:15:00.000Z",
};

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

// PromptCard renders a <Link>, so it needs a Router context.
function renderCard(props, { initialPath = "/" } = {}) {
  return render(
    <MemoryRouter
      initialEntries={[initialPath]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route
          path="*"
          element={
            <>
              <PromptCard {...props} />
              <LocationDisplay />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("PromptCard", () => {
  it("renders the prompt's title, tool, and rating", () => {
    renderCard({ prompt: samplePrompt, onDelete: vi.fn() });

    expect(
      screen.getByRole("link", { name: samplePrompt.title })
    ).toBeInTheDocument();
    expect(screen.getByText(samplePrompt.tool)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`★{${samplePrompt.rating}}`))
    ).toBeInTheDocument();
  });

  it("navigates to the detail page when the row is clicked", async () => {
    renderCard({ prompt: samplePrompt, onDelete: vi.fn() });

    await userEvent.click(
      screen.getByRole("link", { name: samplePrompt.title })
    );

    expect(screen.getByTestId("location")).toHaveTextContent(
      `/prompts/${samplePrompt.id}`
    );
  });

  it("calls onDelete without navigating when the delete button is clicked", async () => {
    const onDelete = vi.fn();
    renderCard({ prompt: samplePrompt, onDelete });

    expect(screen.getByTestId("location")).toHaveTextContent("/");

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(samplePrompt.id);
    expect(screen.getByTestId("location")).toHaveTextContent("/");
  });
});
