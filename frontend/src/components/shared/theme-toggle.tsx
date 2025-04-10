"use client";

import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Loader2, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <Button variant="ghost" size="icon" className="hidden sm:flex">
      <Loader2 className="size-4 animate-spin" />
    </Button>
  );
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="hidden sm:flex"
    >
      {theme === "light" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;
