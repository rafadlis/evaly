"use client";
import { authClient } from "@/lib/auth.client";
import { useEffect, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
const Page = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      await authClient.signOut();
      router.push("/");
    });
  }, [router]);

  if (isPending) return <div>Logging out...</div>;
  return null;
};

export default Page;
