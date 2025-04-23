import { eq, and, sql, isNull, or } from "drizzle-orm";

// Replace path alias imports with relative paths
// These will need to be updated with the correct relative paths in the actual project
import db from "@/lib/db";
import {
    testSection,
    testAttempt,
    testAttemptAnswer,
    question,
    user,
    test
} from "@/lib/db/schema";

// Define types for database query results
type TestSection = {
    id: string;
    title: string;
    questionsCount: number;
};

type TestQuestion = {
    id: string;
    sectionId: string;
    question: string | null;
    type: string | null;
};

type TestAttempt = {
    id: string;
    participantEmail: string;
    testSectionId: string | null;
    startedAt: string | null;
    completedAt: string | null;
};

type TestAnswer = {
    attemptId: string;
    questionId: string;
    answerText: string | null;
    answerOptions: string[] | null;
    isCorrect: boolean | null;
};

export const getTestSubmissions = async (testId: string) => {
    // Fetch the test to get the finishedAt timestamp
    const testDetails = await db.select({
        finishedAt: test.finishedAt
    })
    .from(test)
    .where(eq(test.id, testId))
    .limit(1);

    const testFinishedAt = testDetails[0]?.finishedAt || null;
    const isTestEnded = testFinishedAt && new Date(testFinishedAt) < new Date();

    // 1. Fetch all active sections for this test
    const sectionsRaw = await db.select({
        id: testSection.id,
        title: sql<string>`${testSection}.title`,
    })
    .from(testSection)
    .where(
        and(
            eq(testSection.testId, testId),
            isNull(testSection.deletedAt)
        )
    )
    .orderBy(testSection.order);

    // 2. Fetch all active questions for these sections
    const sectionIds = sectionsRaw.map(section => section.id);
    const questionsRaw = await db.select({
        id: question.id,
        sectionId: question.referenceId,
        question: question.question,
        type: question.type,
    })
    .from(question)
    .where(
        and(
            or(...sectionIds.map(id => eq(question.referenceId, id))),
            isNull(question.deletedAt)
        )
    );

    // Group questions by section and count
    const questionsBySectionId: Record<string, TestQuestion[]> = {};
    for (const q of questionsRaw) {
        if (!questionsBySectionId[q.sectionId]) {
            questionsBySectionId[q.sectionId] = [];
        }
        questionsBySectionId[q.sectionId].push(q);
    }

    // Create sections with question counts
    const sections: TestSection[] = sectionsRaw.map(section => ({
        id: section.id,
        title: section.title,
        questionsCount: questionsBySectionId[section.id]?.length || 0
    }));

    // 3. Get all completed attempts for this test
    const attemptsRaw = await db.select({
        id: testAttempt.id,
        participantEmail: testAttempt.participantEmail,
        testSectionId: testAttempt.testSectionId,
        startedAt: testAttempt.startedAt,
        completedAt: sql<string | null>`${testAttempt}.completed_at`,
    })
    .from(testAttempt)
    .where(
        and(
            eq(testAttempt.testId, testId),
            isNull(testAttempt.deletedAt)
        )
    );

    // Convert to our expected type
    const attempts: TestAttempt[] = attemptsRaw.map(attempt => ({
        id: attempt.id,
        participantEmail: attempt.participantEmail,
        testSectionId: attempt.testSectionId,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt
    }));

    // 4. Get user information for each attempt
    const participantEmails = [...new Set(attempts.map(attempt => attempt.participantEmail))];
    
    const userInfoRaw = await db.select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
    })
    .from(user)
    .where(or(...participantEmails.map(email => eq(user.email, email))));

    // Create a map of email to user info for quick lookup
    const userMap = new Map(userInfoRaw.map(u => [u.email, u]));

    // 5. Get all answers for these attempts
    const attemptIds = attempts.map(attempt => attempt.id);
    
    const answersRaw = await db.select({
        attemptId: testAttemptAnswer.attemptId,
        questionId: testAttemptAnswer.questionId,
        answerText: sql<string | null>`${testAttemptAnswer}.answer_text`,
        answerOptions: sql<string[] | null>`${testAttemptAnswer}.answer_options`,
        isCorrect: testAttemptAnswer.isCorrect,
    })
    .from(testAttemptAnswer)
    .where(
        and(
            or(...attemptIds.map(id => eq(testAttemptAnswer.attemptId, id))),
            isNull(testAttemptAnswer.deletedAt)
        )
    );

    // Filter out any null attemptIds or questionIds
    const validAnswers: TestAnswer[] = answersRaw
        .filter(a => a.attemptId && a.questionId)
        .map(a => ({
            attemptId: a.attemptId!,
            questionId: a.questionId!,
            answerText: a.answerText,
            answerOptions: a.answerOptions,
            isCorrect: a.isCorrect
        }));

    // Create a map of questionId to sectionId for quick lookup
    const questionSectionMap = new Map(questionsRaw.map(q => [q.id, q.sectionId]));

    // Group attempts by participant email
    const attemptsByParticipant: Record<string, TestAttempt[]> = {};
    for (const attempt of attempts) {
        if (!attemptsByParticipant[attempt.participantEmail]) {
            attemptsByParticipant[attempt.participantEmail] = [];
        }
        attemptsByParticipant[attempt.participantEmail].push(attempt);
    }

    // Group answers by attempt
    const answersByAttempt: Record<string, TestAnswer[]> = {};
    for (const answer of validAnswers) {
        if (!answersByAttempt[answer.attemptId]) {
            answersByAttempt[answer.attemptId] = [];
        }
        answersByAttempt[answer.attemptId].push(answer);
    }

    // Calculate total questions count
    const totalQuestions = questionsRaw.length;

    // Process the data to create submissions (one per participant)
    const submissions: Submission[] = [];

    // Process each participant's attempts
    for (const [participantEmail, participantAttempts] of Object.entries(attemptsByParticipant)) {
        const userRecord = userMap.get(participantEmail);
        const name = userRecord?.name || participantEmail;
        const image = userRecord?.image || null;
        
        // Initialize section data
        const sectionAnswers: Record<string, number> = {};
        const sectionCorrect: Record<string, number> = {};
        const sectionWrong: Record<string, number> = {};
        
        sections.forEach(section => {
            sectionAnswers[section.id] = 0;
            sectionCorrect[section.id] = 0;
            sectionWrong[section.id] = 0;
        });

        // Track all answered question IDs to avoid double counting
        const answeredQuestionIds = new Set<string>();
        
        // Count answers, correct, and wrong by section across all attempts
        let totalAnswered = 0;
        let totalCorrect = 0;
        let totalWrong = 0;
        let latestCompletedAt: string | null = null;
        let latestStartedAt: string | null = null;
        let isInProgress = false;

        // Process each attempt by this participant
        for (const attempt of participantAttempts) {
            // Track if any attempt is in progress (started but not completed)
            if (attempt.startedAt && !attempt.completedAt) {
                isInProgress = true;
                
                // Track the latest start time for in-progress attempts
                if (!latestStartedAt || attempt.startedAt > latestStartedAt) {
                    latestStartedAt = attempt.startedAt;
                }
            }
            
            // Track the latest completion time for completed attempts
            if (attempt.completedAt && (!latestCompletedAt || attempt.completedAt > latestCompletedAt)) {
                latestCompletedAt = attempt.completedAt;
            }

            const attemptAnswers = answersByAttempt[attempt.id] || [];
            
            for (const answer of attemptAnswers) {
                // Skip if we've already counted this question for this participant
                if (answeredQuestionIds.has(answer.questionId)) {
                    continue;
                }
                
                // Get the section ID for this question
                const sectionId = questionSectionMap.get(answer.questionId);
                if (!sectionId) {
                    continue;
                }
                
                // Consider an answer provided if there's text or options selected
                const hasAnswer = answer.answerText || (answer.answerOptions && answer.answerOptions.length > 0);
                
                if (hasAnswer) {
                    // Mark this question as answered
                    answeredQuestionIds.add(answer.questionId);
                    
                    // Increment section and total counts
                    sectionAnswers[sectionId]++;
                    totalAnswered++;
                    
                    if (answer.isCorrect === true) {
                        sectionCorrect[sectionId]++;
                        totalCorrect++;
                    } else if (answer.isCorrect === false) {
                        sectionWrong[sectionId]++;
                        totalWrong++;
                    }
                }
            }
        }

        const score = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        // Create a submission for this participant
        submissions.push({
            id: participantAttempts[0].id, // Use the first attempt ID as the submission ID
            name: name,
            image: image,
            email: participantEmail,
            totalQuestions,
            answered: totalAnswered,
            correct: totalCorrect,
            wrong: totalWrong,
            unanswered: totalQuestions - totalAnswered,
            submittedAt: latestCompletedAt || null,
            startedAt: latestStartedAt || null,
            score,
            rank: 0, // Will be calculated after sorting
            sectionAnswers,
            sectionCorrect,
            sectionWrong,
            status: latestCompletedAt ? 'completed' : (isInProgress ? (isTestEnded ? 'test-ended' : 'in-progress') : 'not-started')
        });
    }

    // Sort submissions by score (descending) and assign ranks
    submissions.sort((a, b) => {
        // First prioritize completed submissions
        // Enable this to sort completed submissions to the top
        // if (a.status === 'completed' && b.status !== 'completed') return -1;
        // if (a.status !== 'completed' && b.status === 'completed') return 1;
        
        // Then sort by score (descending)
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        
        // If scores are equal for completed submissions, sort by submission time
        if (a.status === 'completed' && b.status === 'completed' && a.submittedAt && b.submittedAt) {
            return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        }
        
        // For in-progress or test-ended submissions with equal scores, sort by start time
        if ((a.status === 'in-progress' || a.status === 'test-ended') && 
            (b.status === 'in-progress' || b.status === 'test-ended') && 
            a.startedAt && b.startedAt) {
            return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
        }
        
        return 0;
    });
    
    submissions.forEach((submission, index) => {
        submission.rank = index + 1;
    });

    return {
        submissions,
        sections: sections.map(s => ({
            id: s.id,
            name: s.title, // Map title to name for the response
            questionsCount: s.questionsCount
        })),
        timestamp: new Date().toISOString(),
    };
};

// Export these types for use in other files
export type Submission = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    totalQuestions: number;
    answered: number;
    correct: number;
    wrong: number;
    unanswered: number;
    submittedAt: string | null;
    startedAt?: string | null;
    score: number;
    rank: number;
    sectionAnswers: {
        [key: string]: number; // sectionId: number of answers
    };
    sectionCorrect: {
        [key: string]: number; // sectionId: number of correct answers
    };
    sectionWrong: {
        [key: string]: number; // sectionId: number of wrong answers
    };
    status?: 'completed' | 'in-progress' | 'not-started' | 'test-ended';
}

export type Section = {
    id: string;
    name: string;
    questionsCount: number;
}