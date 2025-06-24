import { randomBytes } from 'node:crypto';
import { count, eq } from 'drizzle-orm';

import { Result } from '$lib';

import { Database } from '../database';
import { users, sessions } from '../schema';

export function signup(this: Database, email: string, password: string): Result<string> {
    if (this.db.select({ count: count() }).from(users).where(eq(users.email, email)).get()!.count > 0) {
        return Result.Err(new Error("user already exists"));
    }

    let hash = Bun.password.hashSync(password);
    this.db.insert(users).values({
        // id: randomBytes(16).toString('hex'), // Generate a unique ID
        id: 'hex',
        email,
        username: "fff",
        password: hash,
    }).run();

    return this.signin(email, password);
}

export function signin(this: Database, email: string, password: string): Result<string> {
    let user = this.db.select().from(users).where(eq(users.email, email)).get();
    if (!user || !Bun.password.verifySync(password, user.password)) {
        return Result.Err(new Error("invalid credentials"));
    }

    let session_id = randomBytes(24).toString('base64');
    let expires = Date.now() + 30 * 24 * 60 * 60 * 1000;
    this.db.insert(sessions).values({
        session_id,
        user_id: user.id,
        expires: new Date(expires),
    }).run();

    return Result.Ok(session_id);
}

export function signout(this: Database, session_id: string): Result<null> {
    let result = this.db.delete(sessions).where(eq(sessions.session_id, session_id)).run();
    console.log(result);

    return Result.Ok(null);
}