import { sql, eq, count } from "drizzle-orm";
import { sqliteTable, primaryKey, integer, text, sqliteView } from "drizzle-orm/sqlite-core";

const table = sqliteTable;
const view = sqliteView;

export const users = table('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const sessions = table('sessions', {
  id: text('id').primaryKey(),
  user_id: text('user_id').references(() => users.id),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

export const builds = table('builds', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  user_id: text('user_id').references(() => users.id).notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull().default(sql`(UNIXEPOCH())`),
  patch: text('patch').notNull(),
  character: text('character').notNull(),
  weapon: text('weapon').notNull(),
  skills: text('skills', { mode: 'json' }).default(JSON.stringify(["_", "_", "_", "_", "_", "_"])),
  runes: text('runes', { mode: 'json' }).default(JSON.stringify({ versatility: ["", "", ""], tenacity: ["", "", "", ""] })),
  notes: text('notes').notNull().default(''),
});

export const votes = table('votes', {
  user_id: text('user_id').references(() => users.id),
  build_id: text('build_id').references(() => builds.id),
}, (table) => [
  primaryKey({ columns: [table.user_id, table.build_id] }),
]);

// export const details = view('details').as((query) => {
//   const vote_count = query.$with('vote_count').as(query
//     .select({
//       build_id: votes.build_id,
//       votes: count(votes.user_id).as('votes'),
//     })
//     .from(votes)
//     .groupBy(votes.build_id)
//   );
//   return query
//     .with(vote_count)
//     .select({
//       build_id: builds.id,
//       build_name: builds.name,
//       user_id: builds.user_id,
//       user_name: users.name,
//       timestamp: builds.timestamp,
//       patch: builds.patch,
//       character: builds.character,
//       weapon: builds.weapon,
//       skills: builds.skills,
//       runes: builds.runes,
//       notes: builds.notes,
//       votes: sql`COALESCE(${vote_count.votes}, 0)`.as('votes'),
//     })
//     .from(builds)
//     .leftJoin(vote_count, eq(builds.id, vote_count.build_id))
//     .leftJoin(users, eq(builds.user_id, users.id));
// });