import { count, eq } from 'drizzle-orm';

import { Build, Result } from '$lib';

import { Database } from '../database';
import { builds } from '../schema';

export function get_build(this: Database, id: string): Result<Build> {
    let build = this.db.select().from(builds).where(eq(builds.id, id)).get();
    if (!build) {
        return Result.Err(new Error("build not found"));
    }

    let votes = this.db.select({ count: count() })
        .from(builds)
        .where(eq(builds.id, id))
        .get()!.count;

    return Result.Ok(Build.from({...build, votes}));
}