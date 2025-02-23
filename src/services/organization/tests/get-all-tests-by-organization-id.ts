import db from "@/lib/db";
import { test } from "@/lib/db/schema";
import { Pagination } from "@/types/pagination";
import { SQL, sql } from "drizzle-orm";
import { and, eq, isNull, like, between, or } from "drizzle-orm";

export async function getAllTestsByOrganizationId({
  organizationId,
  sort = "desc-create",
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate,
}: {
  organizationId: string;
  page?: number;
  limit?: number;
  sort?: "asc-create" | "desc-create" | "asc-held" | "desc-held";
  search?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const offset = (page - 1) * limit;

  // Build where conditions
  const whereConditions: SQL[] = [
    eq(test.organizationId, organizationId),
    isNull(test.deletedAt),
  ];

  // Add search condition if search term is provided
  if (search) {
    const searchCondition = or(
      like(sql`${test.title}`, `%${search}%`),
      like(sql`${test.description}`, `%${search}%`)
    ) as SQL;

    whereConditions.push(searchCondition);
  }

  // Add date range condition if dates are provided
  if (startDate && endDate) {
    whereConditions.push(
      between(test.heldAt, startDate.toISOString(), endDate.toISOString())
    );
  }

  const data = await db.query.test.findMany({
    where: (_, { and }) => and(...whereConditions),
    limit,
    offset,
    orderBy: (fields, { asc, desc }) => {
      switch (sort) {
        case "asc-create":
          return [asc(fields.createdAt)];
        case "desc-create":
          return [desc(fields.createdAt)];
        case "asc-held":
          return [asc(fields.heldAt)];
        case "desc-held":
          return [desc(fields.heldAt)];
        default:
          return [desc(fields.createdAt)];
      }
    },
  });

  // Get total count using SQL count
  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(test)
    .where(and(...whereConditions));

  const pagination: Pagination = {
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };

  return {
    data,
    pagination,
  };
}
