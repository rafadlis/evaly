"use client";

import { Button } from "@/components/ui/button";
import BackButton from "@/components/shared/back-button";
import CardQuestion from "@/components/shared/card/card-question";
import { PlusIcon } from "lucide-react";
import DialogEditQuestion from "@/components/shared/dialog/dialog-edit-question";
import { Question, QuestionTemplate } from "@evaly/backend/types/question";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuestionTemplateById } from "@/query/organization/question/use-question-template-by-id";
import { useForm } from "react-hook-form";
import LoadingScreen from "@/components/shared/loading/loading-screen";
import { updateQuestionInArray } from "@/lib/utils";
import DialogAddQuestion from "@/components/shared/dialog/dialog-add-question-2";

const Page = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [selectedEditQuestion, setSelectedEditQuestion] =
    useState<Question | null>(null);
  const { data: questionTemplate, isLoading: isLoadingQuestionTemplate } =
    useQuestionTemplateById(templateId);
  const [localQuestions, setLocalQuestions] = useState<Question[]>([]);
  const [hideOptions, setHideOptions] = useState(false);

  useEffect(() => {
    if (questionTemplate) {
      setLocalQuestions(questionTemplate.questions);
    }
  }, [questionTemplate]);

  const {
    register,
    formState: { isDirty },
    handleSubmit,
  } = useForm<QuestionTemplate>();

  const onSubmit = (data: QuestionTemplate) => {
    console.log(data);
  };

  const isHavingOptions = useMemo(() => {
    return localQuestions.some(
      (question) => (question.options?.length || 0) > 0
    );
  }, [localQuestions]);

  if (isLoadingQuestionTemplate) {
    return <LoadingScreen />;
  }

  return (
    <div className="container">
      <div className="flex flex-row justify-between items-start">
        <div>
          <BackButton className="mb-2" href={`/dashboard/question`} />
          <input
            {...register("title")}
            className="outline-none text-xl font-medium max-w-xl w-full md:w-xl"
            placeholder="Add question template title"
          />
        </div>
        <div className="flex flex-row gap-2">
          <DialogAddQuestion
            referenceId={templateId}
            onSuccessCreateQuestion={(questions) => {
              setSelectedEditQuestion(questions[0]);
              setLocalQuestions((prev) => [...prev, ...questions]);
            }}
            order={localQuestions.length + 1}
            referenceType="template"
          />
          <Button disabled={!isDirty} onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center mt-10">
        <h1>List of questions</h1>
        {isHavingOptions ? (
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => setHideOptions(!hideOptions)}
          >
            {hideOptions ? "Show options" : "Hide options"}
          </Button>
        ) : null}
      </div>

      <div className="mt-2 flex flex-col gap-4">
        {localQuestions?.map((question, index) => (
          <CardQuestion
            key={question.id}
            data={question}
            onDeleteSuccess={() => {
              const findIndex = localQuestions.findIndex(
                (q) => q.id === question.id
              );
              if (findIndex >= 0) {
                // Update the order of questions after deletion
                setLocalQuestions((prev) => {
                  const filtered = prev.filter((q) => q.id !== question.id);
                  return filtered.map((q, index) => ({
                    ...q,
                    order:
                      q.order && question.order && q.order > question.order
                        ? q.order - 1
                        : index + 1,
                  }));
                });
              }
            }}
            onClickEdit={() => {
              setSelectedEditQuestion(question);
            }}
            previousQuestionId={localQuestions[index - 1]?.id}
            nextQuestionId={localQuestions[index + 1]?.id}
            hideOptions={hideOptions}
          />
        ))}
        {localQuestions?.length === 0 ? (
          <div className="border rounded-lg flex flex-col justify-center items-center py-16  gap-4">
            <h1>No question found on this section</h1>
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => {}}
              className=""
            >
              <PlusIcon /> Add Question
            </Button>
          </div>
        ) : null}
      </div>

      <DialogEditQuestion
        defaultValue={selectedEditQuestion}
        onClose={() => setSelectedEditQuestion(null)}
        onSuccess={(data) => {
          setSelectedEditQuestion(data);
          setLocalQuestions((prev) => updateQuestionInArray(prev, data));
        }}
      />
    </div>
  );
};

export default Page;
