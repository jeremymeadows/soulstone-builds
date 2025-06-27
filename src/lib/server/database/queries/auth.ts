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

    let session_id = randomBytes(24).toString('base64');
    let expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    this.db.insert(sessions).values({
        id: session_id,
        user_id: id,
        expires,
    }).run();

    return Result.Ok({ session_id, expires });
}

export function signout(this: Database, session_id: string): Result<null> {
    let result = this.db.delete(sessions).where(eq(sessions.id, session_id)).run();
    console.log(result);

    return Result.Ok(null);
}

// export function signup(this: Database, email: string, password: string): Result<string> {
//     if (this.db.select({ count: count() }).from(users).where(eq(users.email, email)).get()!.count > 0) {
//         return Result.Err(new Error("failed to create user: user already exists", { cause: new Error("user already exists") }));
//     }

//     let hash = Bun.password.hashSync(password);
//     try {
//         this.db.insert(users).values({
//             // id: randomBytes(16).toString('hex'), // Generate a unique ID
//             // id: 0,
//             email,
//             username: "fff",
//             password: hash,
//         }).run();
//     }
//     catch (error: { code: string } | any) {
//         console.error("Error creating user:\n", error);
//         return Result.Err(new Error(`failed to create user: ${error.code}`, { cause: error }));
//     }

//     return this.signin(email, password);
// }

// export function signin(this: Database, email: string, password: string): Result<string> {
//     let user = this.db.select().from(users).where(eq(users.email, email)).get();
//     if (!user || !Bun.password.verifySync(password, user.password)) {
//         return Result.Err(new Error("invalid credentials"));
//     }

//     let session_id = randomBytes(24).toString('base64');
//     let expires = Date.now() + 30 * 24 * 60 * 60 * 1000;
//     this.db.insert(sessions).values({
//         id: session_id,
//         user_id: user.id,
//         expires: new Date(expires),
//     }).run();

//     return Result.Ok(session_id);
// }

// export function signout(this: Database, session_id: string): Result<null> {
//     let result = this.db.delete(sessions).where(eq(sessions.id, session_id)).run();
//     console.log(result);

//     return Result.Ok(null);
// }