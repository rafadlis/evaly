import React from "react";
import TanstackQueryProvider from "./tanstack-query.provider";
import NuqsProvider from "./nuqs.provider";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TanstackQueryProvider>
      <NuqsProvider>{children}</NuqsProvider>
    </TanstackQueryProvider>
  );
};

export default Provider;
