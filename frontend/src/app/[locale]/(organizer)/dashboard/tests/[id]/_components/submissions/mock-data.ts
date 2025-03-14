import { Question, Submission } from './types';

// Generate mock questions for a submission
export const generateMockQuestions = (submission: Submission): Question[] => {
    return Array.from({ length: submission.totalQuestions }, (_, index) => {
        const questionTypes = ['multiple_choice', 'true_false', 'short_answer'] as const;
        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        let correctAnswer = '';
        let participantAnswer: string | null = null;
        let isCorrect: boolean | null = null;
        
        // Generate appropriate answers based on question type
        switch (type) {
            case 'multiple_choice':
                correctAnswer = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
                break;
            case 'true_false':
                correctAnswer = Math.random() > 0.5 ? 'True' : 'False';
                break;
            case 'short_answer':
                correctAnswer = ['Paris', 'London', 'Tokyo', 'New York'][Math.floor(Math.random() * 4)];
                break;
        }
        
        // Determine if this question was answered
        const wasAnswered = index < submission.answered;
        
        if (wasAnswered) {
            // For answered questions, determine if correct based on the submission stats
            const wasCorrect = index < submission.correct;
            
            if (wasCorrect) {
                participantAnswer = correctAnswer;
                isCorrect = true;
            } else {
                // Generate an incorrect answer
                if (type === 'multiple_choice') {
                    const options = ['A', 'B', 'C', 'D'].filter(opt => opt !== correctAnswer);
                    participantAnswer = options[Math.floor(Math.random() * options.length)];
                } else if (type === 'true_false') {
                    participantAnswer = correctAnswer === 'True' ? 'False' : 'True';
                } else {
                    const options = ['Paris', 'London', 'Tokyo', 'New York'].filter(opt => opt !== correctAnswer);
                    participantAnswer = options[Math.floor(Math.random() * options.length)];
                }
                isCorrect = false;
            }
        } else {
            // Unanswered questions
            participantAnswer = null;
            isCorrect = null;
        }
        
        return {
            id: index + 1,
            text: `Question ${index + 1}: ${type === 'multiple_choice' ? 'Select the correct option' : 
                  type === 'true_false' ? 'Is the statement true or false?' : 
                  'What is the capital of France?'}`,
            type,
            correctAnswer,
            participantAnswer,
            isCorrect
        };
    });
};

// This will be replaced with real data later
export const mockSubmissions = Array.from({ length: 30 }, (_, index) => {
    const totalQuestions = 10;
    const answered = Math.floor(Math.random() * (totalQuestions + 1));
    const correct = Math.floor(Math.random() * (answered + 1));
    const wrong = answered - correct;
    const unanswered = totalQuestions - answered;
    const score = Math.floor((correct / totalQuestions) * 100);

    // Generate random time within the last 24 hours
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 24));

    return {
        id: index + 1,
        name: [
            "John Doe", "Jane Smith", "Alex Johnson", "Maria Garcia", "David Lee",
            "Sarah Wilson", "Michael Brown", "Emma Davis", "James Miller", "Lisa Anderson",
            "Robert Taylor", "Patricia Moore", "Daniel White", "Jennifer Martin", "William Thompson",
            "Elizabeth Jackson", "Richard Martinez", "Susan Robinson", "Joseph Clark", "Margaret Rodriguez",
            "Thomas Wright", "Linda Walker", "Charles Hall", "Barbara Young", "Christopher King",
            "Michelle Scott", "Kenneth Green", "Sandra Adams", "Steven Baker", "Dorothy Nelson"
        ][index],
        email: `participant${index + 1}@example.com`,
        totalQuestions,
        answered,
        correct,
        wrong,
        unanswered,
        submittedAt: date.toISOString(),
        score,
    };
}).sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()); // Pre-sort by submission time 