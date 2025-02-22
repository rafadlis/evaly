import { Button } from "@/components/ui/button";
import { PencilLine, PlusIcon } from "lucide-react";
import CardQuestion from "./card-question";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SectionSidebar from "./section-sidebar";

const Questions = () => {
  const questions = Array.from({ length: 50 }, (_, i) => i + 1);

  return (
    <div className="flex flex-row gap-4">
      <SectionSidebar />
      <Card className="flex-1 border border-dashed overflow-clip">
        <CardHeader>
          <h1 className="font-medium flex flex-row flex-wrap gap-2 items-start">Untitled Session 1 <Button size={"icon-xs"} variant={"ghost"}> <PencilLine /></Button></h1>
          <h2 className="text-muted-foreground text-sm mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            quas dicta voluptas neque libero velit ullam atque aspernatur! Porro
            tempora ipsam aperiam voluptates. Harum vitae perspiciatis rerum
            sapiente omnis eius.
          </h2>
        </CardHeader>
        <CardContent className="pt-0">
          {questions.map((item) => (
            <div key={item}>
              <CardQuestion />
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const Separator = () => {
  return (
    <div className="h-10 flex items-center justify-center group/separator relative">
      <Button
        size={"xs"}
        variant={"default"}
        className="absolute opacity-0 group-hover/separator:opacity-100"
      >
        <PlusIcon /> Add Question
      </Button>
      <div className="h-auto border-b border-border/50 border-dashed w-full group-hover/separator:border-solid group-hover/separator:border-border" />
    </div>
  );
};

export default Questions;
