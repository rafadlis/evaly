import React from "react";
import Provider from "./provider";
import { DashboardNavbar } from "@/components/shared/dashboard-navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <DashboardNavbar />
      <div className="flex-1 py-10 flex flex-col">{children}</div>
    </Provider>
  );
};

export default Layout;
