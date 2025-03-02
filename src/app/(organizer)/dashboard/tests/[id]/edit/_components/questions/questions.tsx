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
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useState } from "react";
import { useSelectedSession } from "../../_hooks/use-selected-session";
import { trpc } from "@/trpc/trpc.client";
import DialogDeleteSession from "@/components/shared/dialog/dialog-delete-session";
import { Skeleton } from "@/components/ui/skeleton";
import DialogEditSessionDuration from "@/components/shared/dialog/dialog-edit-session-duration";
import DialogEditSession from "@/components/shared/dialog/dialog-edit-session";
import { Question } from "@/lib/db/schema/question";
import DialogEditQuestion from "@/components/shared/dialog/dialog-edit-question";
import { cn } from "@/lib/utils";
import { Reorder } from "motion/react";
import DialogAddQuestion from "@/components/shared/dialog/dialog-add-question";

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
  const insertIndex = prevQuestions.findIndex(q => q.order && q.order >= firstNewQuestionOrder);
  
  if (insertIndex === -1) {
    // If no matching order found, append to the end
    return [...prevQuestions, ...newQuestions];
  } else {
    // Insert the new questions at the correct position
    return [
      ...prevQuestions.slice(0, insertIndex),
      ...newQuestions,
      ...prevQuestions.slice(insertIndex)
    ];
  }
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
  const findIndex = prevQuestions.findIndex(q => q.id === updatedQuestion.id);
  
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

  const {
    data: dataSession,
    isRefetching: isRefetchingSession,
    isPending: isPendingSession,
    refetch: refetchSession,
  } = trpc.organization.session.byId.useQuery(
    { id: selectedSession as string },
    { enabled: !!selectedSession }
  );

  const {
    refetch: refetchSessions,
    data: dataSessions,
    isRefetching: isRefetchingSessions,
    isPending: isPendingSessions,
  } = trpc.organization.session.sessionByTestId.useQuery(
    { testId: dataSession?.testId as string },
    { enabled: !!dataSession?.testId }
  );

  const {
    data: dataQuestions,
    isRefetching: isRefetchingQuestions,
    refetch: refetchQuestions,
    isPending: isPendingQuestions,
  } = trpc.organization.question.allByReferenceId.useQuery(
    {
      referenceId: selectedSession as string,
    },
    {
      enabled: !!selectedSession,
    }
  );

  const [localQuestions, setLocalQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (dataQuestions) {
      setLocalQuestions(dataQuestions);
    }
  }, [dataQuestions]);

  const [hideOptions, setHideOptions] = useState(false);

  const virtualizer = useWindowVirtualizer({
    count: localQuestions?.length || 0,
    estimateSize: () => 200,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const onSuccessDeleteSession = async () => {
    await refetchQuestions();
    await refetchSessions();

    // Find the next available session to select after deletion
    if (dataSessions && dataSessions.length > 0) {
      // Set the first available session as selected
      setSelectedSession(dataSessions[0].id);
    } else {
      // If no sessions left, clear the selection
      setSelectedSession(null);
    }
  };

  return (
    <div className="flex flex-row gap-6">
      <SectionSidebar />
      {isPendingQuestions ? (
        <Skeleton className="flex-1 h-[60vh]" />
      ) : dataSession ? (
        <Card className="border border-dashed overflow-clip flex-1 h-max">
          <CardHeader className="sticky top-14 bg-background z-10 pb-4">
            <div className="flex flex-row items-start">
              <CardTitle className="flex-1 flex flex-row flex-wrap items-center gap-2">
                {dataSession?.order}. {dataSession?.title || "Untitled session"}
                <DialogEditSession sessionId={selectedSession as string} />
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
              <div
                className="relative"
                style={{ height: `${virtualizer.getTotalSize()}px` }}
              >
                <Reorder.Group
                  onReorder={(newOrderedQuestions) => {
                    console.log(newOrderedQuestions);
                  }}
                  values={localQuestions}
                  as="div"
                  className={cn(
                    "absolute top-0 left-0 w-full",
                    isRefetchingQuestions ? "animate-pulse" : ""
                  )}
                  style={{
                    transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                  }}
                >
                  {virtualItems.map(({ index }) => {
                    const data = localQuestions?.[index];
                    return (
                      <Reorder.Item
                        value={data}
                        as="div"
                        key={data.id}
                        ref={virtualizer.measureElement}
                        data-index={index}
                        dragListener={false}
                      >
                        <CardQuestion
                          onMoveUp={() => {
                            console.log("move up");
                          }}
                          onMoveDown={() => {
                            console.log("move down");
                          }}
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
                              setLocalQuestions((prev) => [
                                ...prev.slice(0, findIndex),
                                ...prev.slice(findIndex + 1),
                              ]);
                            }
                          }}
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
              </div>
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
      ) : null}
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
        refetch={refetchQuestions}
        onClose={() => {
          setAddQuestionOnOrder(undefined);
        }}
        onSuccessCreateQuestion={(questions) => {
          setLocalQuestions((prev) => insertQuestionsAtCorrectPosition(prev, questions));
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
    <div className="border rounded-lg flex flex-col justify-center items-center py-16 border-dashed gap-4">
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
