import { Skeleton } from "@/components/ui/skeleton";

const LoadingTest = () => {
  return (
    <div className="flex flex-col animate-pulse gap-4 min-h-dvh">
      {Array.from({ length: 10 }).map((_, e) => (
          <Skeleton className="w-full h-14" key={e} />
      ))}
    </div>
  );
};

export default LoadingTest;
