import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Command } from "lucide-react";

const Page = () => {
  return (
    <div className="container flex-1 flex-col flex items-center justify-center">
      <div className="relative max-w-xl w-full">
        <Textarea
          placeholder="Enter your prompt here..."
          className="w-full min-h-[140px] text-base p-4 rounded-xl [&::placeholder]:whitespace-pre-wrap resize-none focus-visible:ring-0 focus-visible:outline-0"
        />
        <div className="absolute bottom-0 left-0 p-2 flex flex-row gap-2 items-center justify-between w-full">
          <div className="flex flex-row gap-2 items-center justify-center">
            <Button size={"xs"} variant={"outline"}>
              Total: 10
            </Button>
          </div>
          <div>
            <Button size={"xs"}>
              <Command /> + Enter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
