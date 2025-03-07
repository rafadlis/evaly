import React from "react";
import Provider from "./provider";
import { DashboardNavbar } from "@/components/shared/dashboard-navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <div className="fixed -top-1/2 -left-1/6 w-1/2 aspect-square rounded-[100%] bg-foreground/5 blur-[60px] md:blur-[90px] pointer-events-none -z-10"></div>
      <DashboardNavbar />
      <main className="flex-1 py-16 flex flex-col">{children}</main>
    </Provider>
  );
};

export default Layout;
