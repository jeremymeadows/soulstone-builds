import { redirect, type Load } from '@sveltejs/kit';

import { db } from '$lib/server/database';
import { characters, skills, runes, tags } from '$lib/server/options';
import type { Build } from '$lib';

export const load: Load = async ({ cookies }: any) => {
	const session_id = cookies.get('session');
	const user = db.get_user(session_id);

	if (!user.ok) {
		return redirect(300, '/signin');
	}

	let build: Build = {
		id: "",
		name: "new build",
		user_id: user.value.id,
		timestamp: new Date(),
		patch: "1.0g",
		character: "_any",
		weapon: "_any",
		skills: Array(6).fill("_none"),
		runes: {
			versatility: Array(3).fill("_empty"),
			tenacity: Array(4).fill("_empty"),
		},
		notes: "",
		tags: [],
	};

	return { build, editable: true, characters, skills, runes, tags };
};