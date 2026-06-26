import { TOOL_COLORS } from "@/lib/toolColors";
import { cn } from "@/lib/utils";

/**
 * 8px tool identity dot — color only, no badge chrome.
 * @param {{ tool: import("../types.js").PromptTool, className?: string }} props
 */
export default function ToolDot({ tool, className }) {
  return (
    <span
      className={cn("inline-block h-2 w-2 shrink-0 rounded-full", className)}
      style={{ backgroundColor: TOOL_COLORS[tool] ?? TOOL_COLORS.Other }}
      aria-hidden="true"
    />
  );
}
