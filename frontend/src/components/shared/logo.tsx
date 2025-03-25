"use client";

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
      <span className="text-base font-semibold hidden sm:block text-primary tracking-wide">
        Evaly
      </span>
    </Link>
  );
};

export const Logo = ({ className, }: { className?: string, }) => {
  return (
    <div className={cn("size-[24px] rounded-[4px] bg-primary flex items-center justify-center", className)}>
      <Planet size={16} className="stroke-background" />
    </div>
  );
};


const Planet = ({ 
  className,
  size = 24,
  strokeWidth = 2,
  ...props
}: { 
  className?: string,
  size?: number | string,
  strokeWidth?: number,
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={cn("stroke-primary-foreground", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="8"/>
      <path d="M4.05 13c-1.7 1.8-2.5 3.5-1.8 4.5 1.1 1.9 6.4 1 11.8-2s8.9-7.1 7.7-9c-.6-1-2.4-1.2-4.7-.7"/>
    </svg>
  );
};