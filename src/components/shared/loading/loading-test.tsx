import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingTest = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col animate-pulse gap-4 min-h-dvh", className)}>
      {Array.from({ length: 10 }).map((_, e) => (
          <Skeleton className="w-full h-32 rounded-xl" key={e} />
      ))}
    </div>
  );
};

export default LoadingTest;
