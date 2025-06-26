import { db } from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const prerender = false;

// export const load = async ({ cookies }) => {
// 	const session = cookies.get('session');
// 	if (session) {
// 		db.get_user(session).match({
// 			ok: (profile) => {
// 				return { profile }
// 			},
// 			err: () => {
// 				cookies.delete('session', { path: '/' });
// 			}
// 		});
// 	}
// }

// export const actions = {
// 	default: async ({ cookies, request }) => {
// 		const data = await request.formData();
// 		const username = data.get("username")?.toString();
// 		const password = data.get("password")?.toString();

// 		if (!username || !password) {
// 			return fail(400, { error: "Username and password are required." });
// 		}

// 		db.signin(username, password).match({
// 			ok: (session_id: string) => {
// 				cookies.set("session_id", session_id, { path: '/' });
// 				cookies.set("user", username, { path: '/' });
// 				return redirect(303, '/');
// 			},
// 			err: (error: Error) => {
// 				return fail(400, { error: error.message, email: data.get("email") });
// 			}
// 		})
// 	}
// } satisfies Actions;