import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

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
        "flex items-center gap-1 cursor-pointer hover:opacity-70 text-sm",
        className
      )}
      onClick={onBackClick}
    >
      <ChevronLeft className="size-4" />
      {label}
    </button>
  );
};

export default BackButton;
