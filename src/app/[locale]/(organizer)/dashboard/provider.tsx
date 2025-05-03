"use client";

import LoadingScreen from "@/components/shared/loading/loading-screen";
import { usePathname } from "@/i18n/navigation";
import { trpc } from "@/trpc/trpc.client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useTransition } from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const [isRedirecting, startRedirecting] = useTransition();
  const { locale } = useParams();
  const router = useRouter();

  const { isPending, error } = trpc.organization.profile.useQuery();

  useEffect(() => {
    if (error?.message === "UNAUTHORIZED" && pathName && !isPending) {
      startRedirecting(() => {
        router.replace(
          `/${locale}/login?callbackURL=${encodeURIComponent(`${pathName}`)}`
        );
      });
    }
  }, [pathName, locale, router, isPending, error]);

  if (!pathName || isRedirecting || isPending) return <LoadingScreen />;

  return <>{children}</>;
};

export default Provider;
