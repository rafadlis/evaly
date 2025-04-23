import { ToolInvocation } from "ai";
import { TextShimmer } from "@/components/ui/text-shimmer";

interface TopicsRecommendationProps {
  toolInvocation: ToolInvocation;
  onSelect: (topic: string) => void;
}

interface Recommendation {
  topic: string;
  description: string;
}

const TopicsRecommendationChat = ({ toolInvocation, onSelect }: TopicsRecommendationProps) => {
    const { args, state, toolCallId } = toolInvocation;
  
    if (state === "call") {
      return <TextShimmer className="text-sm" key={toolCallId + "-call"}>Showing topics recommendation...</TextShimmer>;
    }
  
    return (
      <div key={toolCallId} className="pb-4 flex flex-col gap-4">
        {args?.explanationMessage && (
          <p className="text-sm">{args.explanationMessage}</p>
        )}
        
        <div className="flex flex-col gap-2">
          {args?.recommendations && args.recommendations.map((rec: Recommendation, index: number) => (
            <button
              className='justify-start h-auto py-1.5 px-2 max-w-[400px] text-start border cursor-pointer hover:bg-secondary' 
              key={rec.topic || `rec-${index}`} 
              onClick={() => onSelect(rec.topic + " - " + rec.description)}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{rec.topic}</span>
                <span className="text-xs text-muted-foreground">{rec.description}</span>
              </div>
            </button>
          ))}
        </div>
        
        {args?.subject && args?.gradeLevel && (
          <p className="text-xs text-gray-500">
            Subject: {args.subject} | Target: {args.gradeLevel}
          </p>
        )}
      </div>
    );
};

export default TopicsRecommendationChat