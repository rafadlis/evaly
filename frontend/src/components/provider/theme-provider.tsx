"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // const [fontMono] = useLocalStorage("font-mono", true, {
  //   initializeWithValue: false,
  // });

  // React.useEffect(() => {
  //   if (fontMono) {
  //     document.documentElement.classList.remove("font-sans");
  //   } else {
  //     document.documentElement.classList.add("font-sans");
  //   }
  // }, [fontMono]);

  return <NextThemesProvider  {...props}>{children}</NextThemesProvider>;
}
