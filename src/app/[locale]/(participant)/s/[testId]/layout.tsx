import React from 'react';

export const dynamic = "force-static";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout