import { cva } from "class-variance-authority";

/**
 * Button class variants, kept in a separate module from the Button component so
 * the component file only exports a React component (React Fast Refresh).
 */
export const buttonVariants = cva(
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-terracotta text-white hover:bg-terracotta/90",
        secondary:
          "border border-border bg-surface text-text-primary hover:bg-surface-hover",
        ghost:
          "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
        destructive:
          "border border-border bg-surface text-text-secondary hover:bg-surface-hover hover:text-destructive",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
