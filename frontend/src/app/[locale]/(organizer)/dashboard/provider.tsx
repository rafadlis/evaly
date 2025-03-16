"use client";

import LoadingScreen from "@/components/shared/loading/loading-screen";
import { usePathname } from "@/i18n/navigation";
import { useOrganizerProfile } from "@/query/organization/profile/use-organizer-profile";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useEffect, useTransition } from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const [isRedirecting, startRedirecting] = useTransition();
  const { locale } = useParams();
  const router = useRouter();

  const { isPending, data } = useOrganizerProfile();

  useEffect(() => {
    if (data?.status === 401 && pathName) {
      startRedirecting(() => {
        router.replace(
          `/${locale}/login?callbackURL=${encodeURIComponent(`${pathName}`)}`
        );
      });
    }
  }, [data?.status, pathName, locale, router]);

  if (isPending || !pathName)
    return (
      <div className="flex-1 flex items-center justify-center text-3xl text-muted-foreground font-medium animate-pulse">
        Loading...
      </div>
    );

  if (data?.status !== 200 && data?.status !== 401) return notFound();
  if (isRedirecting) return <LoadingScreen />;

  return <>{children}</>;
};

export default Provider;
