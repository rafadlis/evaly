"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganizerProfile } from "@/query/organization/profile/use-organizer-profile";
import { Loader2, Save, Info, PencilLine, SettingsIcon, UserIcon, Building2Icon, SunIcon, MoonIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { toast } from "sonner";
import { OrganizerUserUpdate } from "@evaly/backend/types/user";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "usehooks-ts";

const Settings = () => {
  const [tab, setTab] = useQueryState("tab", { defaultValue: "general" });
  return (
    <div className="container dashboard-margin">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="flex flex-row gap-10 mt-10">
        <div className="w-[240px] flex flex-col gap-2 sticky top-24 h-max">
          <Button
            variant={tab === "general" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setTab("general")}
          >
            <SettingsIcon className="text-muted-foreground/50" />
            General
          </Button>
          <Button
            variant={tab === "profile" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setTab("profile")}
          >
            <UserIcon className="text-muted-foreground/50" />
            Profile
          </Button>
          <Button
            variant={tab === "organization" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setTab("organization")}
          >
            <Building2Icon className="text-muted-foreground/50" />
            Organization
          </Button>
        </div>
        <div className="flex-1">
          {tab === "general" && <General />}
          {tab === "profile" && <Profile />}
          {tab === "organization" && <Organization />}
        </div>
      </div>
    </div>
  );
};

const General = () => {
  const { theme, setTheme } = useTheme();
  const [fontMono, setFontMono] = useLocalStorage("font-mono", false);
  
  return (
    <Card>
      <CardHeader className="border-b border-dashed">
        <CardTitle className="text-lg font-medium">General</CardTitle>
        <CardDescription>
          Manage your general account settings and preferences. You can update
          your appearance settings and customize your experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div>
          <h3 className="text-base font-medium mb-4">Appearance</h3>
          <div className="space-y-6">
            {/* Theme Selection */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="theme-select" className="text-sm font-medium text-foreground">
                Theme
              </Label>
              <div className="flex gap-4">
                <Button 
                  variant={theme === 'light' ? 'default' : 'outline'} 
                  className="flex items-center gap-2 px-4 py-2 h-10"
                  onClick={() => setTheme('light')}
                >
                  <SunIcon className="h-4 w-4" />
                  <span>Light</span>
                </Button>
                
                <Button 
                  variant={theme === 'dark' ? 'default' : 'outline'} 
                  className="flex items-center gap-2 px-4 py-2 h-10"
                  onClick={() => setTheme('dark')}
                >
                  <MoonIcon className="h-4 w-4" />
                  <span>Dark</span>
                </Button>
              </div>
            </div>
            
            {/* Font Style */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-foreground">
                  Classic Font
                </Label>
                <p className="text-sm">
                  Use classic (monospace) font throughout the application
                </p>
              </div>
              <Switch
                checked={fontMono}
                onCheckedChange={setFontMono}
                aria-label="Toggle monospace font"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Profile = () => {
  const { data, refetch } = useOrganizerProfile();

  // Define form for profile
  const {
    control,
    reset,
    formState: { isDirty },
    handleSubmit,
    setValue,
    watch,
  } = useForm<OrganizerUserUpdate & { imageFile?: File }>({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const imageFile = watch("imageFile");

  useEffect(() => {
    reset({
      name: data?.data?.user?.name,
      email: data?.data?.user?.email,
      image: data?.data?.user?.image,
    });
  }, [data, reset]);

  const { mutate: mutateUpdateProfile, isPending: isPendingUpdateProfile } =
    useMutation({
      mutationKey: ["update-organizer-profile"],
      mutationFn: async (data: { fullName: string; imageFile?: File }) => {
        const response = await $api.organization.profile.put(data);
        if (response.error?.value){
          toast.error(response.error.value.message)
          return
        }
        return response.data;
      },
      onSuccess(data) {
        if (data) {
          toast.success("Profile updated successfully");
          reset(data);
          refetch();
        }
      },
    });

  return (
    <Card>
      <CardHeader className="border-b border-dashed">
        <CardTitle className="text-lg font-medium">Profile</CardTitle>
        <CardDescription>
          Manage your profile settings. You can update your profile information.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form
          className="space-y-6"
          onSubmit={handleSubmit((data) => {
            mutateUpdateProfile({
              fullName: data.name ?? "",
              imageFile: data.imageFile,
            });
          })}
        >
          <div className="flex flex-col">
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <div className="relative w-max">
                  <Avatar className="size-24">
                    {imageFile ? (
                      <AvatarImage
                        src={URL.createObjectURL(imageFile)}
                        alt="Profile"
                        className="object-cover"
                      />
                    ) : field.value ? (
                      <AvatarImage
                        src={field.value}
                        alt="Profile"
                        className="object-cover bg-foreground/5"
                      />
                    ) : (
                      <AvatarFallback className="text-4xl">
                        {data?.data?.user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-row gap-2 absolute right-0 bottom-0">
                    <Button
                      variant="secondary-outline"
                      size="icon"
                      type="button"
                      onClick={() => {
                        document.getElementById("profile-image")?.click();
                      }}
                      rounded
                    >
                      <PencilLine />
                    </Button>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setValue("imageFile", file, {
                            shouldDirty: true,
                          });
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            />

            <div className="space-y-6 mt-8">
              <Controller
                control={control}
                name="name"
                rules={{ required: "Full name is required" }}
                render={({ field }) => (
                  <div>
                    <Label>Full Name</Label>
                    <Input {...field} placeholder="Your full name" />
                  </div>
                )}
              />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Email address cannot be changed</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="email"
                  value={data?.data?.user?.email}
                  disabled
                  className="bg-muted"
                  placeholder="Your email address"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                {isDirty ? (
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                ) : null}
                <Button
                  type="submit"
                  disabled={isPendingUpdateProfile || !isDirty}
                >
                  {isPendingUpdateProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const Organization = () => {
  const { data: organizationData } = useOrganizerProfile();

  return (
    <Card>
      <CardHeader className="border-b border-dashed">
        <CardTitle className="text-lg font-medium">Organization</CardTitle>
        <CardDescription>
          Manage your organization settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {organizationData?.data?.organizer?.organization ? (
          <div className="text-muted-foreground">
            Organization settings coming soon...
          </div>
        ) : (
          <div className="text-muted-foreground">
            No organization data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Settings;
