"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { $api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

const DialogDeleteTest = ({
  className,
  testId,
  onSuccess,
}: {
  className?: string;
  testId: string;
  onSuccess?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("TestDialogs");
  const tCommon = useTranslations("Common");
  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-test"],
    mutationFn: async (testId: string) => {
      const response = await $api.organization.test({ id: testId }).delete();

      if (response.status !== 200) {
        throw new Error("Failed to delete test");
      }

      setOpen(false);
      onSuccess?.();
      return response.data;
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={"icon-xs"}
          variant={"ghost"}
          className={cn(className)}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t("deleteTestTitle")}</DialogTitle>
          <DialogDescription>{t("deleteTestDescription")}</DialogDescription>
        </DialogHeader>
        {/* <CardSession data={} /> */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>{tCommon("backButton")}</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={() => mutate(testId)}
            disabled={isPending}
          >
            {isPending ? tCommon("deletingStatus") : tCommon("deleteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteTest;
