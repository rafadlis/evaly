import { or } from "drizzle-orm";
import db from "../../../lib/db";
import { testAttempt } from "../../../lib/db/schema";
import { TestSection } from "../../../types/test";

export async function getOrCreateAttempt({
  testId,
  testSections,
  email,
}: {
  testId: string;
  testSections: TestSection[];
  email: string;
}) {
  // Check if there is an attempt already, return the attempt
  const sectionIds = testSections.map((section) => section.id);
 
  // Get existing attempts
  let resultAttempts = await getAttempts({ testId, email, sectionIds });

  // If there is no attempt for some sections, create a new attempt
  if (resultAttempts.length !== sectionIds.length) {
    const missingSectionIds = sectionIds.filter(
      (id) => !resultAttempts.some((resultAttempt) => resultAttempt.testSectionId === id)
    );

    const newAttempts = missingSectionIds.map((id) => ({
      testSectionId: id,
      testId,
      participantEmail: email,
      startedAt: new Date().toISOString(),
    }));

    const insertedAttempts = await db
      .insert(testAttempt)
      .values(newAttempts)
      .returning();

    if (insertedAttempts.length !== newAttempts.length) {
      throw new Error("Failed to create attempt");
    }

    // Get the new attempts
    resultAttempts = await getAttempts({ testId, email, sectionIds: missingSectionIds })
  }

  // Return the attempt sorted by section order
  const resultAttemptWithSections = testSections.map(testSection => {
    const attempt = resultAttempts.find(attempt => attempt.testSectionId === testSection.id);
    return {
      ...attempt,
      testSection: testSection,
    };
  });

  return resultAttemptWithSections;
}


const getAttempts = async ({ testId, email, sectionIds }: { testId: string, email: string, sectionIds: string[] }) => {
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
        or(...sectionIds.map((id) => eq(fields.testSectionId, id)))
      );
    },
  });

  return resultAttempts;
}