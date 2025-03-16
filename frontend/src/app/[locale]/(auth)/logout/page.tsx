"use client";
import { authClient } from "@/lib/auth.client";
import { useEffect, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import LoadingScreen from "@/components/shared/loading/loading-screen";
const Page = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      await authClient.signOut();
      router.push("/");
    });
  }, [router]);

  if (isPending) return <LoadingScreen />;
  
  return null;
};

export default Page;
