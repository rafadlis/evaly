import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "../../../components/shared/sidebar/app-sidebar";
import { getSession } from "@/services/common/get-session";
import { headers } from "next/headers";
import { getOrganizerByUserId } from "@/services/organizer/get-organizer-byuserid";
import { createOrganizer } from "@/services/organizer/create-organizer";
import { notFound } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const getHeaders = await headers();
  const session = await getSession(getHeaders);
  
  if (!session) notFound()

  const data = await getOrganizerByUserId(session.user.id);

  if (!data) {
    await createOrganizer(session.user.id);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="py-14">{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
