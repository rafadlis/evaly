import { env } from "@/lib/env";
import { useSearchParams } from "next/navigation";

export const useGetCallbackUrl = () => {
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackURL");
  
  if (!callbackURL) {
    return null;
  }

  return env.NEXT_PUBLIC_URL + callbackURL;
};
