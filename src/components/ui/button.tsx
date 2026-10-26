import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-sans font-medium transition-[transform,background-color,color,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
  {
    variants: {
      variant: {
        solid: "bg-ink text-paper hover:bg-ink-soft",
        ghost: "bg-transparent text-ink hover:bg-paper-2",
        outline: "bg-transparent text-ink shadow-[var(--shadow-border)] hover:bg-paper-2",
        rubric: "bg-cover text-cover-ink hover:opacity-90",
      },
      size: {
        sm: "h-9 rounded-sm px-3 text-sm",
        md: "h-11 rounded-md px-4 text-sm",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
