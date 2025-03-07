import { Button } from "@/components/ui/button";
import { ListTreeIcon, ListXIcon, PlusIcon } from "lucide-react";
import CardQuestion from "./card-question";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionSidebar from "./section-sidebar";
import { useEffect, useState, useRef } from "react";
import { useSelectedSession } from "../../_hooks/use-selected-session";
import DialogDeleteSession from "@/components/shared/dialog/dialog-delete-session";
import DialogEditSessionDuration from "@/components/shared/dialog/dialog-edit-session-duration";
import DialogEditSession from "@/components/shared/dialog/dialog-edit-session";
import DialogEditQuestion from "@/components/shared/dialog/dialog-edit-question";
import { cn } from "@/lib/utils";
import { Reorder } from "motion/react";
import DialogAddQuestion from "@/components/shared/dialog/dialog-add-question";
import { Question } from "@evaly/backend/types/question";
import { useQuery } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { useAllQuestionByReferenceIdQuery } from "@/query/organization/question/use-all-question-by-reference-id.query";
import { useSessionByTestIdQuery } from "@/query/organization/session/use-session-by-test-id";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [selectedSession, setSelectedSession] = useSelectedSession();
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const [addQuestionOnOrder, setAddQuestionOnOrder] = useState<number>();
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const {
    data: dataSession,
    isRefetching: isRefetchingSession,
    isPending: isPendingSession,
    refetch: refetchSession,
  } = useQuery({
    queryKey: ["session", selectedSession],
    queryFn: async () => {
      const response = await $api.organization.test
        .session({ id: selectedSession as string })
        .get();
      return response.data;
    },
    enabled: !!selectedSession,
  });

  const {
    refetch: refetchSessions,
    data: dataSessions,
    isRefetching: isRefetchingSessions,
    isPending: isPendingSessions,
  } = useSessionByTestIdQuery({
    testId: dataSession?.testId as string,
  });

  const {
    data: dataQuestions,
    isRefetching: isRefetchingQuestions,
    isPending: isPendingQuestions,
  } = useAllQuestionByReferenceIdQuery({
    referenceId: selectedSession as string,
  });

  const [localQuestions, setLocalQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (dataQuestions) {
      setLocalQuestions(dataQuestions);
    }
  }, [dataQuestions]);

  const [hideOptions, setHideOptions] = useState(false);

  const onSuccessDeleteSession = async () => {
    const response = await refetchSessions();
    const updatedDataSessions = response.data;
    // Find the next available session to select after deletion
    if (updatedDataSessions && updatedDataSessions.length > 0) {
      // Set the first available session as selected
      setSelectedSession(updatedDataSessions[0].id);
    } else {
      // If no sessions left, clear the selection
      setSelectedSession(null);
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

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        // Get the header's position relative to the viewport
        const headerRect = headerRef.current.getBoundingClientRect();
        // Check if the header is at or past its sticky position (70px from top)
        setIsSticky(headerRect.top <= 70);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-row gap-6">
      <SectionSidebar />
      <Card className="border overflow-clip flex-1 h-max">
        <CardHeader
          ref={headerRef}
          className={cn(
            `sticky top-[70px] bg-background z-10 pb-4 mb-4 transition-all duration-300 border-b`,
            isSticky
              ? "border-border shadow-md shadow-black/5"
              : "border-transparent"
          )}
        >
          <div className="flex flex-row items-start">
            <CardTitle className="flex-1 flex flex-row flex-wrap items-center gap-2">
              {dataSession ? (
                <>
                  {dataSession?.order}.{" "}
                  {dataSession?.title || "Untitled session"}
                  <DialogEditSession sessionId={selectedSession as string} />
                </>
              ) : (
                <Skeleton className="w-1/2 h-5" />
              )}
            </CardTitle>
            <div className="flex flex-row gap-2">
              <Button
                size={"xs"}
                variant={hideOptions ? "default" : "outline"}
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

              <DialogEditSessionDuration
                sessionId={selectedSession as string}
                onSuccess={() => {
                  refetchSessions();
                  refetchSession();
                }}
                disabled={isPendingSession || isRefetchingSession}
              />
              <DialogDeleteSession
                isLastSession={dataSessions?.length === 1}
                disabled={
                  isRefetchingQuestions ||
                  isRefetchingSessions ||
                  isPendingQuestions ||
                  isPendingSessions
                }
                sessionId={selectedSession as string}
                onSuccess={() => {
                  onSuccessDeleteSession();
                }}
              />
            </div>
          </div>
          <CardDescription className="max-w-md flex flex-row items-end gap-2">
            {dataSession?.description || "No description"}
          </CardDescription>
        </CardHeader>
        {localQuestions?.length ? (
          <CardContent className="pt-0">
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
                    <SeparatorAdd
                      onClick={() => {
                        if (data.order) {
                          setAddQuestionOnOrder(data.order + 1);
                        } else {
                          setAddQuestionOnOrder(localQuestions.length + 1);
                        }
                      }}
                    />
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </CardContent>
        ) : (
          <CardContent className="pt-0">
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
        referenceId={dataSession?.id}
        referenceType="test-session"
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
        }}
      />
    </div>
  );
};

const SeparatorAdd = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="h-8 flex items-center justify-center group/separator relative">
      <Button
        size={"xxs"}
        variant={"default"}
        onClick={onClick}
        className="absolute opacity-30 lg:opacity-0 group-hover/separator:opacity-100"
      >
        <PlusIcon /> Add Question
      </Button>
      <div className="h-auto border-b border-border/50 border-dashed w-full group-hover/separator:border-solid group-hover/separator:border-border" />
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
      <h1>No question found on this session</h1>
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
