import type { Load } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const load: Load = async ({ cookies }: any) => {
    const session_id = cookies.get('session');
    if (!session_id) {
        return { user: null };
    }

    const user = db.get_user(session_id);
    return { user: user.ok ? user.value : null };
}