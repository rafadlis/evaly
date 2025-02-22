import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, CircleIcon } from "lucide-react";

const Setting = () => {
  return (
    <div className="flex flex-col divide-y">
      <div className="flex flex-row gap-8 pb-8">
        <div className="w-xs">
          <h1 className="font-semibold mb-2">Type</h1>
          <Label>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </Label>
        </div>
        <div className="flex-1 flex flex-row flex-wrap gap-4">
          <Card className="w-2xs p-4 ring-1 ring-offset-4 cursor-pointer relative">
            <CheckCircle2 size={18} className="absolute top-2 right-2" />
            <h1 className="font-medium">Self-paced Test</h1>
            <Label>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
            </Label>
          </Card>

          <Card className="w-2xs p-4 cursor-pointer hover:ring-1 ring-offset-4 ring-foreground/50 transition-all relative">
            <CircleIcon
              size={18}
              className="absolute top-2 right-2 opacity-50"
            />
            <h1 className="font-medium">Live Test</h1>
            <Label>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
            </Label>
          </Card>
        </div>
      </div>

      <div className="flex flex-row gap-8 py-8">
        <div className="w-xs">
          <h1 className="font-semibold mb-2">Participants</h1>
          <Label>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </Label>
        </div>
        <div className="flex-1">
          <Input placeholder="Add Participants" className="max-w-xs" />
        </div>
      </div>

      <div className="flex flex-row gap-8 py-8">
        <div className="w-xs">
          <h1 className="font-semibold mb-2">Description</h1>
          <Label>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </Label>
        </div>
        <div className="flex-1">
          <Textarea
            className="min-h-40"
            placeholder="Type test's description here...."
          />
        </div>
      </div>
    </div>
  );
};

export default Setting;
