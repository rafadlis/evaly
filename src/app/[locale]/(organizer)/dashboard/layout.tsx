import React from "react";
import Provider from "./provider";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar";
import DynamicBreadcrumb from "@/components/shared/sidebar/dynamic-breadcrumb";

export const dynamic = "force-static";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset className="w-full flex flex-col gap-3">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-3 px-6 pb-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </Provider>
  );
};

export default Layout;
