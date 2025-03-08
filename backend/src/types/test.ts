import { test } from "../lib/db/schema/test";
import { testSession } from "../lib/db/schema/test.session";

export type Test = typeof test.$inferSelect;
export type InsertTest = typeof test.$inferInsert;
export type UpdateTest = Partial<InsertTest>;

export type TestSession = typeof testSession.$inferSelect & {
  numOfQuestions?: number;
};
export type InsertTestSession = typeof testSession.$inferInsert;
export type UpdateTestSession = Partial<InsertTestSession>;
