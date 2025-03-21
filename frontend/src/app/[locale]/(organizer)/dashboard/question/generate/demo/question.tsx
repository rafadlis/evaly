type QuestionProps = {
   question: string;    
   options: string[];
   correctOption: string;
  };
  
  export const Question = ({ question, options, correctOption }: QuestionProps) => {
    return (
      <div className="border border-dashed rounded-lg p-4">
        <h2>{question}</h2>
        <ul>
          {options.map((option) => (
            <li key={option} className={option === correctOption ? 'text-green-500' : 'text-red-500'}>{option}</li>
          ))}
        </ul>
      </div>
    );
  };
  