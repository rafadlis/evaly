import { Button } from "@/components/ui/button";
import { ListTreeIcon, ListXIcon, PlusIcon } from "lucide-react";
import CardQuestion from "../../../../../../../../../components/shared/card/card-question";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SectionSidebar from "./section-sidebar";
import { useEffect, useState } from "react";
import { useSelectedSection } from "../../_hooks/use-selected-section";
import DialogDeleteSection from "@/components/shared/dialog/dialog-delete-section";
import DialogEditSectionDuration from "@/components/shared/dialog/dialog-edit-section-duration";
import DialogEditSection from "@/components/shared/dialog/dialog-edit-section";
import DialogEditQuestion from "@/components/shared/dialog/dialog-edit-question";
import {
  cn,
  insertQuestionsAtCorrectPosition,
  updateQuestionInArray,
} from "@/lib/utils";
import { Reorder } from "motion/react";
import DialogAddQuestion from "@/components/shared/dialog/dialog-add-question";
import { Question } from "@evaly/backend/types/question";
import { useAllQuestionByReferenceIdQuery } from "@/query/organization/question/use-all-question-by-reference-id.query";
import { useTestSectionByTestIdQuery } from "@/query/organization/test-section/use-test-section-by-test-id";
import { Skeleton } from "@/components/ui/skeleton";
import { useTestSectionByIdQuery } from "@/query/organization/test-section/use-test-section-by-id";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const Questions = () => {
  const [selectedSection, setSelectedSection] = useSelectedSection();
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const { id: testId } = useParams();

  const {
    data: dataSection,
    isRefetching: isRefetchingSection,
    isPending: isPendingSection,
    refetch: refetchSection,
  } = useTestSectionByIdQuery({ id: selectedSection as string });

  const {
    refetch: refetchSections,
    data: dataSections,
    isRefetching: isRefetchingSections,
    isPending: isPendingSections,
  } = useTestSectionByTestIdQuery({
    testId: dataSection?.testId as string,
  });

  const {
    data: dataQuestions,
    isRefetching: isRefetchingQuestions,
    isPending: isPendingQuestions,
  } = useAllQuestionByReferenceIdQuery({
    referenceId: selectedSection as string,
  });

  const [localQuestions, setLocalQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (dataQuestions) {
      setLocalQuestions(dataQuestions);
    }
  }, [dataQuestions]);

  const [hideOptions, setHideOptions] = useState(false);

  const onSuccessDeleteSection = async () => {
    const response = await refetchSections();
    const updatedDataSections = response.data;
    // Find the next available section to select after deletion
    if (updatedDataSections && updatedDataSections.length > 0) {
      // Set the first available section as selected
      setSelectedSection(updatedDataSections[0].id);
    } else {
      // If no sections left, clear the selection
      setSelectedSection(null);
    }
  };

  const onHandleChangeOrder = (
    changedQuestionOrders: {
      questionId: string;
      order: number;
    }[]
  ) => {
    // Update the local questions state to reflect the order changes immediately
    setLocalQuestions((prevQuestions) => {
      // Create a copy of the previous questions
      const updatedQuestions = [...prevQuestions];

      // Update the order of each changed question
      changedQuestionOrders.forEach(({ questionId, order }) => {
        const questionIndex = updatedQuestions.findIndex(
          (q) => q.id === questionId
        );
        if (questionIndex !== -1) {
          updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            order,
          };
        }
      });

      // Sort the questions by their new order
      return updatedQuestions.sort((a, b) => a.order - b.order);
    });
  };

  return (
    <div className="flex flex-row">
      <div className="flex-1 pr-6">
        <CardHeader
          className={cn(
            `z-10 transition-all duration-300 border-b px-0 border-dashed mb-4`
          )}
        >
          <div className="flex flex-row items-start">
            <CardTitle className="flex-1 flex flex-row flex-wrap items-center gap-2">
              {dataSection ? (
                <>
                  {dataSection?.order}.{" "}
                  {dataSection?.title || "Untitled section"}
                  <DialogEditSection sectionId={selectedSection as string} />
                </>
              ) : (
                <Skeleton className="w-1/2 h-5" />
              )}
            </CardTitle>
            <div className="flex flex-row gap-1">
              <Button
                size={"xs"}
                variant={hideOptions ? "default" : "ghost"}
                onClick={() => {
                  setHideOptions((prev) => !prev);
                }}
              >
                {hideOptions ? (
                  <>
                    <ListTreeIcon />
                    Show Options
                  </>
                ) : (
                  <>
                    <ListXIcon />
                    Hide Options
                  </>
                )}
              </Button>

              <DialogEditSectionDuration
                sectionId={selectedSection as string}
                onSuccess={() => {
                  refetchSections();
                  refetchSection();
                }}
                disabled={isPendingSection || isRefetchingSection}
              />
              <DialogDeleteSection
                isLastSection={dataSections?.length === 1}
                disabled={
                  isRefetchingQuestions ||
                  isRefetchingSections ||
                  isPendingQuestions ||
                  isPendingSections
                }
                sectionId={selectedSection as string}
                onSuccess={() => {
                  onSuccessDeleteSection();
                }}
              />
            </div>
          </div>
          <CardDescription className="max-w-md flex flex-row items-end gap-2">
            {dataSection?.description || "No section description"}
          </CardDescription>
        </CardHeader>
        {localQuestions?.length ? (
          <Reorder.Group
            onReorder={() => {}}
            values={localQuestions}
            as="div"
            className={cn(
              "w-full",
              isRefetchingQuestions ? "animate-pulse" : ""
            )}
          >
            {localQuestions.map((data, index) => {
              return (
                <Reorder.Item
                  value={data}
                  as="div"
                  key={data.id}
                  data-index={index}
                  dragListener={false}
                >
                  <CardQuestion
                    onChangeOrder={onHandleChangeOrder}
                    hideOptions={hideOptions}
                    data={data}
                    onClickEdit={() => setSelectedQuestion(data)}
                    className={cn(
                      isRefetchingQuestions ? "cursor-progress" : ""
                    )}
                    onDeleteSuccess={() => {
                      refetchSections();
                      const findIndex = localQuestions.findIndex(
                        (q) => q.id === data.id
                      );
                      if (findIndex >= 0) {
                        // Update the order of questions after deletion
                        setLocalQuestions((prev) => {
                          const filtered = prev.filter((q) => q.id !== data.id);
                          return filtered.map((q, index) => ({
                            ...q,
                            order:
                              q.order && data.order && q.order > data.order
                                ? q.order - 1
                                : index + 1,
                          }));
                        });
                      }
                    }}
                    previousQuestionId={localQuestions[index - 1]?.id}
                    nextQuestionId={localQuestions[index + 1]?.id}
                  />
                  <div
                    className={cn(
                      "h-12 flex items-center justify-center relative group/separator",
                      index === localQuestions.length - 1 ? "mb-4" : ""
                    )}
                  >
                    <DialogAddQuestion
                      testId={testId as string}
                      referenceId={selectedSection as string}
                      order={data.order + 1}
                      onSuccessCreateQuestion={(questions) => {
                        setLocalQuestions((prev) =>
                          insertQuestionsAtCorrectPosition(prev, questions)
                        );
                        if (questions.length === 1) {
                          setSelectedQuestion(questions[0]);
                        } else {
                          toast.success("Questions added successfully");
                        }
                        refetchSections();
                      }}
                      triggerButton={
                        <Button
                          size={"xxs"}
                          variant={"outline"}
                          className={cn(
                            "absolute opacity-50 lg:opacity-0 lg:group-hover/separator:opacity-100",
                            index === localQuestions.length - 1
                              ? "lg:opacity-100"
                              : ""
                          )}
                        >
                          <PlusIcon /> Add Question
                        </Button>
                      }
                    />
                    <div className="h-auto border-b border-border border-dashed w-full group-hover/separator:border-foreground/20" />
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        ) : (
          <div className="flex flex-col p-6 gap-4 bg-secondary">
            <h1>No question found on this section</h1>
            <DialogAddQuestion
              testId={testId as string}
              referenceId={selectedSection as string}
              order={localQuestions.length + 1}
              onSuccessCreateQuestion={(questions) => {
                setLocalQuestions((prev) =>
                  insertQuestionsAtCorrectPosition(prev, questions)
                );
                if (questions.length === 1) {
                  setSelectedQuestion(questions[0]);
                } else {
                  toast.success("Questions added successfully");
                }
                refetchSections();
              }}
            />
          </div>
        )}
      </div>
      <SectionSidebar className="border-l pl-4 border-dashed min-h-screen" />
      <DialogEditQuestion
        defaultValue={selectedQuestion}
        onSuccess={(question) => {
          setSelectedQuestion(question);
          setLocalQuestions((prev) => updateQuestionInArray(prev, question));
        }}
        onClose={() => {
          setSelectedQuestion(undefined);
        }}
      />
    </div>
  );
};

export default Questions;
