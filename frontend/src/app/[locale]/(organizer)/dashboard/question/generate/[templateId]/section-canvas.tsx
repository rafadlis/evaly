import CardQuestion from "@/components/shared/card/card-question";
import { ScrollArea } from "@/components/ui/scroll-area";

const SectionCanvas = () => {
  return (
    <ScrollArea className="h-[calc(100vh-57px)]">
      <div className="flex flex-col gap-4 pt-10 px-6 max-w-[800px] mx-auto">
        {Array.from({ length: 200 }).map((_, index) => (
          <div key={index}>
            <CardQuestion key={index} className="" />
            <div className="h-px w-full border-b border-dashed" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SectionCanvas;
