import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useProgressRouter } from "./progress-bar";

const BackButton = ({
  className,
  label,
  fallbackUrl = "/dashboard",
  href,
}: {
  className?: string;
  label?: string | React.ReactNode;
  fallbackUrl?: string;
  href?: string;
}) => {
  const router = useProgressRouter();
  const t = useTranslations("Common");

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
        "w-max flex items-center gap-1 cursor-pointer hover:opacity-70 text-sm",
        className
      )}
      onClick={onBackClick}
    >
      <ChevronLeft className="size-4" />
      {label || t("backButton")}
    </button>
  );
};

export default BackButton;
