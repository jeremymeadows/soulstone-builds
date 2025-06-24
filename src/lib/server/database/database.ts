import { Database as BunSqlite } from 'bun:sqlite';
import { drizzle } from "drizzle-orm/bun-sqlite";
import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { count, eq } from "drizzle-orm";

import { Result } from '$lib';

import { DatabaseError } from './errors';
// import { queries } from './queries';
import * as queries from './queries/builds';
import * as schema from './schema';

export class Database {
  // [key: string]: Result<any, Error>;
  [key: string]: any;
  protected db: BunSQLiteDatabase<typeof schema>;

  constructor(file: string, options: any) {
    this.db = drizzle(new BunSqlite(file, options), { schema })
    Object.assign(this, { ...queries });
  }

  async init() {
    let users = this.db.select({ count: count() }).from(schema.users).get()!;
    if (users.count === 0) {
      this.db.insert(schema.users).values({
        id: "0",
        email: "admin@jeremymeadows.dev",
        username: "admin",
        password: await Bun.password.hash("admin"),
      }).run();
    }
  }

  get_user(session_id: string): Result<any, DatabaseError> {
    if (!session_id) {
      return Result.Err(DatabaseError.AuthenticationError);
    }

    let res = this.db.select()
      .from(schema.users)
      .innerJoin(schema.sessions, eq(schema.users.id, schema.sessions.user_id))
      .where(eq(schema.sessions.session_id, session_id))
      .get();

    if (!res) {
      return Result.Err(DatabaseError.ConnectionError);
    }

    return Result.Ok(res.users);
  }

  async seed() {
    let users = this.db.select({ count: count() }).from(schema.users).get()!;
    if (users.count > 1) { return }

    let data = await Bun.file("src/lib/server/database/demo_data.json").json();
    await this.db.transaction(async (tx) => {
      Object.keys(data).forEach(async (name: string) => {
        console.log(`Seeding ${data[name].length} records into ${name}`);
        if (data[name].length > 0) {
          await tx.insert((schema as any)[name]).values(data[name]);
        }
      });
    });
  }
}


export const db = new Database("db.sqlite", { create: true });
await db.init();
// await db.seed();