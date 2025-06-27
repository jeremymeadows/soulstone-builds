import { randomBytes } from 'crypto';
import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const POST = async ({ request, cookies }: any) => {
    const session_id = cookies.get('session');
    if (!session_id) {
        return new Response('Unauthorized', { status: 401 });
    }

    let build = await request.json();
    build.id ??= randomBytes(16).toHex();
    build.created = new Date(build.created);

    // todo check auth

    return db.save_build(build).match({
        ok: (build_id: string) => {
            return json(build_id)
        },
        err: (e: Error) => {
            return error(500, e)
        }
    });
}