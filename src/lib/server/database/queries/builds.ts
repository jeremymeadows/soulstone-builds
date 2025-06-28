import { count, eq, and } from 'drizzle-orm';

import { type Build, Result } from '$lib';

import { Database } from '../database';
import * as schema from '../schema';

export function get_builds(this: Database): Result<Build[]> {
    let builds = this.db.select().from(schema.builds).all();
    let votes = this.db.select({ build_id: schema.votes.build_id, count: count() })
        .from(schema.votes)
        .groupBy(schema.votes.build_id)
        .all();
    let usernames = this.db.select({ id: schema.users.id, name: schema.users.name })
        .from(schema.users)
        .all();

    return Result.Ok(builds.map((build) => {
        let vote = votes.find(v => v.build_id === build.id);
        let user = usernames.find(u => u.id === build.user_id);
        return { ...build, user_name: (user?.name ?? `user${build.user_id}`), votes: (vote?.count ?? 0), tags: Array.isArray(build.tags) ? build.tags as string[] : [] };
    }));
}

export function get_build(this: Database, id: string): Result<Build> {
    const build = this.db
        .select()
        .from(schema.builds)
        .where(eq(schema.builds.id, id))
        .get();

    if (!build) {
        return Result.Err(new Error("build not found"));
    }

    const vote_result = this.db
        .select({ count: count(schema.votes.user_id) })
        .from(schema.votes)
        .where(eq(schema.votes.build_id, id))
        .groupBy(schema.votes.build_id)
        .get();

    const user_result = this.db
        .select({ name: schema.users.name })
        .from(schema.users)
        .where(eq(schema.users.id, build.user_id))
        .get();

    const votes = vote_result?.count ?? 0;
    const user = user_result?.name ?? `user${build.user_id}`;
    const tags = Array.isArray(build.tags) ? build.tags as string[] : []

    return Result.Ok({ ...build, user_name: user, votes, tags });
}


export function save_build(this: Database, data: Build): Result<string> {
    this.db.insert(schema.builds).values(data).onConflictDoUpdate({
        target: schema.builds.id,
        set: data
    }).run();
    return Result.Ok(data.id);
}

export function delete_build(this: Database, id: string): Result<null> {
    this.db.delete(schema.builds).where(eq(schema.builds.id, id)).run();
    return Result.Ok(null);
}

export function has_vote(this: Database, build_id: string, user_id: string): Result<boolean> {
    let exists = this.db.select({ exists: count() })
        .from(schema.votes)
        .where(and(eq(schema.votes.build_id, build_id), eq(schema.votes.user_id, user_id)))
        .get()!.exists > 0;
    return Result.Ok(exists);
}

export function vote_build(this: Database, build_id: string, user_id: string, vote: boolean): Result<null> {
    if (vote) {
        this.db.insert(schema.votes).values({ user_id, build_id }).onConflictDoNothing().run();
    } else {
        this.db.delete(schema.votes).where(and(eq(schema.votes.build_id, build_id), eq(schema.votes.user_id, user_id))).run();
    }
    return Result.Ok(null);
}