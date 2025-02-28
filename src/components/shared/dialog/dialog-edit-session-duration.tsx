import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ClockIcon, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const DialogEditSessionDuration = ({
  className,
  disabled = false,
  value = 0,
  onValueChange,
  onSuccess,
}: {
  className?: string;
  disabled?: boolean;
  sessionId: string;
  onSuccess?: () => void;
  value?: number; // in minutes
  onValueChange?: (value: number) => Promise<void>; // in minutes
}) => {
  const [open, setOpen] = useState(false);
  
  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true);
  
  // Use a ref to store the most recently saved value
  const savedValueRef = useRef(value);
  
  // State for the displayed value (what's shown in the button)
  const [displayValue, setDisplayValue] = useState(value);
  
  // States for the form inputs
  const [hours, setHours] = useState(Math.floor(displayValue / 60));
  const [minutes, setMinutes] = useState(displayValue % 60);

  // Update the display value when the external value changes
  // But only on first render or if it's different from our saved value
  useEffect(() => {
    if (isFirstRender.current || value !== savedValueRef.current) {
      setDisplayValue(value);
      setHours(Math.floor(value / 60));
      setMinutes(value % 60);
      savedValueRef.current = value;
      isFirstRender.current = false;
    }
  }, [value]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTotalMinutes = hours * 60 + minutes;
    
    // Update our display value and saved reference immediately
    setDisplayValue(newTotalMinutes);
    savedValueRef.current = newTotalMinutes;
    
    // Call the parent's handlers
    await onValueChange?.(newTotalMinutes);
    onSuccess?.();
    
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          size={"xs"}
          variant={"outline"}
          className={cn(className)}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ClockIcon /> {hours > 0 ? `${hours}h ` : ""}
          {minutes}m
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max">
        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
          <div>
            <Label>Hours</Label>
            <Input
              type="number"
              className="w-20"
              value={hours}
              min={0}
              max={23}
              onChange={(e) => setHours(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Minutes</Label>
            <Input
              type="number"
              className="w-20"
              value={minutes}
              min={0}
              max={59}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
          </div>
          <Button
            disabled={disabled}
            type="submit"
            className="w-full col-span-2"
          >
            {disabled ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default DialogEditSessionDuration;
