import { test } from '../lib/db/schema/test.js';
import { testSession } from '../lib/db/schema/test.session.js';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

type Test = typeof test.$inferSelect;
type InsertTest = typeof test.$inferInsert;
type UpdateTest = Partial<InsertTest>;
type TestSession = typeof testSession.$inferSelect;
type InsertTestSession = typeof testSession.$inferInsert;
type UpdateTestSession = Partial<InsertTestSession>;

export type { InsertTest, InsertTestSession, Test, TestSession, UpdateTest, UpdateTestSession };
