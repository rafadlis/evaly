"use client";

import { Suspense } from "react";
import DashboardPageClient from "./page.client";

const Page = () => {
  return (
    <div className="dashboard-margin">
      <Suspense>
        <DashboardPageClient />
      </Suspense>
    </div>
  );
};
export default Page;
