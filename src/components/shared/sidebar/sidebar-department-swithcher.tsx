"use client";

import * as React from "react";
import {
  Plus,
  ChevronsUpDown as CaretUpDown,
  ConciergeBell,
  ClipboardList,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function DepartmentSwitcher({
  departments = [
    {
      name: "Admin",
      logo: ConciergeBell,
      description: "Reception & Guest Services",
      href: "/front-office",
      isActive: true,
    },
    {
      name: "Teacher/Organizer",
      logo: ClipboardList,
      description: "Room Maintenance",
      href: "/housekeeping",
      isActive: false,
    },
    {
      name: "Monitor",
      logo: ReceiptText,
      description: "Billing & Accounting",
      href: "/financial",
      isActive: false,
    },
  ],
}: {
  departments?: {
    name: string;
    logo: React.ElementType;
    description: string;
    href: string;
    isActive: boolean;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeDepartment, setActiveDepartment] = React.useState(
    departments[0]
  );
  const t = useTranslations("Department");

  const handleDepartmentChange = (department: (typeof departments)[0]) => {
    setActiveDepartment(department);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeDepartment.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeDepartment.name}
                </span>
                <span className="truncate text-xs">
                  {activeDepartment.description}
                </span>
              </div>
              <CaretUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t("departments", { defaultValue: "Departments" })}
            </DropdownMenuLabel>
            {departments.map((department, index) => (
              <DropdownMenuItem
                key={department.name}
                onClick={() => handleDepartmentChange(department)}
                className="gap-2 p-2"
                asChild
                disabled={!department.isActive}
              >
                <Link
                  href={department.href}
                  className="hover:bg-sidebar-accent cursor-pointer"
                >
                  <div className="flex size-6 items-center justify-center rounded-xs border">
                    <department.logo className="size-4 shrink-0" />
                  </div>
                  {t(`name.${department.name.replace(/\W/g, "")}`, {
                    defaultValue: department.name,
                  })}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                {t("addDepartment", { defaultValue: "Add department" })}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
