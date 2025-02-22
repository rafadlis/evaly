import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const Header = () => {
  return (
    <>
      <input
        className="outline-none text-4xl font-bold"
        placeholder="Test title"
      />

      <TabsList className="mb-6 mt-4">
        <TabsTrigger value="questions">Questions</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
    </>
  );
};

export default Header;
