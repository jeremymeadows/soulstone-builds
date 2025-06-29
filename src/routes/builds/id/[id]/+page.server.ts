import { redirect, type Load } from '@sveltejs/kit';

import { db } from '$lib/server/database';
import { characters, skills, runes } from '$lib/server/options';
import type { Build } from '$lib';

export const load: Load = async ({ params, cookies }: any) => {
	const session_id = cookies.get('session');
	const user = db.get_user(session_id);

	let build: Build = db.get_build(params.id).expect();

	return {
		build,
		editable: user.ok ? user.value.id === build.user_id : false,
		liked: user.ok && db.has_vote(build.id, user.value.id).expect(),
		characters,
		skills,
		runes,
	};
};