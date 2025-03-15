"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useLocalStorage } from "usehooks-ts";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [fontMono] = useLocalStorage("font-mono", false, {
    initializeWithValue: false,
  });

  React.useEffect(() => {
    if (fontMono) {
      document.documentElement.classList.add("font-mono");
    } else {
      document.documentElement.classList.remove("font-mono");
    }
  }, [fontMono]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
