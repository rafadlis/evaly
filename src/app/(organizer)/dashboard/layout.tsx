import React from "react";
import { DashboardNavbar } from "@/components/shared/dashboard-navbar";


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <DashboardNavbar />
      <main className="py-24 min-h-[110vh]">{children}</main>
    </>
  );
};

export default DashboardLayout;
