"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Menu,
  X,
  Moon,
  Sun,
  Home,
  BookOpen,
  UserCircle,
  Cog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Link } from "./progress-bar";
import { useTheme } from "next-themes";
import { LogoType } from "./logo";
import ThemeToggle from "./theme-toggle";
import { usePathname } from "@/i18n/navigation";
import AdminAccount from "./account/admin-account";
import DialogSelectLanguage from "./dialog/dialog-select-language";
import { useTranslations } from "next-intl";



export function DashboardNavbar({ className }: { className?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("/dashboard");
  const { setTheme, theme } = useTheme();
  const t = useTranslations("Navbar");

  const navItems = useMemo(() =>[
    {
      name: t("dashboard"),
      href: "/dashboard",
      icon: <Home className="size-3.5 mr-1.5" />,
    },
    {
      name: t("question"),
      href: "/dashboard/question",
      icon: <BookOpen className="size-3.5 mr-1.5" />,
    },
    {
      name: t("participant"),
      href: "/dashboard/participant",
      icon: <UserCircle className="size-3.5 mr-1.5" />,
    },
    {
      name: t("settings"),
      href: "/dashboard/settings",
      icon: <Cog className="size-3.5 mr-1.5" />,
    },
  ], [t]);

  useEffect(() => {
    // Set active item based on pathname or keep it as state for demo
    if (pathname) {
      // Special case for /dashboard - only active for /dashboard or /dashboard/test/*
      if (pathname === "/dashboard" || pathname.startsWith("/dashboard/test")) {
        setActiveItem("/dashboard");
      } 
      // For other routes, find matching nav items
      else {
        const matchingItem = navItems
          .filter(item => item.href !== "/dashboard" && pathname.startsWith(item.href))
          .sort((a, b) => b.href.length - a.href.length)[0];
        
        if (matchingItem) {
          setActiveItem(matchingItem.href);
        }
      }
    }
  }, [pathname, navItems]);


  return (
    <nav
      className={cn(
        "sticky top-0 left-0 w-full z-50 transition-all bg-background",
        className,
      )}
    >
      <div className="mx-auto px-3 md:px-6 h-14">
        <div className="flex items-center h-full justify-between">
          <div className="flex flex-row items-center">
            {/* Logo */}
            <LogoType href="/dashboard" />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center ml-20 gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-muted-foreground transition-colors hover:text-primary font-medium text-sm flex items-center",
                    // Special case for dashboard
                    item.href === "/dashboard" 
                      ? (pathname === "/dashboard" || pathname.startsWith("/dashboard/test")) && "font-bold text-primary"
                      : pathname.startsWith(item.href) && "font-bold text-primary"
                  )}
                >
                  {/* {item.icon} */}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search, Notifications, Profile */}
          <div className="flex items-center gap-3">
            {/* <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button> */}
            <DialogSelectLanguage />
            <ThemeToggle />

            <AdminAccount />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 z-50 bg-background">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-2 px-3 font-medium transition-colors relative  flex items-center",
                  // Special case for dashboard
                  item.href === "/dashboard"
                    ? (pathname === "/dashboard" || pathname.startsWith("/dashboard/test"))
                      ? "text-primary"
                      : "hover:text-primary/80"
                    : pathname.startsWith(item.href)
                      ? "text-primary"
                      : "hover:text-primary/80"
                )}
                onClick={() => setActiveItem(item.href)}
              >
                {item.icon}
                {item.name}
                {activeItem === item.href && (
                  <motion.span
                    layoutId="navbar-active-indicator-mobile"
                    className="absolute inset-0 bg-muted/80 z-[-1]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
            <div className="pt-2 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center"
              >
                {theme === "light" ? (
                  <Sun className="h-4 w-4 mr-2" />
                ) : (
                  <Moon className="h-4 w-4 mr-2" />
                )}
                {theme === "light" ? "Light Mode" : "Dark Mode"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
