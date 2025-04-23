"use client";

import { EqualApproximatelyIcon } from "lucide-react";
import { Link } from "./progress-bar";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  href?: string;
}

export const LogoType = ({ className, href = "/" }: Props) => {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <Logo />
      <span className="font-bold hidden sm:block text-primary">
        Evaly
      </span>
    </Link>
  );
};

export const Logo = ({ className, }: { className?: string, }) => {
  return (
    <div className={cn("size-[20px] bg-foreground flex items-center justify-center", className)}>
      <EqualApproximatelyIcon size={16} className="stroke-background" />
    </div>
  );
};
