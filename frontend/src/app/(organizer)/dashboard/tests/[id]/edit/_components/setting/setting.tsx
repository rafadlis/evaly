import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useTestByIdQuery } from "@/query/organization/test/use-test-by-id.query";
import { CheckCircle2, LockIcon } from "lucide-react";
import { useParams } from "next/navigation";

const Setting = () => {
  const { id: testId } = useParams();
  const { isPending } = useTestByIdQuery({
    id: testId?.toString() || "",
  });

  if (isPending) {
    return <Skeleton className="w-full h-[80dvh]" />;
  }

  return (
    <>
      <div className="flex flex-col divide-y">
        <div className="flex flex-row gap-10 pb-8">
          <div className="w-2xs">
            <h1 className="font-semibold">Type</h1>
            <Label>
              This determines how candidates will interact with your assessment.
            </Label>
          </div>
          <div className="flex-1 flex flex-row flex-wrap gap-4">
            <Card className="w-2xs p-3 border-foreground cursor-pointer relative">
              <CheckCircle2 size={18} className="absolute top-2 right-2" />
              <h1 className="font-medium mb-2">Self-paced Test</h1>
              <Label>
                Allow candidates to take the test at their own pace. Ideal for
                screening and pre-assessment purposes.
              </Label>
            </Card>

            <Card className="w-2xs p-3 opacity-70 ring-offset-4 ring-foreground/50 transition-all relative">
              <LockIcon
                size={18}
                className="absolute top-2 right-2 opacity-50"
              />
              <h1 className="font-medium mb-2">Live Test</h1>
              <Label>
                Schedule a synchronized test for all candidates. Ideal for final
                assessments and examinations.
              </Label>
            </Card>
          </div>
        </div>

        <div className="flex flex-row gap-10 py-8">
          <div className="w-2xs">
            <h1 className="font-semibold">Access</h1>
            <Label>
              Control who can access your test. Public tests are visible to
              anyone.
            </Label>
          </div>
          <Tabs className="flex-1" defaultValue="public">
            <TabsList>
              <TabsTrigger value="public">Public</TabsTrigger>
              <TabsTrigger value="invite-only">Invite Only</TabsTrigger>
            </TabsList>
            <TabsContent value="public">
              <Label className="text-sm">
                Anyone with the link can access and take this test. The test
                will be publicly listed on your profile.
              </Label>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-row gap-10 py-8">
          <div className="w-2xs">
            <h1 className="font-semibold">Description</h1>
            <Label>
              Add a description to provide more information about your test to
              candidates.
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

      <div className="fixed w-full bottom-0 left-0 flex flex-row items-center justify-end gap-4 px-8 py-4 border-t bg-background">
        <Button>Save changes</Button>
      </div>
    </>
  );
};

export default Setting;
