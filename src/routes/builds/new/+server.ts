import { randomBytes } from 'crypto';
import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const POST = async ({ request, cookies }: any) => {
    const session_id = cookies.get('session');
    const user = db.get_user(session_id);

    if (!user.ok) {
        return error(401, "cannot save build: not logged in");
    }

    let build = await request.json();
    build.id = randomBytes(16).toHex();
    build.timestamp = new Date();

    return db.save_build(build).match({
        ok: (build_id: string) => {
            return json(build_id);
        },
        err: (e: Error) => {
            return error(500, e);
        }
    });
}