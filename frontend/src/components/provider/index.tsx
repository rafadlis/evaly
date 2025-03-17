import React from "react";
import TanstackQueryProvider from "./tanstack-query.provider";
import NuqsProvider from "./nuqs.provider";
import { ProgressBar } from "../shared/progress-bar";
import { ThemeProvider } from "./theme-provider";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TanstackQueryProvider>
        <NuqsProvider>
          <ProgressBar className="bg-foreground/20 fixed top-0  z-[100] h-0.5">
            {children}
          </ProgressBar>
        </NuqsProvider>
      </TanstackQueryProvider>
    </ThemeProvider>
  );
};

export default Provider;
