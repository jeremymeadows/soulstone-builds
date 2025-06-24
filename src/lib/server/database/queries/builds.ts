import { count, eq } from 'drizzle-orm';

import { Build, Result } from '$lib';

import { Database } from '../database';
import * as schema from '../schema';

export function get_builds(this: Database): Result<Build[]> {
    let builds = this.db.select().from(schema.builds).all();
    let votes = this.db.select({ build_id: schema.votes.build_id, count: count() })
        .from(schema.votes)
        .groupBy(schema.votes.build_id)
        .all();

    return Result.Ok(builds.map((build) => {
        let vote = votes.find(v => v.build_id === build.id);
        return Build.from({ ...build, votes: (vote?.count ?? 0) });
    }));
}

export function get_build(this: Database, id: string): Result<Build> {
    let build = this.db.select().from(schema.builds).where(eq(schema.builds.id, id)).get();
    if (!build) {
        return Result.Err(new Error("build not found"));
    }

    let votes = this.db.select({ count: count() })
        .from(schema.builds)
        .where(eq(schema.builds.id, id))
        .get()!.count;

    return Result.Ok(Build.from({...build, votes}));
}