import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const POST = async ({ request, cookies }: any) => {
    const session_id = cookies.get('session');
    const user = db.get_user(session_id);

    if (!user.ok) {
        return error(401, "cannot save build: not logged in");
    }

    let build = await request.json();
    build.timestamp = new Date(build.timestamp);

    if (user.value.id !== build.user_id) {
        return error(403, "cannot save build: permission denied");
    }

    return db.save_build(build).match({
        ok: (build_id: string) => {
            return json(build_id);
        },
        err: (e: Error) => {
            return error(500, e);
        }
    });
}

export const DELETE = async ({ request, cookies }: any) => {
    const session_id = cookies.get('session');
    const user = db.get_user(session_id);

    if (!user.ok) {
        return error(401, "cannot delete build: not logged in");
    }

    let { id } = await request.json();
    if (user.value.id !== db.get_build(id).expect().user_id) {
        return error(403, "cannot delete build: permission denied");
    }

    return db.delete_build(id).match({
        ok: () => json(null),
        err: (e: Error) => error(500, e)
    });
}

export const PATCH = async ({ request, cookies }: any) => {
    const session_id = cookies.get('session');
    const user = db.get_user(session_id);

    if (!user.ok) {
        return error(401, "cannot vote on build: not logged in");
    }

    let { id, vote } = await request.json();
    // if (user.value.id === db.get_build(id).expect().user_id) {
    //     return error(403, "cannot vote on own build");
    // }

    return db.vote_build(id, user.value.id, vote).match({
        ok: () => json(null),
        err: (e: Error) => error(500, e)
    });
}