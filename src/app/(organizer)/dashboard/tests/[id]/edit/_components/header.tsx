import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket } from "lucide-react";

const Header = () => {
  return (
    <>
      <input
        className="outline-none text-4xl font-bold"
        placeholder="Test title"
      />

      <div className="mb-6 mt-4 flex flex-row justify-between items-center">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <div className="flex flex-row items-center gap-4">
          <Button><Rocket /> Publish</Button>
        </div>
      </div>
    </>
  );
};

export default Header;
