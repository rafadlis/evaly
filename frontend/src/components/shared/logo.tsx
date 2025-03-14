import { Link } from "./progress-bar";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  href?: string;
}

export const LogoType = ({ className, href = "/" }: Props) => {
  return (
    <Link href={href} className={cn("flex items-center", className)}>
      <div className="h-7 w-7 text-lg bg-background text-primary flex items-center justify-center font-bold mr-2.5 shadow-[3px_3px_0px_0px_var(--primary)] hover:shadow-[0px_0px_0px_0px_var(--primary)] border-2 border-primary transition-all">
        E
      </div>
      <span className="text-2xl font-semibold hidden sm:block">evaly</span>
    </Link>
  );
};

export const Logo = ({ className, href = "/" }: Props) => {
  return (
    <Link href={href} className={cn("flex items-center", className)}>
      <div className="h-7 w-7 text-lg bg-background text-primary flex items-center justify-center font-bold mr-2.5 shadow-[3px_3px_0px_0px_var(--primary)] hover:shadow-[0px_0px_0px_0px_var(--primary)] border-2 border-primary transition-all">
        E
      </div>
    </Link>
  );
};
