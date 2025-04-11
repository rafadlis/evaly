import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const ImportQuestions = () => {
  return (
    <div className="border border-dashed p-4 flex flex-col">
      <p className="font-semibold mb-2">Import Questions</p>
      <p className="mb-4 text-muted-foreground">
        Upload document to generate questions
      </p>
      <div className="flex flex-row gap-2">
        <Input
          type="file"
          className="mt-2"
          accept=".pdf,.xlsx,.xls,.csv,.json,.docx,.doc,.txt,.md,.pptx,.ppt"
        />
        <Button className="mt-2">Import</Button>
      </div>
      <div className="text-sm text-muted-foreground mt-4 space-x-2 flex flex-wrap flex-row">
        <Tooltip>
          <TooltipTrigger>Supported formats?</TooltipTrigger>
          <TooltipContent>
            <p>
              Supported formats: .pdf, .xlsx, .xls, .csv, .json, .docx, .doc,
              .txt, .md, .pptx, .ppt
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ImportQuestions;
