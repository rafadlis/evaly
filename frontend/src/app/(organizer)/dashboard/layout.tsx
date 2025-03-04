import React from "react";
import { DashboardNavbar } from "@/components/shared/dashboard-navbar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DashboardNavbar />
      <main className="flex-1 py-16 flex flex-col">{children}</main>
    </>
  );
};

export default DashboardLayout;
