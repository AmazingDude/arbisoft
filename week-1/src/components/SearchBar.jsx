import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Controlled search input. State is owned by the parent (Dashboard) so it can
 * feed the useMemo'd filtering — this component is purely a controlled view.
 *
 * @param {{ value: string, onChange: (value: string) => void, className?: string }} props
 */
export default function SearchBar({ value, onChange, className }) {
  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <Label htmlFor="prompt-search" className="sr-only">
        Search
      </Label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
        aria-hidden="true"
      />
      <Input
        id="prompt-search"
        type="search"
        placeholder="Search prompts…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
