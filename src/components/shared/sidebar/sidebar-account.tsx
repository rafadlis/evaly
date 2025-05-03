"use client";

import {
  ChevronsUpDown as CaretUpDown,
  LogOut as SignOut,
  Sun,
  Moon,
  Monitor,
  Lamp,
  User,
  Settings,
  Building2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useTheme } from "next-themes";

import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/trpc.client";

import { useTranslations } from "next-intl";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { setTheme } = useTheme();
  const router = useRouter();
  const t = useTranslations("Account");

  const { data } = trpc.organization.profile.useQuery();

  const email = data?.user?.email;
  const name = data?.user?.name || email?.split("@")[0];
  const image = data?.user?.image;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {image ? (
                  <AvatarImage src={image} alt={"User"} />
                ) : (
                  <AvatarFallback className="rounded-lg">
                    {email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <CaretUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {image ? (
                    <AvatarImage src={image} alt={name} />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings?tab=profile")}
              >
                <User className="size-3.5 mr-1" />
                {t("profile", { defaultValue: "Profile" })}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push("/dashboard/settings?tab=organization")
                }
              >
                <Building2 className="size-3.5 mr-1" />
                {t("organization", { defaultValue: "Organization" })}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings?tab=general")}
              >
                <Settings className="size-3.5 mr-1" />
                {t("settings", { defaultValue: "Settings" })}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenu>
                <DropdownMenuItem asChild>
                  <DropdownMenuTrigger className="cursor-pointer w-full">
                    <Lamp />
                    {t("changeTheme", { defaultValue: "Change Theme" })}
                  </DropdownMenuTrigger>
                </DropdownMenuItem>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon />
                    {t("dark", { defaultValue: "Dark" })}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setTheme("light")}
                  >
                    <Sun />
                    {t("light", { defaultValue: "Light" })}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor />
                    {t("system", { defaultValue: "System" })}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/logout")}
              className="cursor-pointer"
            >
              <SignOut />
              {t("logout", { defaultValue: "Logout" })}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
