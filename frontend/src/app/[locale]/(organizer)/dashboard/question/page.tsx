"use client";

import { useState } from "react";
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
  FileText, Calendar,
  WandSparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/components/shared/progress-bar";

// Custom styles for animations
const fadeInAnimation = "transition-all duration-500 opacity-0 translate-y-4";
const fadeInVisible = "opacity-100 translate-y-0";

// Dummy data for owned templates
const ownedTemplates = [
  {
    id: "template-1",
    title: "Weekly Assessment",
    description:
      "Standard weekly assessment with multiple choice and text questions",
    questionCount: 15,
    lastUsed: "2 days ago",
    tags: ["Education", "Weekly"],
    questions: [
      {
        id: "q1",
        text: "What is the capital of France?",
        type: "multiple-choice",
      },
      {
        id: "q2",
        text: "Explain the water cycle in your own words.",
        type: "text-field",
      },
      { id: "q3", text: "Is the Earth flat?", type: "yes-or-no" },
    ],
  },
  {
    id: "template-2",
    title: "Employee Onboarding",
    description: "New employee knowledge assessment",
    questionCount: 10,
    lastUsed: "1 week ago",
    tags: ["HR", "Onboarding"],
    questions: [
      {
        id: "q1",
        text: "Have you read the company handbook?",
        type: "yes-or-no",
      },
      {
        id: "q2",
        text: "What department do you work in?",
        type: "multiple-choice",
      },
      {
        id: "q3",
        text: "Describe your previous work experience.",
        type: "text-field",
      },
    ],
  },
  {
    id: "template-3",
    title: "Customer Satisfaction",
    description: "Survey for customer feedback and satisfaction rating",
    questionCount: 8,
    lastUsed: "3 days ago",
    tags: ["Customer", "Feedback"],
    questions: [
      {
        id: "q1",
        text: "How would you rate our service?",
        type: "multiple-choice",
      },
      {
        id: "q2",
        text: "Would you recommend us to others?",
        type: "yes-or-no",
      },
      {
        id: "q3",
        text: "What improvements would you suggest?",
        type: "text-field",
      },
    ],
  },
];

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
          <Link href="/dashboard/question/create">
            <Button>
              <WandSparkles /> Create question
            </Button>
          </Link>
        </div>
      </div>
      <QuestionTemplateSection />
    </div>
  );
};

const QuestionTemplateSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("owned");

  // Filter owned templates based on search
  const filteredOwnedTemplates = ownedTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="owned"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
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
          {filteredOwnedTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOwnedTemplates.map((template, index) => (
                <OwnedTemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                  isActive={activeTab === "owned"}
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
  index,
  isActive,
}: {
  template: (typeof ownedTemplates)[0];
  index: number;
  isActive: boolean;
}) => {
  const delay = (index % 9) * 0.05; // Stagger animation based on index

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-500 hover:shadow-md group border-border",
        "bg-card hover:bg-muted/20",
        fadeInAnimation,
        isActive && fadeInVisible
      )}
      style={{
        transitionDelay: `${delay}s`,
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{template.title}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {template.description}
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
            {template.questionCount} questions
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {template.lastUsed}
          </div>
        </div>

        {/* Question Highlights */}
        <div className="space-y-1.5">
          {template.questions.slice(0, 2).map((question) => (
            <div
              key={question.id}
              className="flex items-center gap-1.5 text-xs"
            >
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-muted/50 flex items-center justify-center">
                {getQuestionTypeIcon(question.type)}
              </div>
              <div className="flex-1 truncate text-muted-foreground">
                {question.text}
              </div>
            </div>
          ))}
          {template.questions.length > 2 && (
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
const getQuestionTypeIcon = (type: string) => {
  switch (type) {
    case "multiple-choice":
      return <div className="w-2 h-2 rounded-full bg-primary" />;
    case "yes-or-no":
      return <div className="w-2.5 h-1.5 bg-primary rounded-sm" />;
    case "text-field":
      return <div className="w-2.5 h-2 border-b border-primary" />;
    default:
      return <div className="w-2 h-2 rounded-sm bg-primary" />;
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
