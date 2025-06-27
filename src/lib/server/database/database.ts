import { Database as BunSqlite } from 'bun:sqlite';
import { type BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { sql, eq } from "drizzle-orm";

import { Result } from '$lib';

import queries from './queries';
import * as schema from './schema';

export class Database {
  [key: string]: any;
  protected db: BunSQLiteDatabase<typeof schema>;

  constructor(file: string, options: any) {
    this.db = drizzle(new BunSqlite(file, options), { schema });
    Object.assign(this, { ...queries });
  }

  async init() {
    let exists = await this.db.$count(sql`sqlite_master`);
    if (!exists) {
      await Bun.$`bunx drizzle-kit push`;
    }
  }

  get_user(session_id: string): Result<any> {
    if (!session_id) {
      return Result.Err(new Error("failed to get user: no session_id"));
    }

    let res = this.db.select({ profile: schema.users.profile })
      .from(schema.users)
      .innerJoin(schema.sessions, eq(schema.users.id, schema.sessions.user_id))
      .where(eq(schema.sessions.id, session_id))
      .get();

    if (!res) {
      return Result.Err(new Error("failed to get user: invalid session_id"));
    }

    return Result.Ok(res.profile);
  }
}

export const db = new Database("db.sqlite", { create: true });
await db.init();