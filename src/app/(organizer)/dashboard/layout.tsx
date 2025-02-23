import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "../../../components/shared/sidebar/app-sidebar";
import { headers } from "next/headers";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const getHeaders = await headers();
  // const session = await getSession(getHeaders);
  
  // if (!session) notFound()

  // const data = await getOrganizerByUserId(session.user.id);

  // if (!data) {
  //   await createOrganizer(session.user.id);
  // }

  console.log(getHeaders.get("cookie"))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="py-14">{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
