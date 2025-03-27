"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Card,
  CardContent, CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search, FileText,
  Calendar,
  WandSparkles,
  Plus,
  Loader2,
  MinusIcon,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/components/shared/progress-bar";
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useAllQuestionTemplate } from "@/query/organization/question/use-all-question-template";
import dayjs from "dayjs";

const Page = () => {
  return (
    <div className="container dashboard-margin">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col mb-8">
          <h1 className="text-xl font-medium">Question Template</h1>
          <p className="text-muted-foreground">
            Create and manage your question templates.
          </p>
        </div>
        <div className="flex gap-2">
          <CreateQuestionTemplateButton />
          <Link href="/dashboard/question/generate">
            <Button>
              <WandSparkles /> Generate
            </Button>
          </Link>
        </div>
      </div>
      <QuestionTemplateSection />
    </div>
  );
};

const CreateQuestionTemplateButton = () => {
  const router = useRouter();
  const [transitionReady, startTransition] = useTransition();

  const { mutate: createQuestionTemplate, isPending: isLoading } = useMutation({
    mutationKey: ["create-question-template"],
    mutationFn: async () => {
      const res = await $api.organization.question.template.create.post({withInitialQuestion: true});

      if (!res.data) {
        toast.error("Failed to create question template");
        return;
      }

      startTransition(() => {
        router.push(`/dashboard/question/${res.data.id}`);
      });
    },
  });

  return (
    <Button
      variant={"outline-solid"}
      onClick={() => createQuestionTemplate()}
      disabled={transitionReady || isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Creating...</span>
        </>
      ) : transitionReady ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Redirecting...</span>
        </>
      ) : (
        <>
          <Plus /> Question template
        </>
      )}
    </Button>
  );
};

const QuestionTemplateSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: dataQuestionTemplate } = useAllQuestionTemplate();

  const filteredDataQuestionTemplate = useMemo(() => {
    if (!dataQuestionTemplate) return [];

    if (!searchQuery) return dataQuestionTemplate;

    return dataQuestionTemplate.filter((template) => {
      if (!template.title) return false;
      return template.title.toLowerCase().includes(searchQuery.toLowerCase()) || template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    });
  }, [dataQuestionTemplate, searchQuery]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="owned" className="w-full">
        <div className="flex flex-row justify-between mb-4">
          {/* <TabsList className="p-1 bg-muted/50">
            <TabsTrigger value="owned" className="transition-all duration-300">
              <FileText className="mr-2 h-4 w-4" />
              My Templates
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="transition-all duration-300"
            >
              <Star className="mr-2 h-4 w-4" />
              Favorites
            </TabsTrigger>
          </TabsList> */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Owned Templates Tab */}
        <TabsContent value="owned" className="mt-0">
          {filteredDataQuestionTemplate && filteredDataQuestionTemplate?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDataQuestionTemplate?.map((template) => (
                <OwnedTemplateCard
                  key={template.id}
                  template={template}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              message="No templates match your search"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const OwnedTemplateCard = ({
  template,
}: {
  template: {
    id: string;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    deletedAt: string | null;
    title: string | null;
    organizerId: string;
    tags: string[];
    isAiGenerated: boolean;
    questions: {
        id: string;
        question: string | null;
    }[];
};
}) => {
  return (
    <Link href={`/dashboard/question/${template.id}`}>
      <Card
        className={cn(
          "overflow-hidden group border-border h-full hover:shadow-2xl hover:shadow-black/5",
          "bg-card hover:bg-muted/20"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">
                {template.title || "Untitled"}
              </CardTitle>
              {/* <CardDescription className="text-xs mt-1">
                {template.title}
              </CardDescription> */}
            </div>
            {/* <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className="h-4 w-4" />
            </Button> */}
          </div>
        </CardHeader>
        <CardContent className="pb-3 space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (template as any).totalQuestions
              }{" "}
              questions
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {dayjs(template.createdAt).format("DD MMM YYYY")}
            </div>
          </div>

          {/* Question Highlights */}
          <div className="space-y-1.5">
            {template.questions?.map((question) => {
              return (
                <div
                  key={question.id}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <div className="flex-shrink-0 size-3 rounded-full bg-muted/50 flex items-center justify-center">
                    <MinusIcon className="size-3" />
                  </div>
                  <div
                    className="flex-1 truncate text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: question.question || "No preview available",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <div className="flex flex-wrap gap-1">
            {template.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

const EmptyState = ({
  message,
  icon,
}: {
  message: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-lg border border-dashed">
      <div className="bg-background rounded-full p-4">
        {icon || <BookOpen className="size-20 text-muted-foreground" />}
      </div>
      <p className="text-muted-foreground mt-2 mb-1">{message}</p>
      <p className="text-xs text-muted-foreground/70 mb-4">
        Try adjusting your search or browse all templates
      </p>
      <CreateQuestionTemplateButton />
    </div>
  );
};

export default Page;
