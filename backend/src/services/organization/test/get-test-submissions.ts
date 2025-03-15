import { eq, and, sql, isNull, or } from "drizzle-orm";

// Replace path alias imports with relative paths
// These will need to be updated with the correct relative paths in the actual project
import db from "../../../lib/db";
import {
    testSection,
    testAttempt,
    testAttemptAnswer,
    question,
    user
} from "../../../lib/db/schema";

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

type UserInfo = {
    id: string;
    name: string | null;
    email: string | null;
};

type TestAnswer = {
    attemptId: string;
    questionId: string;
    answerText: string | null;
    answerOptions: string[] | null;
    isCorrect: boolean | null;
};

export const getTestSubmissions = async (testId: string) => {
    console.log("Getting submissions for test:", testId);
    
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

    console.log("Active sections found:", sectionsRaw.length);

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
            eq(question.referenceType, "test-section"),
            isNull(question.deletedAt)
        )
    );

    console.log("Active questions found:", questionsRaw.length);

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

    console.log("Sections with question counts:", sections.map(s => `${s.title}: ${s.questionsCount}`));

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
            sql`${testAttempt}.completed_at IS NOT NULL`,
            isNull(testAttempt.deletedAt)
        )
    );

    console.log("Completed attempts found:", attemptsRaw.length);

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
    console.log("Unique participant emails:", participantEmails.length);
    
    const userInfoRaw = await db.select({
        id: user.id,
        name: user.name,
        email: user.email,
    })
    .from(user)
    .where(sql`${user.email} IN (${participantEmails.length > 0 ? participantEmails.map(email => `'${email}'`).join(',') : "''"})`);

    console.log("User records found:", userInfoRaw.length);

    // Create a map of email to user info for quick lookup
    const userMap = new Map(userInfoRaw.map(u => [u.email, u]));

    // 5. Get all answers for these attempts
    const attemptIds = attempts.map(attempt => attempt.id);
    console.log("Attempt IDs:", attemptIds);
    
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
    
    console.log("Answers found:", answersRaw.length);
    if (answersRaw.length > 0) {
        console.log("Sample answer:", answersRaw[0]);
        
        // Count answers with isCorrect set
        const correctAnswers = answersRaw.filter(a => a.isCorrect === true).length;
        const incorrectAnswers = answersRaw.filter(a => a.isCorrect === false).length;
        const nullCorrectAnswers = answersRaw.filter(a => a.isCorrect === null).length;
        
        console.log("Correct answers:", correctAnswers);
        console.log("Incorrect answers:", incorrectAnswers);
        console.log("Null isCorrect answers:", nullCorrectAnswers);
    }

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
    
    console.log("Valid answers count:", validAnswers.length);

    // Create a map of questionId to sectionId for quick lookup
    const questionSectionMap = new Map(questionsRaw.map(q => [q.id, q.sectionId]));

    // Create a map of all question IDs for quick lookup
    const allQuestionIds = new Set(questionsRaw.map(q => q.id));
    console.log("Total unique questions:", allQuestionIds.size);

    // Group attempts by participant email
    const attemptsByParticipant: Record<string, TestAttempt[]> = {};
    for (const attempt of attempts) {
        if (!attemptsByParticipant[attempt.participantEmail]) {
            attemptsByParticipant[attempt.participantEmail] = [];
        }
        attemptsByParticipant[attempt.participantEmail].push(attempt);
    }
    
    console.log("Participant count:", Object.keys(attemptsByParticipant).length);

    // Group answers by attempt
    const answersByAttempt: Record<string, TestAnswer[]> = {};
    for (const answer of validAnswers) {
        if (!answersByAttempt[answer.attemptId]) {
            answersByAttempt[answer.attemptId] = [];
        }
        answersByAttempt[answer.attemptId].push(answer);
    }
    
    console.log("Attempts with answers:", Object.keys(answersByAttempt).length);

    // Calculate total questions count
    const totalQuestions = questionsRaw.length;
    console.log("Total questions count:", totalQuestions);

    // Process the data to create submissions (one per participant)
    const submissions: Submission[] = [];

    // Process each participant's attempts
    for (const [participantEmail, participantAttempts] of Object.entries(attemptsByParticipant)) {
        const userRecord = userMap.get(participantEmail);
        const name = userRecord?.name || participantEmail;
        
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
        let latestCompletedAt = "";

        console.log(`Participant ${participantEmail} has ${participantAttempts.length} attempts`);

        // Process each attempt by this participant
        for (const attempt of participantAttempts) {
            // Track the latest completion time
            if (attempt.completedAt && (!latestCompletedAt || attempt.completedAt > latestCompletedAt)) {
                latestCompletedAt = attempt.completedAt;
            }

            const attemptAnswers = answersByAttempt[attempt.id] || [];
            console.log(`Attempt ${attempt.id} has ${attemptAnswers.length} answers`);
            
            // Count correct and incorrect answers for this attempt
            const correctAttemptAnswers = attemptAnswers.filter(a => a.isCorrect === true).length;
            const incorrectAttemptAnswers = attemptAnswers.filter(a => a.isCorrect === false).length;
            console.log(`Attempt ${attempt.id} has ${correctAttemptAnswers} correct and ${incorrectAttemptAnswers} incorrect answers`);
            
            for (const answer of attemptAnswers) {
                // Skip if we've already counted this question for this participant
                if (answeredQuestionIds.has(answer.questionId)) {
                    continue;
                }
                
                // Get the section ID for this question
                const sectionId = questionSectionMap.get(answer.questionId);
                if (!sectionId) {
                    console.log(`Warning: Question ${answer.questionId} has no section mapping`);
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

        console.log(`Participant ${participantEmail} stats:`, {
            totalAnswered,
            totalCorrect,
            totalWrong,
            unanswered: totalQuestions - totalAnswered
        });

        const score = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        // Create a submission for this participant
        submissions.push({
            id: participantAttempts[0].id, // Use the first attempt ID as the submission ID
            name: name,
            email: participantEmail,
            totalQuestions,
            answered: totalAnswered,
            correct: totalCorrect,
            wrong: totalWrong,
            unanswered: totalQuestions - totalAnswered,
            submittedAt: latestCompletedAt,
            score,
            rank: 0, // Will be calculated after sorting
            sectionAnswers,
            sectionCorrect,
            sectionWrong,
        });
    }

    // Sort submissions by score (descending) and assign ranks
    submissions.sort((a, b) => b.score - a.score);
    submissions.forEach((submission, index) => {
        submission.rank = index + 1;
    });

    console.log("Final submissions count:", submissions.length);
    if (submissions.length > 0) {
        console.log("Sample submission:", {
            name: submissions[0].name,
            email: submissions[0].email,
            answered: submissions[0].answered,
            correct: submissions[0].correct,
            wrong: submissions[0].wrong,
            unanswered: submissions[0].unanswered,
            score: submissions[0].score,
            rank: submissions[0].rank
        });
    }

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
    totalQuestions: number;
    answered: number;
    correct: number;
    wrong: number;
    unanswered: number;
    submittedAt: string;
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
}

export type Section = {
    id: string;
    name: string;
    questionsCount: number;
}