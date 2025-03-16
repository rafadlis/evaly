"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Link } from "./progress-bar";
import { useTheme } from "next-themes";
import { LogoType } from "./logo";
import ThemeToggle from "./theme-toggle";
import { usePathname } from "@/i18n/navigation";
import AdminAccount from "./account/admin-account";

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
      setActiveItem(pathname);
    }
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Question", href: "/dashboard/question" },
    { name: "Participant", href: "/dashboard/participant" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <nav
      className={cn(
        "sticky top-0 left-0 w-full z-50 transition-all border-b border-dashed  bg-background",
        className,
        isScrolled ? "border-border" : "border-transparent"
      )}
    >
      <div className="mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center">
            {/* Logo */}
            <LogoType href="/dashboard" />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center ml-16 gap-5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-muted-foreground transition-colors  hover:text-primary font-medium",
                    pathname === item.href && "text-primary",
                  )}
                >
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
            <div className="flex items-center relative mb-4">
              <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-full h-9 bg-muted/50"
              />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block py-2 px-3 font-medium transition-colors relative rounded-md",
                  item.href.includes(activeItem)
                    ? "text-primary"
                    : "hover:text-primary/80"
                )}
                onClick={() => setActiveItem(item.href)}
              >
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
