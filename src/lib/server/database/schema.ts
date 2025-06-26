import { sql } from "drizzle-orm";
import { sqliteTable, primaryKey, foreignKey, integer, text } from "drizzle-orm/sqlite-core";

const table = sqliteTable;

export const users = table('users', {
  id: text('id').primaryKey(),
  profile: text('profile', { mode: 'json' }).notNull(),
});

export const sessions = table('sessions', {
  id: text('id').primaryKey(),
  user_id: text('user_id').references(() => users.id),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

export const builds = table('builds', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  created: integer('created', { mode: 'timestamp' }).notNull().default(sql`(UNIXEPOCH())`),
  owner: text('owner').references(() => users.id).notNull(),
  patch: text('patch').notNull(),
  character: text('character'),
  weapon: text('weapon'),
  skills: text('skills', { mode: 'json' }).default(JSON.stringify([])),
  runes: text('runes', { mode: 'json' }).default(JSON.stringify([])),
  notes: text('notes').default(''),
});

export const votes = table('votes', {
  user_id: text('user_id').references(() => users.id),
  build_id: text('build_id').references(() => builds.id),
}, (table) => [
  primaryKey({ columns: [table.user_id, table.build_id] }),
]);