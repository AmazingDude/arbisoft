import { cn } from "@/lib/utils";

/**
 * Monospace code-block style for prompt content.
 * @param {{ children: string, className?: string }} props
 */
export default function PromptCodeBlock({ children, className }) {
  return (
    <pre className={cn("prompt-code whitespace-pre-wrap", className)}>
      {children}
    </pre>
  );
}
