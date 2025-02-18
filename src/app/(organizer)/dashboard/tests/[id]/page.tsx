"use client";

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, PencilLineIcon, SaveIcon } from "lucide-react";

const DetailTestPage = () => {
  const questions = Array.from({ length: 500 }, (_, i) => i + 1);

  return (
    <div className="container pt-14 min-h-dvh">
      <input
        className="outline-none text-4xl font-bold"
        placeholder="Test title"
      />

      <Tabs defaultValue="questions" className="mt-10">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="questions">
            {questions.map((item) => (
              <Dialog key={item}>
                <DialogTrigger asChild>
                  <div
                    key={item}
                    className="py-3 px-4 -mx-4 hover:bg-secondary/70 transition-all relative group/question rounded-md cursor-pointer"
                  >
                    <span className="absolute -left-8 top-3.5 size-7 flex items-center justify-center border rounded-full text-xs font-medium text-muted-foreground/80 leading-0">
                      {item}
                    </span>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur fuga voluptates totam ullam, tempora magni aliquam atque, incidunt cupiditate explicabo sed vero ipsum cum, possimus veniam accusamus! Sed, nam voluptas!
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
                    <div className="mt-4 group-hover/question:visible invisible flex justify-end">
                      <PencilLineIcon className="size-4" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Question</DialogTitle>
                    <DialogDescription>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Iste tempora temporibus sequi facere impedit tenetur
                      vitae, sed est perspiciatis architecto ipsum reprehenderit
                      laudantium nesciunt qui, deleniti voluptatum, maiores
                      minus quibusdam!
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Eius, quod voluptate! Perferendis cumque quibusdam deleniti,
                    laborum voluptatibus mollitia sed saepe reiciendis vel
                    voluptatum dicta obcaecati natus, pariatur rem in eveniet?
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
            ))}
        </TabsContent>
        <TabsContent value="settings"></TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailTestPage;
