"use client";
import { authClient } from "@/lib/auth.client";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

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
