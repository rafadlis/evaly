import QuestionTypeSelection from "@/components/shared/question-type-selection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  CircleHelpIcon,
  Edit,
  GripVertical,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

const CardQuestion = ({
  className,
  hideOptions = false,
}: {
  className?: string;
  hideOptions?: boolean;
}) => {
  return (
    <div>
      <Card
        className={cn(
          "transition-all hover:shadow-lg shadow-black/5",
          className
        )}
      >
        <CardHeader className="border-b py-3 flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3">
            <Button variant={"secondary"} size={"xs"} rounded={true}>
              <CircleHelpIcon />
              Question 1
            </Button>
            <QuestionTypeSelection value="multiple-choice" />
          </div>
          <div className="flex flex-row h-5 justify-end items-center">
            <Button size={"icon-xs"} variant={"ghost"} rounded={false}>
              <ArrowUp className="text-muted-foreground" />
            </Button>
            <Button size={"icon-xs"} variant={"ghost"} rounded={false}>
              <ArrowDown className="text-muted-foreground" />
            </Button>
            <Separator orientation="vertical" className="mx-3" />
            <DialogEditQuestion />
            <Button
              size={"icon-xs"}
              variant={"ghost"}
              rounded={false}
              className="ml-2"
            >
              <Trash2Icon className="text-muted-foreground" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Consectetur fuga voluptates tot am ullam, tempora magni aliquam
            atque, incidunt cupiditate explicabo sed vero ipsum cum, possimus
            veniam accusamus! Sed, nam voluptas!
          </p>
          {!hideOptions ? (
            <div className="flex flex-col gap-4 mt-6 text-sm text-muted-foreground">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-row flex-wrap items-start gap-3"
                >
                  <Button rounded={false} size={"icon-xs"} variant={"outline"}>
                    {i + 1}
                  </Button>
                  <span className="flex-1 mt-0.5">Option {i + 1}</span>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

const DialogEditQuestion = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"icon-xs"} variant={"ghost"} rounded={false}>
          <Edit className="text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:min-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-start">
            <span>Edit Question</span>
            <QuestionTypeSelection />
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div>
          <Textarea
            value={
              "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit alias illo, at tempore laboriosam veritatis pariatur necessitatibus recusandae odit nesciunt, beatae id minima dolorem maiores quos voluptatum nobis quas. Obcaecati."
            }
            onChange={() => {}}
          />
          <Separator className="my-6" />
          <div className="flex flex-col gap-4 mt-2 text-sm">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-row items-center gap-1">
                <Button rounded={false} variant={"ghost"} size={"icon-sm"}>
                  <GripVertical className="text-muted-foreground" />
                </Button>
                <div className="flex-1 relative flex flex-row items-center">
                  <Button
                    size={"icon-xxs"}
                    className="absolute left-1.5"
                    variant={i == 2 ? "default" : "secondary"}
                    rounded={false}
                  >
                    A
                  </Button>
                  <Input
                    placeholder={`Type options ${i + 1}`}
                    className="pl-10"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            variant={"secondary"}
          >
            Back
          </Button>
          <Button>
            <SaveIcon /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CardQuestion;
