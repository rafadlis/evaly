import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const ImportQuestions = () => {
  const t = useTranslations("Questions");

  return (
    <div className="border border-dashed p-4 flex flex-col">
      <p className="font-medium">{t("importQuestions")}</p>
      <p className="mb-4 text-muted-foreground">
        {t("uploadDocument")}
      </p>
      <div className="flex flex-row gap-2">
        <Input
          type="file"
          className="mt-2"
          accept=".pdf,.xlsx,.xls,.csv,.json,.docx,.doc,.txt,.md,.pptx,.ppt"
        />
        <Button className="mt-2">{t("upload")}</Button>
      </div>
      <div className="text-sm text-muted-foreground mt-4 space-x-2 flex flex-wrap flex-row">
        <Tooltip>
          <TooltipTrigger className="underline underline-offset-4 text-primary font-medium">{t("supportedFormatsTitle")}</TooltipTrigger>
          <TooltipContent>
            <p>
              {t("supportedFormats")}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ImportQuestions;
