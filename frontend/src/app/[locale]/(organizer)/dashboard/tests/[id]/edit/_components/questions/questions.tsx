import { Button } from "@/components/ui/button";
import { ListTreeIcon, ListXIcon, PlusIcon } from "lucide-react";
import CardQuestion from "../../../../../../../../../components/shared/card/card-question";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionSidebar from "./section-sidebar";
import { useEffect, useState } from "react";
import { useSelectedSection } from "../../_hooks/use-selected-section";
import DialogDeleteSection from "@/components/shared/dialog/dialog-delete-section";
import DialogEditSectionDuration from "@/components/shared/dialog/dialog-edit-section-duration";
import DialogEditSection from "@/components/shared/dialog/dialog-edit-section";
import DialogEditQuestion from "@/components/shared/dialog/dialog-edit-question";
import { cn } from "@/lib/utils";
import { Reorder } from "motion/react";
import DialogAddQuestion from "@/components/shared/dialog/dialog-add-question";
import { Question } from "@evaly/backend/types/question";
import { useAllQuestionByReferenceIdQuery } from "@/query/organization/question/use-all-question-by-reference-id.query";
import { useTestSectionByTestIdQuery } from "@/query/organization/test-section/use-test-section-by-test-id";
import { Skeleton } from "@/components/ui/skeleton";
import { useTestSectionByIdQuery } from "@/query/organization/test-section/use-test-section-by-id";

/**
 * Insert questions at the correct position based on their order
 * @param prevQuestions - The existing questions array
 * @param newQuestions - The new questions to insert
 * @returns The updated questions array with new questions inserted at the correct position
 */
const insertQuestionsAtCorrectPosition = (
  prevQuestions: Question[],
  newQuestions: Question[]
): Question[] => {
  if (newQuestions.length === 0) return prevQuestions;

  // Find the first question's order (which is the insertion point)
  const firstNewQuestionOrder = newQuestions[0].order;

  if (!firstNewQuestionOrder) {
    // If no order is defined, just append to the end (fallback)
    return [...prevQuestions, ...newQuestions];
  }

  // Find the index where we should insert the new questions
  // Order starts from 1, but array index starts from 0
  const insertIndex = prevQuestions.findIndex(
    (q) => q.order && q.order >= firstNewQuestionOrder
  );

  // Create a new array with updated questions
  let result;
  if (insertIndex === -1) {
    // If no matching order found, append to the end
    result = [...prevQuestions, ...newQuestions];
  } else {
    // Insert the new questions at the correct position
    result = [
      ...prevQuestions.slice(0, insertIndex),
      ...newQuestions,
      ...prevQuestions.slice(insertIndex),
    ];
  }

  // Update the order field to ensure it starts from 1 and is sequential
  return result.map((question, index) => ({
    ...question,
    order: index + 1,
  }));
};

/**
 * Update a question in the questions array
 * @param prevQuestions - The existing questions array
 * @param updatedQuestion - The updated question
 * @returns The updated questions array with the question updated, or the original array if the question is not found
 */
const updateQuestionInArray = (
  prevQuestions: Question[],
  updatedQuestion: Question
): Question[] => {
  const findIndex = prevQuestions.findIndex((q) => q.id === updatedQuestion.id);

  // If the question is found, update it
  if (findIndex >= 0) {
    return [
      ...prevQuestions.slice(0, findIndex),
      updatedQuestion,
      ...prevQuestions.slice(findIndex + 1),
    ];
  }

  // If the question is not found, return the original array
  return prevQuestions;
};

const Questions = () => {
  const [selectedSection, setSelectedSection] = useSelectedSection();
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const [addQuestionOnOrder, setAddQuestionOnOrder] = useState<number>();

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
    <div className="flex flex-row gap-8">
      <SectionSidebar />
      <Card className="border overflow-clip flex-1 h-max">
        <CardHeader
          className={cn(
            `bg-background z-10 pb-4 mb-6 transition-all duration-300 border-b border-dashed`
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
          <CardContent>
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
                            const filtered = prev.filter(
                              (q) => q.id !== data.id
                            );
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
                        "h-8 flex items-center justify-center group/separator relative",
                        index === localQuestions.length - 1 ? "mt-4" : ""
                      )}
                    >
                      <Button
                        size={"xxs"}
                        variant={"default"}
                        onClick={() => {
                          if (data.order) {
                            setAddQuestionOnOrder(data.order + 1);
                          } else {
                            setAddQuestionOnOrder(localQuestions.length + 1);
                          }
                        }}
                        className={cn(
                          "absolute opacity-50 lg:opacity-0 group-hover/separator:opacity-100",
                          index === localQuestions.length - 1
                            ? "lg:opacity-100"
                            : ""
                        )}
                      >
                        <PlusIcon /> Add Question
                      </Button>
                      <div className="h-auto border-b border-border/50 w-full group-hover/separator:border-foreground/20" />
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </CardContent>
        ) : (
          <CardContent>
            <EmptyQuestion
              onClickAddQuestion={() => {
                setAddQuestionOnOrder(localQuestions.length + 1);
              }}
            />
          </CardContent>
        )}
      </Card>

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

      <DialogAddQuestion
        order={addQuestionOnOrder}
        referenceId={dataSection?.id}
        referenceType="test-section"
        onClose={() => {
          setAddQuestionOnOrder(undefined);
        }}
        onSuccessCreateQuestion={(questions) => {
          setLocalQuestions((prev) =>
            insertQuestionsAtCorrectPosition(prev, questions)
          );
          setAddQuestionOnOrder(undefined);
          if (questions.length === 1) {
            setSelectedQuestion(questions[0]);
          }
          refetchSections();
        }}
      />
    </div>
  );
};

const EmptyQuestion = ({
  onClickAddQuestion,
}: {
  onClickAddQuestion?: () => void;
}) => {
  return (
    <div className="border rounded-lg flex flex-col justify-center items-center py-16  gap-4">
      <h1>No question found on this section</h1>
      <Button
        size={"sm"}
        variant={"outline"}
        onClick={onClickAddQuestion}
        className=""
      >
        <PlusIcon /> Add Question
      </Button>
    </div>
  );
};
export default Questions;
