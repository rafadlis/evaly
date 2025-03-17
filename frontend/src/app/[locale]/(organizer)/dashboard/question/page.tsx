"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Star,
  ArrowRight,
  FileText,
  Calendar,
  WandSparkles,
  Plus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/components/shared/progress-bar";
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useAllQuestionTemplate } from "@/query/organization/question/use-all-question-template";
import {
  QuestionTemplateWithQuestions,
  QuestionType,
} from "@evaly/backend/types/question";
import dayjs from "dayjs";
import { questionTypes } from "@/constants/question-type";

const Page = () => {
  return (
    <div className="container">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col mb-8">
          <h1 className="text-xl font-medium">Question</h1>
          <p className="text-muted-foreground">
            Create and manage your questions.
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
      const res = await $api.organization.question.template.create.post();

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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="owned" className="w-full">
        <div className="flex flex-row justify-between mb-4">
          <TabsList className="p-1 bg-muted/50">
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
          </TabsList>
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
          {dataQuestionTemplate && dataQuestionTemplate?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataQuestionTemplate?.map((template) => (
                <OwnedTemplateCard
                  key={template.id}
                  template={template as QuestionTemplateWithQuestions}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              message="No templates match your search"
              buttonText="Create New Template"
            />
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-0">
          <EmptyState
            message="No favorite templates yet"
            buttonText="Browse Templates"
            icon={<Star className="h-12 w-12 text-muted-foreground/50" />}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const OwnedTemplateCard = ({
  template,
}: {
  template: QuestionTemplateWithQuestions;
}) => {
  return (
    <Card
      className={cn(
        "overflow-hidden group border-border",
        "bg-card hover:bg-muted/20"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {template.title || "Untitled"}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {template.title}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            {0} questions
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {dayjs(template.createdAt).format("DD MMM YYYY")}
          </div>
        </div>

        {/* Question Highlights */}
        <div className="space-y-1.5">
          {template.questions?.map((question) => {
            const Icon = getQuestionTypeIcon(
              question.type || "multiple-choice"
            );
            return (
              <div
                key={question.id}
                className="flex items-center gap-1.5 text-xs"
              >
                <div className="flex-shrink-0 size-3 rounded-full bg-muted/50 flex items-center justify-center">
                  <Icon className="size-3" />
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
          {template.questions?.length && template.questions?.length > 2 && (
            <div className="text-xs text-muted-foreground/70 pl-5">
              +{template.questions.length - 2} more questions
            </div>
          )}
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
        <Button
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2"
        >
          <ArrowRight className="mr-2 h-3 w-3" /> Use
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper function to get question type icon
const getQuestionTypeIcon = (type: QuestionType) => {
  switch (type) {
    case "multiple-choice":
      return questionTypes["multiple-choice"].icon;
    case "yes-or-no":
      return questionTypes["yes-or-no"].icon;
    case "text-field":
      return questionTypes["text-field"].icon;
    default:
      return questionTypes["multiple-choice"].icon;
  }
};

const EmptyState = ({
  message,
  buttonText = "Browse Templates",
  icon,
}: {
  message: string;
  buttonText?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-lg border border-dashed">
      <div className="bg-background rounded-full p-4 mb-4">
        {icon || <Search className="h-12 w-12 text-muted-foreground/50" />}
      </div>
      <p className="text-muted-foreground mt-2 mb-1">{message}</p>
      <p className="text-xs text-muted-foreground/70 mb-4">
        Try adjusting your search or browse all templates
      </p>
      <Button variant="outline" className="mt-2 group">
        {buttonText}{" "}
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

export default Page;
