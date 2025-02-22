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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  CircleHelpIcon,
  Copy,
  PencilLineIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";

const CardQuestion = ({ className }: { className?: string }) => {
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
              <ArrowUp className="text-muted-foreground"/>
            </Button>
            <Button size={"icon-xs"} variant={"ghost"} rounded={false}>
              <ArrowDown  className="text-muted-foreground"/>
            </Button>
            <Separator orientation="vertical" className="mx-3"/>
            <Button size={"icon-xs"} variant={"ghost"} rounded={false}>
              <Copy  className="text-muted-foreground"/>
            </Button>
            <Button size={"icon-xs"} variant={"ghost"} rounded={false} className="ml-2">
              <Trash2Icon  className="text-muted-foreground"/>
            </Button>
          </div>
        </CardHeader>
        <Dialog>
          <DialogTrigger asChild>
            <CardContent className="group/question cursor-pointer">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consectetur fuga voluptates tot am ullam, tempora magni aliquam
                atque, incidunt cupiditate explicabo sed vero ipsum cum,
                possimus veniam accusamus! Sed, nam voluptas!
              </p>
              <div className="flex flex-row flex-wrap gap-3 mt-6 text-sm text-muted-foreground">
                <Button
                  rounded={false}
                  variant={"outline"}
                  size={"xs"}
                  className="px-3 w-max"
                >
                  a. Jawaban A
                </Button>
                <Button
                  rounded={false}
                  variant={"outline"}
                  size={"xs"}
                  className="px-3 w-max"
                >
                  b. Jawaban B
                </Button>
                <Button
                  rounded={false}
                  variant={"default"}
                  size={"xs"}
                  className="px-3 w-max"
                >
                  <CheckCircle2 /> c. Jawaban C
                </Button>
                <Button
                  rounded={false}
                  variant={"outline"}
                  size={"xs"}
                  className="px-3 w-max"
                >
                  d. Jawaban D
                </Button>
                <Button
                  rounded={false}
                  variant={"outline"}
                  size={"xs"}
                  className="px-3 w-max"
                >
                  e. Jawaban E
                </Button>
              </div>
              <div className="group-hover/question:visible invisible flex justify-end">
                <PencilLineIcon className="size-4" />
              </div>
            </CardContent>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
              <DialogDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste
                tempora temporibus sequi facere impedit tenetur vitae, sed est
                perspiciatis architecto ipsum reprehenderit laudantium nesciunt
                qui, deleniti voluptatum, maiores minus quibusdam!
              </DialogDescription>
            </DialogHeader>
            <div>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius,
              quod voluptate! Perferendis cumque quibusdam deleniti, laborum
              voluptatibus mollitia sed saepe reiciendis vel voluptatum dicta
              obcaecati natus, pariatur rem in eveniet?
            </div>
            <DialogFooter>
              <Button variant={"secondary"} size={"lg"}>
                Cancel
              </Button>
              <Button variant={"default"} size={"lg"}>
                <SaveIcon />
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default CardQuestion;
