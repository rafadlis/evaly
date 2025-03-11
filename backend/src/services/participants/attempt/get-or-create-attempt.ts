import { or } from "drizzle-orm";
import db from "../../../lib/db";
import { TestSession, testAttempt } from "../../../lib/db/schema";

export async function getOrCreateAttempt({
  testId,
  testSessions,
  email,
}: {
  testId: string;
  testSessions: TestSession[];
  email: string;
}) {
  // Check if there is an attempt already, return the attempt
  const sessionIds = testSessions.map((session) => session.id);
 
  // Get existing attempts
  let resultAttempts = await getAttempts({ testId, email, sessionIds });

  // If there is no attempt for some sessions, create a new attempt
  if (resultAttempts.length !== sessionIds.length) {
    const missingSessionIds = sessionIds.filter(
      (id) => !resultAttempts.some((resultAttempt) => resultAttempt.testSessionId === id)
    );

    const newAttempts = missingSessionIds.map((id) => ({
      testSessionId: id,
      testId,
      participantEmail: email,
    }));

    const insertedAttempts = await db
      .insert(testAttempt)
      .values(newAttempts)
      .returning();

    if (insertedAttempts.length !== newAttempts.length) {
      throw new Error("Failed to create attempt");
    }

    // Get the new attempts
    resultAttempts = await getAttempts({ testId, email, sessionIds: missingSessionIds })
  }

  // Return the attempt sorted by session order
  const resultAttemptWithSessions = testSessions.map(testSession => {
    const attempt = resultAttempts.find(attempt => attempt.testSessionId === testSession.id);
    return {
      ...attempt,
      testSession: testSession,
    };
  });

  return resultAttemptWithSessions;
}


const getAttempts = async ({ testId, email, sessionIds }: { testId: string, email: string, sessionIds: string[] }) => {
  const resultAttempts = await db.query.testAttempt.findMany({
    with: {
      participant: {
        columns: {
          email: true,
          name: true,
          image: true,
        },
      },
    },
    where(fields, { and, eq }) {
      return and(
        eq(fields.testId, testId),
        eq(fields.participantEmail, email),
        or(...sessionIds.map((id) => eq(fields.testSessionId, id)))
      );
    },
  });

  return resultAttempts;
}