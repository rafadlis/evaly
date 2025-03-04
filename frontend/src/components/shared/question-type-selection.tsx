import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { questionTypes } from "@/constants/question-type";
import { QuestionType } from "@evaly/backend/types";

const QuestionTypeSelection = ({
  value,
  onValueChange,
  size = "xs",
  variant = "outline",
}: {
  value?: QuestionType | null
  onValueChange?: (value: QuestionType) => void;
  size?: React.ComponentProps<typeof Button>["size"];
  variant?: React.ComponentProps<typeof Button>["variant"];
}) => {
  // Get the current selected question type or default to "multiple-choice"
  const selectedType = value ? questionTypes[value] : questionTypes["multiple-choice"];
  const SelectedIcon = selectedType.icon;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={size} rounded={true} variant={variant}>
          <SelectedIcon size={16} className="mr-1" /> 
          {selectedType.label} 
          <ChevronDownIcon className="ml-1" size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px] p-2">
        <Label className="px-2 mb-2 block">Question Type</Label>
          <div className="flex flex-col gap-1">
            {Object.values(questionTypes).map((type) => {
              const TypeIcon = type.icon;
              if (type.isHidden) return null;
              return (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onValueChange?.(type.value as QuestionType);
                  }}
                  rounded={false}
                  size={"sm"}
                  key={type.value}
                  className="w-full justify-start gap-2"
                  variant={value === type.value ? "default" : "ghost"}
                >
                  <TypeIcon size={16} />
                  {type.label}
                </Button>
              );
            })}
          </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuestionTypeSelection;
