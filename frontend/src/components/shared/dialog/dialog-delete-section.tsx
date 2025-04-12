import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

const DialogDeleteSection = ({
  className,
  disabled = false,
  dialogTrigger = (
    <Button
      disabled={disabled}
      size={"icon-xs"}
      variant={"ghost"}
      className={cn(className)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Trash2Icon />
    </Button>
  ),
  sectionId,
  onSuccess,
  isLastSection = false,
}: {
  className?: string;
  disabled?: boolean;
  dialogTrigger?: React.ReactNode;
  sectionId: string;
  onSuccess: () => void;
  isLastSection?: boolean;
}) => {
  const t = useTranslations("TestDetail");
  const tCommon = useTranslations("Common");
  
  const [open, setOpen] = useState(false);
  const { mutate: deleteSection, isPending } = useMutation({
    mutationKey: ["delete-section"],
    mutationFn: async () => {
      const response = await $api.organization.test
        .section({ id: sectionId })
        .delete.delete();

      if (response.status !== 200) {
        throw new Error(response.error?.value as unknown as string);
      }
      return response.data;
    },
    onSuccess: () => {
      onSuccess();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deleteSectionTitle")}</DialogTitle>
          <DialogDescription>
            {t("deleteSectionDescription")}
          </DialogDescription>
        </DialogHeader> 
        {isLastSection && (
          <span className="text-sm text-muted-foreground bg-secondary p-2 rounded-md">
            {t("deleteSectionLastSection")}
          </span>
        )}
        <DialogFooter>
          <Button variant={"secondary"} onClick={() => setOpen(false)}>
            {tCommon("backButton")}
          </Button>
          <Button
            variant={"destructive"}
            disabled={isPending || isLastSection}
            onClick={() => deleteSection()}
          >
            {isPending ? tCommon("deletingStatus") : tCommon("deleteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteSection;
