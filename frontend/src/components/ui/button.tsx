import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center duration-100 border border-transparent whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:shrink-0 transition-all cursor-pointer active:opacity-90",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground  hover:bg-destructive/90",
        outline:
          "border border-input bg-background  hover:shadow-sm",
        "outline-solid":
          "border-1 border-primary bg-background hover:bg-primary hover:text-primary-foreground",
        secondary:
          "bg-muted text-secondary-foreground  hover:bg-foreground/10",
        "secondary-outline":
          "bg-secondary border-foreground/10 text-secondary-foreground  hover:bg-secondary/80 hover:border-transparent",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-emerald-500/10 text-emerald-500",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
      },
      size: {
        default: "h-8 px-3 gap-2 ",
        sm: "h-7 px-3  gap-1.5 text-sm ",
        xs: "h-6 px-3 text-xs gap-1 text-xs ",
        xxs: "h-5 px-2 text-xs gap-1 text-xs ",
        lg: "h-9 px-5  gap-2.5 text-base ",
        icon: "size-8",
        "icon-sm": "size-7 text-sm ",
        "icon-xs": "size-6 text-xs ",
        "icon-xxs": "size-5 text-xs ",
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
