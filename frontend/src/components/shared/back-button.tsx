import { cn } from "@/lib/utils";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = ({
  className,
  label = "Back",
  fallbackUrl = "/dashboard",
  href,
}: {
  className?: string;
  label?: string | React.ReactNode;
  fallbackUrl?: string;
  href?: string;
}) => {
  const router = useRouter();

  const onBackClick = () => {
    if (href) {
      router.push(href);
      return;
    }
    // Check if there's a previous page in the history
    if (window.history.length > 1) {
      router.back();
    } else {
      // If this is the first page, navigate to fallback URL
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-2 text-sm cursor-pointer hover:opacity-70",
        className
      )}
      onClick={onBackClick}
    >
      <MoveLeft className="size-4" />
      {label}
    </button>
  );
};

export default BackButton;
