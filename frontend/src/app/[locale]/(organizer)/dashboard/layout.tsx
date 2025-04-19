import React from "react";
import Provider from "./provider";
import { DashboardNavbar } from "@/components/shared/dashboard-navbar";

export const dynamic = "force-static";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DashboardNavbar />
      <Provider className="flex-1 flex flex-col">{children}</Provider>
    </>
  );
};

export default Layout;
