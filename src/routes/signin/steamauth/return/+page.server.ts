import type { Load } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const prerender = false;
export const ssr = false;

export const load: Load = async ({ cookies }: any) => {
    let profile = db.get_user(cookies.get('session'));
    return { profile: profile.value_or(null) };
}