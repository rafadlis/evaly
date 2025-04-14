import db from "../../../lib/db";
import {
  question,
  test,
  testInvitation,
  testSection,
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
      testSections: {
        where: isNull(testSection.deletedAt),
        orderBy: asc(testSection.order),
      },
      organization: true,
    },
    where: and(eq(test.id, id), isNull(test.deletedAt)),
  });

  // Get section IDs to use for question counting
  const sectionIds =
    testResult?.testSections?.map((section) => section.id) || [];

  // Count questions for each section separately
  const sectionQuestionCounts = await Promise.all(
    sectionIds.map(async (sectionId) => {
      const result = await db
        .select({ count: count() })
        .from(question)
        .where(and(eq(question.referenceId, sectionId), isNull(question.deletedAt)));
      return { sectionId, count: result[0].count };
    })
  );

  // Create a map of section ID to question count
  const questionCountMap = Object.fromEntries(
    sectionQuestionCounts.map(({ sectionId, count }) => [sectionId, count])
  );

  // Add question counts to test sections
  const testSectionsWithCounts = testResult?.testSections.map((section) => ({
    ...section,
    totalQuestions: questionCountMap[section.id] || 0,
  }));

  const totalQuestions = sectionQuestionCounts.reduce(
    (sum, { count }) => sum + count,
    0
  );

  const totalDuration = testResult?.testSections.reduce(
    (acc, section) => acc + (section.duration ?? 0),
    0
  );

  return {
    ...testResult,
    testSections: testSectionsWithCounts,
    totalQuestions,
    totalDuration,
  };
}
