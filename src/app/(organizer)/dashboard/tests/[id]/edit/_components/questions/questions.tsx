import { Button } from "@/components/ui/button";
import {
  ClockIcon,
  ListTreeIcon,
  ListXIcon,
  PencilLine,
  PlusIcon,
} from "lucide-react";
import CardQuestion from "./card-question";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionSidebar from "./section-sidebar";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Questions = () => {
  const questions = Array.from({ length: 10000 }, (_, i) => i + 1);
  const [hideOptions, setHideOptions] = useState(false);

  const virtualizer = useWindowVirtualizer({
    count: questions.length,
    estimateSize: () => 500,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="flex flex-row gap-6">
      <SectionSidebar />
      <Card className="flex-1 border border-dashed overflow-clip">
        <CardHeader className="sticky top-0 bg-background z-10 pb-4">
          <div className="flex flex-row items-start">
            <CardTitle className="flex-1 flex flex-row flex-wrap items-center gap-2">
              Untitled Session 2
              <DialogChangeSessionDetail />
            </CardTitle>
            <div className="flex flex-row gap-2">
              <Button
                size={"sm"}
                variant={hideOptions ? "default" : "outline"}
                onClick={() => {
                  setHideOptions((prev) => !prev);
                }}
              >
                {hideOptions ? (
                  <>
                    <ListTreeIcon />
                    Show Options
                  </>
                ) : (
                  <>
                    <ListXIcon />
                    Hide Options
                  </>
                )}
              </Button>
              <Button size={"sm"} variant={"outline"}>
                <ClockIcon /> 40min
              </Button>
            </div>
          </div>
          <CardDescription className="max-w-md flex flex-row items-end gap-2">
            <span className="flex-1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
              quas dicta voluptas neque libero velit ullam atque aspernatur!
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 overflow-auto">
          <div
            className="relative"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            <div
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
              }}
            >
              {virtualItems.map(({ key, index }) => {
                // const item = questions[index]
                return (
                  <div
                    key={key}
                    ref={virtualizer.measureElement}
                    data-index={index}
                  >
                    <CardQuestion hideOptions={hideOptions} />
                    <Separator />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Separator = () => {
  return (
    <div className="h-8 flex items-center justify-center group/separator relative">
      <Button
        size={"xxs"}
        variant={"default"}
        className="absolute opacity-0 group-hover/separator:opacity-100"
      >
        <PlusIcon /> Add Question
      </Button>
      <div className="h-auto border-b border-border/50 border-dashed w-full group-hover/separator:border-solid group-hover/separator:border-border" />
    </div>
  );
};

const DialogChangeSessionDetail = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"icon-xs"} variant={"ghost"} rounded={false}>
          <PencilLine />
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-2">
        <DialogHeader>
          <DialogTitle>Edit Session&apos;s</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label>Title</Label>
          <Input placeholder="Type session's title here..." />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Duration</Label>
          <div className="flex flex-row flex-wrap gap-2">
            <Button rounded={false} size={"xs"} variant={"outline"}>
              5m
            </Button>
            <Button rounded={false} size={"xs"}>
              10m
            </Button>
            <Button rounded={false} size={"xs"} variant={"outline"}>
              25m
            </Button>
            <Button rounded={false} size={"xs"} variant={"outline"}>
              30m
            </Button>
            <Button rounded={false} size={"xs"} variant={"outline"}>
              Custom
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Description (Optional)</Label>
          <Textarea placeholder="Type session's description here..." />
        </div>
        <DialogFooter className="mt-0">
          <Button
            onClick={() => {
              setOpen(false);
            }}
            variant={"secondary"}
          >
            Back
          </Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Questions;
