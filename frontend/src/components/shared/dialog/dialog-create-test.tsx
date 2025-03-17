"use client"
import { ArrowRight, CheckCircle, Loader2, LockIcon, PlusIcon } from "lucide-react";
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
import { useRouter } from "@/i18n/navigation";
import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";

const DialogCreateTest = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPendingRoute, startTransition] = useTransition();

  const { mutate, isPending: isPendingCreate } = useMutation({
    mutationKey: ["create-test"],
    mutationFn: async ({ type }: { type: "self-paced" | "live" }) => {
      const res = await $api.organization.test.create.post({type})
      if (res.error?.value){
        throw new Error(res.error.value as unknown as string)
      }

      return res.data
    },
    onSuccess(data) {
      if (!data) {
        throw new Error("Failed to create test. Please try again later.");
      }

      startTransition(() => {
        router.push(`/dashboard/tests/${data?.id}/edit`);
      });
    },
  })

  const onCreateNewTest = () => {
    mutate({ type: "self-paced" });
  };

  const onBack = () => setOpen(false);
  const isPending = isPendingRoute || isPendingCreate;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <PlusIcon />
          Create Test
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Test</DialogTitle>
          <DialogDescription>
            Select the type of test you want to create:
          </DialogDescription>
        </DialogHeader>
        <Card className="p-4 cursor-pointer ring-2 ring-offset-2">
          <div className="flex flex-row items-start justify-between">
            <h1>Self-Paced Test</h1>
              <CheckCircle size={20}/>
          </div>
          <Label className="text-sm">
            Allow candidates to take the test at their own pace. Ideal for
            screening and pre-assessment purposes.
          </Label>
        </Card>
        <Card className="p-4 opacity-80">
          <div className="flex flex-row items-start justify-between">
            <h1>Live Test</h1>
            <Badge variant={"secondary"}>
              <LockIcon /> Coming Soon
            </Badge>
          </div>
          <Label className="text-sm">
            Schedule a synchronized test for all candidates. Ideal for
            final assessments and examinations.
          </Label>
        </Card>
        <DialogFooter>
          <Button variant={"secondary"} onClick={onBack}>
            Back
          </Button>
          <Button
            variant={"default"}
            onClick={onCreateNewTest}
            disabled={isPending}
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
            Continue
            {!isPending ? <ArrowRight size={16} /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateTest;
