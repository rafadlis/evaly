"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Controller, useForm } from "react-hook-form";
import { OrganizerUserUpdate } from "@/types/user";
import { PencilLine, Info, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/trpc/trpc.client";

export const ProfilePage = () => {
  const { data, refetch } = trpc.participant.profile.useQuery();
  const [imageFilePreview, setImageFilePreview] = useState<string | null>(null);

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
      name: data?.user?.name,
      email: data?.user?.email,
      image: data?.user?.image,
    });
  }, [data, reset]);

  const { mutate: mutateUpdateProfile, isPending: isPendingUpdateProfile } =
    trpc.participant.updateProfile.useMutation({
      onSuccess(data) {
        if (data) {
          toast.success("Profile updated successfully");
          reset(data);
          refetch();
        }
      },
      onError(error) {
        toast.error(error.message);
      },
    });

  return (
            <form
              className="space-y-6"
              onSubmit={handleSubmit((data) => {
                const formData = new FormData();  
                formData.append("fullName", data.name ?? "");
                formData.append("imageFile", data.imageFile ?? "");
                mutateUpdateProfile(formData);
              })}
            >
              <div className="flex flex-col">
                <Controller
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <div className="relative w-max">
                      <Avatar className="size-24">
                        {imageFilePreview ? (
                          <AvatarImage
                            src={imageFilePreview}
                            alt="Profile"
                            className="object-cover"
                          />
                        ) : imageFile ? (
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
                            {data?.user?.email?.charAt(0) || "U"}
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
                              setImageFilePreview(URL.createObjectURL(file));
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
                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <Input
                          {...field}
                          disabled
                          placeholder="Your email address"
                        />
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    {isDirty ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          reset();
                          setImageFilePreview(null);
                        }}
                      >
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
  );
};