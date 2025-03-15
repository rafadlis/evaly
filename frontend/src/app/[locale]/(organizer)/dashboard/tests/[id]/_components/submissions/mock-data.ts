import { nanoid } from 'nanoid';
import { Question, Submission, Section } from './types';

// Mock sections data
export const mockSections: Section[] = [
    { id: 1, name: "Basic Knowledge", questionsCount: 20 },
    { id: 2, name: "Technical Skills", questionsCount: 20 },
    { id: 3, name: "Problem Solving", questionsCount: 20 },
];

// Total questions across all sections
const totalQuestionsPerTest = mockSections.reduce((acc, section) => acc + section.questionsCount, 0);

// Generate mock questions for a submission
export const generateMockQuestions = (submission: Submission): Question[] => {
    const questions: Question[] = [];
    
    // Generate questions for each section
    mockSections.forEach(section => {
        const sectionQuestions = Array.from({ length: section.questionsCount }, (_, index) => {
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
            
            // Determine if this question was answered based on the section's answered count
            const sectionAnswered = submission.sectionAnswers?.[section.id] || 0;
            const wasAnswered = index < sectionAnswered;
            
            if (wasAnswered) {
                // For answered questions, determine if correct based on the section's correct count
                const sectionCorrect = submission.sectionCorrect?.[section.id] || 0;
                const wasCorrect = index < sectionCorrect;
                
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
                id: nanoid(),
                text: `${section.name} Q${index + 1}: ${type === 'multiple_choice' ? 'Select the correct option' : 
                      type === 'true_false' ? 'Is the statement true or false?' : 
                      'What is the capital of France?'}`,
                type,
                correctAnswer,
                participantAnswer,
                isCorrect,
                sectionId: section.id
            };
        });
        
        questions.push(...sectionQuestions);
    });
    
    return questions;
};

// Generate names for 100 participants
const generateNames = () => {
    const firstNames = [
        "John", "Jane", "Alex", "Maria", "David", "Sarah", "Michael", "Emma", "James", "Lisa",
        "Robert", "Patricia", "Daniel", "Jennifer", "William", "Elizabeth", "Richard", "Susan", "Joseph", "Margaret",
        "Thomas", "Linda", "Charles", "Barbara", "Christopher", "Michelle", "Kenneth", "Sandra", "Steven", "Dorothy",
        "Edward", "Helen", "Brian", "Betty", "Ronald", "Carol", "Anthony", "Amanda", "Kevin", "Melissa",
        "Jason", "Deborah", "Matthew", "Stephanie", "Gary", "Laura", "Timothy", "Rebecca", "Jose", "Sharon",
        "Larry", "Cynthia", "Jeffrey", "Kathleen", "Frank", "Ruth", "Scott", "Anna", "Eric", "Donna",
        "Stephen", "Brenda", "Andrew", "Amy", "Raymond", "Nicole", "Gregory", "Katherine", "Joshua", "Samantha",
        "Jerry", "Christine", "Dennis", "Catherine", "Walter", "Virginia", "Patrick", "Debra", "Peter", "Rachel",
        "Harold", "Janet", "Douglas", "Emma", "Henry", "Carolyn", "Carl", "Maria", "Arthur", "Heather",
        "Ryan", "Diane", "Roger", "Julie", "Joe", "Joyce", "Juan", "Victoria", "Jack", "Kelly"
    ];
    
    const lastNames = [
        "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
        "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
        "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King",
        "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter",
        "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins",
        "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey",
        "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez",
        "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross",
        "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington",
        "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes"
    ];
    
    // Generate 100 unique names
    const names: string[] = [];
    for (let i = 0; i < 100; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        names.push(`${firstName} ${lastName}`);
    }
    
    return names;
};

const names = generateNames();

// This will be replaced with real data later
export const mockSubmissions = Array.from({ length: 100 }, (_, index) => {
    // Generate section-specific data
    const sectionAnswers: Record<number, number> = {};
    const sectionCorrect: Record<number, number> = {};
    const sectionWrong: Record<number, number> = {};
    
    let totalAnswered = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    
    mockSections.forEach(section => {
        // Random number of answered questions for this section
        const answered = Math.floor(Math.random() * (section.questionsCount + 1));
        // Random number of correct answers (cannot exceed answered)
        const correct = Math.floor(Math.random() * (answered + 1));
        const wrong = answered - correct;
        
        sectionAnswers[section.id] = answered;
        sectionCorrect[section.id] = correct;
        sectionWrong[section.id] = wrong;
        
        totalAnswered += answered;
        totalCorrect += correct;
        totalWrong += wrong;
    });
    
    const totalUnanswered = totalQuestionsPerTest - totalAnswered;
    const score = Math.floor((totalCorrect / totalQuestionsPerTest) * 100);

    // Generate random time within the last 7 days
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 24 * 7));
    
    // Randomly assign to a section for primary section
    const primarySectionId = mockSections[Math.floor(Math.random() * mockSections.length)].id;

    return {
        id: index + 1,
        name: names[index],
        email: `participant${index + 1}@example.com`,
        totalQuestions: totalQuestionsPerTest,
        answered: totalAnswered,
        correct: totalCorrect,
        wrong: totalWrong,
        unanswered: totalUnanswered,
        submittedAt: date.toISOString(),
        score,
        sectionId: primarySectionId,
        sectionAnswers,
        sectionCorrect,
        sectionWrong
    };
}).sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()); // Pre-sort by submission time 