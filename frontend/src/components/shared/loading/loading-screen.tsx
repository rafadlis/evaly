import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="size-12 animate-spin" />
    </div>
  );
};

export default LoadingScreen;
