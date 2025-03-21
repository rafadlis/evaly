"use client";
import CardQuestion from "@/components/shared/card/card-question";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useOrganizerProfile } from "@/query/organization/profile/use-organizer-profile";
import { ArrowUp, Loader2, Paperclip, UserIcon, Wand2Icon } from "lucide-react";
import Image from "next/image";

const Page = () => {
  const { data } = useOrganizerProfile();

  const userProfile = data?.data?.user.image;

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      <ResizablePanel minSize={20} defaultSize={30} maxSize={50}>
        <ScrollArea className="h-[calc(100vh-220px)] flex flex-col">
          {Array.from({ length: 20 }).map((_, index) =>
            index % 2 === 0 ? (
              <UserMessage key={index} image={userProfile} />
            ) : (
              <AIMessage key={index} />
            )
          )}
        </ScrollArea>
        <div className="relative mb-2 mx-4 mt-2">
          <Textarea
            autoFocus
            placeholder="Add a follow up..."
            className={cn(
              "w-full h-[120px] overflow-clip  p-3 rounded-xl [&::placeholder]:whitespace-pre-wrap resize-none focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0 focus-visible:border-foreground/20 shadow-none transition-all duration-200"
            )}
          />
          <div className="absolute bottom-0 left-0 p-2 flex flex-row gap-2 items-center justify-end w-full">
            <div className="flex flex-row items-center justify-center gap-1">
              <Button size={"icon-sm"} variant={"ghost"} disabled>
                <Wand2Icon />
              </Button>
              <Button size={"icon-sm"} variant={"ghost"}>
                <Paperclip />
              </Button>
              <Button size={"icon-sm"} variant={"outline"}>
                {false ? (
                  <Loader2 className="size-4 stroke-3 text-muted-foreground" />
                ) : (
                  <ArrowUp className="size-4 stroke-3 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground w-full text-center">
          Evaly may make mistakes. Please use with discretion.
        </p>
      </ResizablePanel>
      <ResizableHandle className="border-dashed" />
      <ResizablePanel className="flex-1">
        <ScrollArea className="h-[calc(100vh-57px)]">
          <div className="flex flex-col gap-4 pt-10 px-6 max-w-[800px] mx-auto">
            {Array.from({ length: 200 }).map((_, index) => (
              <div key={index}>
                <CardQuestion
                  key={index}
                  className=""
                />
                <div className="h-px w-full border-b border-dashed" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

const UserMessage = ({ image }: { image: string | null | undefined }) => {
  return (
    <div className="flex items-start gap-3 p-4 hover:bg-secondary">
      {image ? (
        <Image
          src={image}
          alt="User"
          width={28}
          height={28}
          className="rounded-lg"
        />
      ) : (
        <div className="rounded-lg bg-muted-foreground/20 size-7 flex items-center justify-center">
          <UserIcon className="size-5" />
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe quam
          eveniet est vitae, corporis repellendus repudiandae aut, inventore in,
          commodi pariatur. Tempore nostrum nihil quis a aspernatur quisquam
          cumque facere!
        </p>
      </div>
    </div>
  );
};

const AIMessage = () => {
  return (
    <div className="flex items-start gap-3 p-4 hover:bg-secondary">
      <Image
        src={"/images/logo.svg"}
        alt="User"
        width={28}
        height={28}
        className="rounded-lg object-scale-down"
      />
      <div className="flex-1">
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe quam
          eveniet est vitae, corporis repellendus repudiandae aut, inventore in,
          commodi pariatur. Tempore nostrum nihil quis a aspernatur quisquam
          cumque facere!
        </p>
      </div>
    </div>
  );
};

export default Page;
