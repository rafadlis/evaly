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

  const { isPending, data } = trpc.organization.profile.useQuery()

  useEffect(() => {
    if (data?.organizer === null && pathName) {
      startRedirecting(() => {
        router.replace(
          `/${locale}/login?callbackURL=${encodeURIComponent(`${pathName}`)}`
        );
      });
    }
  }, [data?.organizer, pathName, locale, router]);

  if (isPending || !pathName || isRedirecting) return <LoadingScreen />;

  return <>{children}</>;
};

export default Provider;
