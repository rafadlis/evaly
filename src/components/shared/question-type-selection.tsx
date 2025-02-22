import { ChevronDownIcon, CircleCheck } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";

const QuestionTypeSelection = ({
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const questionTypes = [
    {
      value: "yes-or-no",
      label: "Yes/No",
    },
    {
      value: "multiple-choice",
      label: "Multiple Choice",
    },
    {
      value: "multiple-selection",
      label: "Multiple Selection",
    },
    {
      value: "point-based",
      label: "Point Based",
    },
    {
      value: "text-field",
      label: "Text Field",
    },
    {
      value: "file-upload",
      label: "File Upload",
    },
  ];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"xs"} rounded={true} variant={"outline"}>
          <CircleCheck /> Multiple Choice <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[210px] pt-2">
        <Label>Question Type</Label>
        <div className="flex flex-col gap-2 mt-2 -mx-2.5">
          {questionTypes.map((e) => (
            <Button
              onClick={() => {
                onValueChange?.(e.value);
              }}
              rounded={false}
              size={"sm"}
              key={e.value}
              className="w-full justify-start"
              variant={value === e.value ? "default" : "ghost"}
            >
              {e.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuestionTypeSelection;
