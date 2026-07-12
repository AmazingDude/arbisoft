import { describe, it, expect } from "vitest";
import { formatFullDate, formatRelativeTime } from "../../lib/formatDate.js";

describe("formatRelativeTime", () => {
  const now = new Date("2026-07-12T12:00:00.000Z");

  it("formats recent times as relative units", () => {
    expect(formatRelativeTime("2026-07-12T11:59:30.000Z", now)).toBe("just now");
    expect(formatRelativeTime("2026-07-12T11:45:00.000Z", now)).toBe("15m ago");
    expect(formatRelativeTime("2026-07-12T09:00:00.000Z", now)).toBe("3h ago");
    expect(formatRelativeTime("2026-07-10T12:00:00.000Z", now)).toBe("2d ago");
  });

  it("formats older than a week as a short calendar date", () => {
    expect(formatRelativeTime("2026-07-03T08:00:00.000Z", now)).toMatch(/Jul/);
    expect(formatRelativeTime("2026-07-03T08:00:00.000Z", now)).toMatch(/3/);
  });
});

describe("formatFullDate", () => {
  it("formats a long calendar date", () => {
    expect(formatFullDate("2026-07-03T08:00:00.000Z")).toMatch(/July/);
    expect(formatFullDate("2026-07-03T08:00:00.000Z")).toMatch(/2026/);
  });
});
