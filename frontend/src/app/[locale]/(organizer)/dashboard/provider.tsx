"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import React, { useEffect, useTransition } from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const [isRedirecting, startRedirecting] = useTransition();
  const router = useRouter();

  const { isPending, data } = useQuery({
    queryKey: ["organization"],
    queryFn: async () => {
      const response = await $api.organization.profile.get();
      return response;
    },
  });

  useEffect(() => {
    if (!isPending && data?.status === 401 && pathName) {
      startRedirecting(() => {
        router.replace(
          `/login?callbackURL=${encodeURIComponent(`${pathName}`)}`
        );
      });
    }
  }, [data?.status, pathName, router, isPending]);

  if (isPending || !pathName)
    return (
      <div className="flex-1 flex items-center justify-center text-3xl text-muted-foreground font-medium animate-pulse">
        Loading...
      </div>
    );

  if (data?.status !== 200 && data?.status !== 401) return notFound();
  if (isRedirecting) return <div>Redirecting...</div>;

  return <>{children}</>;
};

export default Provider;
