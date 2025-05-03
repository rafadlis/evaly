"use client";

import * as React from "react";
import { Home, BookOpen, UserCircle, Cog } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/shared/sidebar/sidebar-main";
import { DepartmentSwitcher } from "@/components/shared/sidebar/sidebar-department-swithcher";
import { NavUser } from "@/components/shared/sidebar/sidebar-account";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  const navItems = [
    {
      title: t("dashboard"),
      url: "/dashboard",
      icon: Home,
      isActive:
        pathname === "/dashboard" || pathname.startsWith("/dashboard/test"),
    },
    {
      title: t("question"),
      url: "/dashboard/question",
      icon: BookOpen,
      isActive: pathname.startsWith("/dashboard/question"),
    },
    {
      title: t("participant"),
      url: "/dashboard/participant",
      icon: UserCircle,
      isActive: pathname.startsWith("/dashboard/participant"),
    },
    {
      title: t("settings"),
      url: "/dashboard/settings",
      icon: Cog,
      isActive: pathname.startsWith("/dashboard/settings"),
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DepartmentSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          title={t("navbarTitle", { defaultValue: "Main" })}
          items={navItems}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
