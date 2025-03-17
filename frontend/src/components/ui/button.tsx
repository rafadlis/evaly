import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center border border-transparent whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 transition-all cursor-pointer active:ring-1 ring-primary/30 ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-t from-primary to-primary/90 text-primary-foreground hover:bg-primary/95 border border-primary",
        destructive:
          "bg-destructive text-destructive-foreground  hover:bg-destructive/90",
        outline:
          "border border-input bg-background  hover:bg-secondary hover:text-secondary-foreground",
        "outline-solid":
          "border border-primary/50 bg-background  hover:bg-secondary hover:text-secondary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground  hover:bg-foreground/10",
        "secondary-outline":
          "bg-secondary border-foreground/10 text-secondary-foreground  hover:bg-secondary/80 hover:border-transparent",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-emerald-500/10 text-emerald-500",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:pl-3 gap-2 rounded-lg",
        sm: "h-8 px-3 has-[>svg]:pl-2.5 gap-1.5 text-sm rounded-md",
        xs: "h-7 px-3 has-[>svg]:pl-2 text-xs gap-1 text-xs rounded-md",
        xxs: "h-6 px-2 has-[>svg]:pl-2 text-xs gap-1 text-xs rounded-md",
        lg: "h-10 px-6 has-[>svg]:pl-5 gap-2.5 text-base rounded-lg",
        icon: "size-9 rounded-lg",
        "icon-sm": "size-8 text-sm rounded-md",
        "icon-xs": "size-7 text-xs rounded-md",
        "icon-xxs": "size-6 text-xs rounded-md",
      },
      rounded: {
        false: "",
        true: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: false,
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  rounded,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className, rounded }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
