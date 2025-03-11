import db from "../../../lib/db";
import {
  question,
  test,
  testInvitation,
  testSession,
} from "../../../lib/db/schema";
import { and, asc, count, eq, isNull } from "drizzle-orm";

export async function getTestById({
  id,
  email,
}: {
  id: string;
  email?: string;
}) {
  const checkTestResult = await db.query.test.findFirst({
    where: and(eq(test.id, id), isNull(test.deletedAt)),
  });

  if (!checkTestResult?.isPublished) {
    return {
      error: {
        message: "Test not found",
        status: 404,
      },
    };
  }

  if (!checkTestResult) {
    return {
      error: {
        message: "Test not found",
        status: 404,
      },
    };
  }

  if (checkTestResult.requiresLogin && !email) {
    return {
      error: {
        message: "Test requires login",
        status: 401,
      },
    };
  }

  if (checkTestResult.access === "invite-only") {
    if (!email) {
      return {
        error: {
          message: "Test requires login",
          status: 401,
        },
    };
    }
    const invitationResult = await db.query.testInvitation.findFirst({
      where: and(
        eq(testInvitation.testId, id),
        eq(testInvitation.email, email)
      ),
    });

    if (!invitationResult) {
      return {
        error: {
          message: "You are not allowed to access this test",
          status: 403,
        },
      };
    }
  }

  const testResult = await db.query.test.findFirst({
    with: {
      createdByOrganizer: {
        with: { user: true },
      },
      invitations: {
        orderBy: asc(testInvitation.email),
      },
      testSessions: {
        where: isNull(testSession.deletedAt),
        orderBy: asc(testSession.order),
      },
      organization: true,
    },
    where: and(eq(test.id, id), isNull(test.deletedAt)),
  });

  // Get session IDs to use for question counting
  const sessionIds =
    testResult?.testSessions?.map((session) => session.id) || [];

  // Count questions for each session separately
  const sessionQuestionCounts = await Promise.all(
    sessionIds.map(async (sessionId) => {
      const result = await db
        .select({ count: count() })
        .from(question)
        .where(and(eq(question.referenceId, sessionId), isNull(question.deletedAt)));
      return { sessionId, count: result[0].count };
    })
  );

  // Create a map of session ID to question count
  const questionCountMap = Object.fromEntries(
    sessionQuestionCounts.map(({ sessionId, count }) => [sessionId, count])
  );

  // Add question counts to test sessions
  const testSessionsWithCounts = testResult?.testSessions.map((session) => ({
    ...session,
    totalQuestions: questionCountMap[session.id] || 0,
  }));

  const totalQuestions = sessionQuestionCounts.reduce(
    (sum, { count }) => sum + count,
    0
  );

  const totalDuration = testResult?.testSessions.reduce(
    (acc, session) => acc + (session.duration ?? 0),
    0
  );

  return {
    ...testResult,
    testSessions: testSessionsWithCounts,
    totalQuestions,
    totalDuration,
  };
}
