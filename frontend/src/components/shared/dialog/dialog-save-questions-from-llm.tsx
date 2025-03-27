import { Button, buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { $api } from "@/lib/api";
import { InsertQuestion, Question } from "@evaly/backend/types/question";
import { useMutation } from "@tanstack/react-query";
import { VariantProps } from "class-variance-authority";
import { SaveIcon } from "lucide-react";
import { toast } from "sonner";

const DialogSaveQuestionsFromLLM = ({
  size,
  variant,
  questions,
  title,
}: VariantProps<typeof buttonVariants> & {
  questions: Question[];
  title: string;
}) => {
  const {
    mutateAsync: createQuestionTemplate,
    isPending: isPendingCreateQuestionTemplate,
  } = useMutation({
    mutationFn: async () => {
      const res = await $api.organization.question.template.create.post({
        withInitialQuestion: false,
        title,
      });

      const { data } = res;
      if (!data) {
        toast.error("Failed to create question template");
        return;
      }

      return data;
    },
  });

  const router = useRouter();

  const { mutateAsync: createQuestions, isPending: isPendingCreateQuestions } =
    useMutation({
      mutationFn: async (questions: InsertQuestion[]) => {
        if (questions.length === 0) {
          return toast.error("No questions to save");
        }

        const res = await $api.organization.question.create.post(questions);
        return res;
      },
    });

  const handleSaveQuestions = async () => {
    const res = await createQuestionTemplate();
    if (!res) {
      return toast.error("Failed to create question template");
    }

    const { id } = res;

    const createQuestionsRes = await createQuestions(
      questions.map((question, index) => ({
        ...question,
        id: undefined,
        referenceType: "template",
        referenceId: id,
        order: index + 1,
      }))
    );

    if (!createQuestionsRes) {
      return toast.error("Failed to create questions");
    }

    toast.success("Questions saved successfully");
    router.push(`/dashboard/question/${id}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <SaveIcon /> Save Questions
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Questions</DialogTitle>
          <DialogDescription>
            Save the questions from the LLM to your question bank, existing test
            series or create a new test from it.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => handleSaveQuestions()}
            disabled={
              isPendingCreateQuestionTemplate || isPendingCreateQuestions
            }
          >
            {isPendingCreateQuestionTemplate
              ? "Creating template..."
              : isPendingCreateQuestions
                ? "Saving questions..."
                : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSaveQuestionsFromLLM;
