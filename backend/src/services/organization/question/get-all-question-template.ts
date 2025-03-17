import db from "../../../lib/db";

export const getAllQuestionTemplate = async (organizationId: string) => {
  const data = await db.query.questionTemplate.findMany({
    where(fields, { and, eq, isNull }) {
      return and(
        eq(fields.organizationId, organizationId),
        isNull(fields.deletedAt)
      );
    },
    with: {
      questions: {
        orderBy(fields, { asc }) {
          return asc(fields.order);
        },
        columns: {
          id: true,
          question: true,
        },
        limit: 2,
      },
    },
    orderBy(fields, {desc}) {
      return desc(fields.createdAt);
    },
  });

  return data;
};
