import { getTestById } from "./get-test-by-id";
import db from "../../../lib/db";
import { testSession, question } from "../../../lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { getInvitationListTest } from "./get-invitation-list-test";

export type ValidationIssue = {
  code: string;
  message: string;
};

export type CheckStatus = "ok" | "warning" | "error";

export type CheckItem = {
  id: string;
  title: string;
  status: CheckStatus;
  message: string;
};

export type TestPublishabilityResult = {
  isPublishable: boolean;
  checklist: CheckItem[];
  summary: {
    title: string;
    description: string | null;
    type: string;
    access: string;
    totalSessions: number;
    totalQuestions: number;
    totalDuration: number; // in minutes
    totalParticipants: number;
    scheduledDate: string | null;
    sessions: Array<{
      id: string;
      title: string;
      questionCount: number;
      duration: number;
    }>;
  } | null;
};

export async function validateTestIsPublishable(testId: string, organizationId: string): Promise<TestPublishabilityResult> {
    const test = await getTestById({id: testId, organizationId});

    if (!test) {
        return {
            isPublishable: false,
            checklist: [
                {
                    id: "test_exists",
                    title: "Test exists",
                    status: "error",
                    message: "Test not found"
                }
            ],
            summary: null
        };
    }

    const checklist: CheckItem[] = [];
    let hasErrors = false;

    // Check if title is set
    if (!test.title || test.title.trim() === "") {
        checklist.push({
            id: "title",
            title: "Test title",
            status: "error",
            message: "Test title is required"
        });
        hasErrors = true;
    } else {
        checklist.push({
            id: "title",
            title: "Test title",
            status: "ok",
            message: `Title: "${test.title}"`
        });
    }

    // Check if description is set
    if (!test.description || test.description.trim() === "") {
        checklist.push({
            id: "description",
            title: "Test description",
            status: "warning",
            message: "Adding a description is recommended"
        });
    } else {
        checklist.push({
            id: "description",
            title: "Test description",
            status: "ok",
            message: "Description is set"
        });
    }

    // Check test type
    checklist.push({
        id: "type",
        title: "Test type",
        status: "ok",
        message: `${test.type === "live" ? "Live test" : "Self-paced test"}`
    });

    // Get test sessions
    const testSessions = await db.query.testSession.findMany({
        where: and(
            eq(testSession.testId, testId),
            isNull(testSession.deletedAt)
        ),
    });

    // Check if test has sessions
    if (testSessions.length === 0) {
        checklist.push({
            id: "sessions",
            title: "Test sessions",
            status: "error",
            message: "Test must have at least one session"
        });
        hasErrors = true;
    } else {
        checklist.push({
            id: "sessions",
            title: "Test sessions",
            status: "ok",
            message: `${testSessions.length} session(s) created`
        });

        // Check if each session has a title
        const sessionsWithoutTitle = testSessions.filter(session => !session.title || session.title.trim() === "");
        if (sessionsWithoutTitle.length > 0) {
            checklist.push({
                id: "session_titles",
                title: "Session titles",
                status: "error",
                message: `${sessionsWithoutTitle.length} session(s) are missing a title`
            });
            hasErrors = true;
        } else {
            checklist.push({
                id: "session_titles",
                title: "Session titles",
                status: "ok",
                message: "All sessions have titles"
            });
        }
    }

    // Get invitations if test is invite-only
    let invitations = [];
    if (test.access === "invite-only") {
        invitations = await getInvitationListTest(testId);
        
        if (invitations.length === 0) {
            checklist.push({
                id: "invitations",
                title: "Participant invitations",
                status: "error",
                message: "Invite-only test must have at least one participant invited"
            });
            hasErrors = true;
        } else {
            checklist.push({
                id: "invitations",
                title: "Participant invitations",
                status: "ok",
                message: `${invitations.length} participant(s) invited`
            });
        }
    } else {
        checklist.push({
            id: "access",
            title: "Test access",
            status: "ok",
            message: `Access: ${test.access || "public"}`
        });
    }

    // Check if test has a scheduled date for live tests
    if (test.type === "live") {
        if (!test.heldAt) {
            checklist.push({
                id: "scheduled_date",
                title: "Scheduled date",
                status: "error",
                message: "Live test must have a scheduled date"
            });
            hasErrors = true;
        } else {
            const scheduledDate = new Date(test.heldAt);
            checklist.push({
                id: "scheduled_date",
                title: "Scheduled date",
                status: "ok",
                message: `Scheduled for: ${scheduledDate.toLocaleString()}`
            });
        }
    }

    // Build session details with question counts
    const sessionDetails = [];
    let totalQuestions = 0;
    let totalDuration = 0;
    let sessionsWithoutQuestions = 0;

    for (const session of testSessions) {
        const questions = await db.query.question.findMany({
            where: and(
                eq(question.referenceId, session.id),
                eq(question.referenceType, "test-session"),
                isNull(question.deletedAt)
            ),
        });

        if (questions.length === 0) {
            sessionsWithoutQuestions++;
        }

        totalQuestions += questions.length;
        totalDuration += session.duration || 0;

        sessionDetails.push({
            id: session.id,
            title: session.title || "Untitled Session",
            questionCount: questions.length,
            duration: session.duration || 0
        });
    }

    // Check if all sessions have questions
    if (sessionsWithoutQuestions > 0) {
        checklist.push({
            id: "session_questions",
            title: "Session questions",
            status: "error",
            message: `${sessionsWithoutQuestions} session(s) have no questions`
        });
        hasErrors = true;
    } else if (testSessions.length > 0) {
        checklist.push({
            id: "session_questions",
            title: "Session questions",
            status: "ok",
            message: `${totalQuestions} question(s) across all sessions`
        });
    }

    // Check total duration
    if (totalDuration === 0 && testSessions.length > 0) {
        checklist.push({
            id: "duration",
            title: "Test duration",
            status: "warning",
            message: "No time limit set for sessions. Participants can complete the test at their own pace."
        });
    } else if (testSessions.length > 0) {
        checklist.push({
            id: "duration",
            title: "Test duration",
            status: "ok",
            message: `Total duration: ${totalDuration} minutes`
        });
    }

    // Build the summary object
    const summary = {
        title: test.title || "Untitled Test",
        description: test.description,
        type: test.type,
        access: test.access || "public",
        totalSessions: testSessions.length,
        totalQuestions: totalQuestions,
        totalDuration: totalDuration,
        totalParticipants: invitations.length,
        scheduledDate: test.heldAt,
        sessions: sessionDetails
    };

    return {
        isPublishable: !hasErrors,
        checklist,
        summary
    };
}