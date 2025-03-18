"use client";

import { useState, useEffect } from "react";
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

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-4 w-4 mr-2" />,
  },
  {
    name: "Question",
    href: "/dashboard/question",
    icon: <BookOpen className="h-4 w-4 mr-2" />,
  },
  {
    name: "Participant",
    href: "/dashboard/participant",
    icon: <UserCircle className="h-4 w-4 mr-2" />,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: <Cog className="h-4 w-4 mr-2" />,
  },
];
export function DashboardNavbar({ className }: { className?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("/dashboard");
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  }, [pathname]);


  return (
    <nav
      className={cn(
        "sticky top-0 left-0 w-full z-50 transition-all border-b border-dashed  bg-background",
        className,
        isScrolled ? "border-border py-1.5" : "border-transparent  py-3"
      )}
    >
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center">
            {/* Logo */}
            <LogoType href="/dashboard" />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center ml-16 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-muted-foreground transition-colors rounded-md hover:text-primary px-3 py-1.5 font-medium text-[15px] flex items-center",
                    // Special case for dashboard
                    item.href === "/dashboard" 
                      ? (pathname === "/dashboard" || pathname.startsWith("/dashboard/test")) && "text-primary bg-secondary"
                      : pathname.startsWith(item.href) && "text-primary bg-secondary"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search, Notifications, Profile */}
          <div className="flex items-center space-x-3">
            {/* <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button> */}

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
          <div className="md:hidden py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-2 px-3 font-medium transition-colors relative rounded-md flex items-center",
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
                    className="absolute inset-0 bg-muted/80 rounded-md z-[-1]"
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
