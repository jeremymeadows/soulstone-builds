import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';

import { Result } from '$lib';

import { Database } from '../database';
import { users, sessions } from '../schema';

export function signin(this: Database, id: string, profile: object): Result<{session_id: string, expires: Date}> {
    this.db.insert(users).values({
        id,
        profile,
    }).onConflictDoUpdate({
        target: users.id,
        set: { profile }
    }).run();

    let session_id = randomBytes(24).toHex();
    let expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    this.db.insert(sessions).values({
        id: session_id,
        user_id: id,
        expires,
    }).run();

    return Result.Ok({ session_id, expires });
}

export function signout(this: Database, session_id: string): Result<null> {
    this.db.delete(sessions).where(eq(sessions.id, session_id)).run();
    return Result.Ok(null);
}