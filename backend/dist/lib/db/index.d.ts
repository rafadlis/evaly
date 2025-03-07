import * as bun from 'bun';
import * as drizzle_orm_bun_sql from 'drizzle-orm/bun-sql';
import { s as schema } from '../../index-B-K9R2Jp.js';
import './schema/user.js';
import 'drizzle-orm';
import 'drizzle-orm/pg-core';
import './schema/organization.js';
import './schema/test.js';
import './schema/test.session.js';
import './schema/question.js';
import '../../types/media.js';

declare const db: drizzle_orm_bun_sql.BunSQLDatabase<typeof schema> & {
    $client: bun.SQL;
};

export { db as default };
