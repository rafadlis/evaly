import React from "react";
import TanstackQueryProvider from "./tanstack-query.provider";
import NuqsProvider from "./nuqs.provider";
import { ProgressBar } from "../shared/progress-bar";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TanstackQueryProvider>
      <NuqsProvider>
        <ProgressBar className="bg-foreground fixed top-0  z-[100] h-1">{children}</ProgressBar>
      </NuqsProvider>
    </TanstackQueryProvider>
  );
};

export default Provider;
