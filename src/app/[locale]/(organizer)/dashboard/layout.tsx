import React from "react";
import Provider from "./provider";
import { DashboardNavbar } from "@/components/shared/dashboard-navbar";

export const dynamic = "force-static";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <DashboardNavbar />
      <main className="flex flex-col flex-1">{children}</main>
    </Provider>
  );
};

export default Layout;
