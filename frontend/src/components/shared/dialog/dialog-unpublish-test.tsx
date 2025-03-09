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
import { Test } from "@evaly/backend/types/test";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DialogUnpublishTest = ({ testId, isUnpublished }: { testId: string, isUnpublished?: (newTest: Test)=> void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: unpublishTest, isPending: isUnpublishing } = useMutation({
    mutationFn: async () => {
      const res = await $api.organization.test({ id: testId }).unpublish.put();
      if (res.error?.value) {
        return toast.error(res.error.value.toString());
      }

      if (res.data?.data) {
        isUnpublished?.(res.data?.data);
      }

      toast.success("Test unpublished successfully");
      setIsOpen(false);
      
      return res.data;
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} disabled={isUnpublishing}>
          {isUnpublishing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Unpublish Test"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unpublish Test</DialogTitle>
          <DialogDescription>
            Are you sure you want to unpublish this test? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={() => {
              unpublishTest();
            }}
            disabled={isUnpublishing}
          >
            {isUnpublishing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Unpublish Test"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUnpublishTest;
