import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "@/components/shared/sidebar/app-sidebar";


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="py-14">{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
