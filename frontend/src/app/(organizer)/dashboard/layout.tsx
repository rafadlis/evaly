import React from "react";
import Provider from "./provider";
import { DashboardNavbar } from "@/components/shared/dashboard-navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <DashboardNavbar />
      <main className="flex-1 py-16 flex flex-col">{children}</main>
    </Provider>
  );
};

export default Layout;
