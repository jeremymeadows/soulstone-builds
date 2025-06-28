import { redirect, type Load } from '@sveltejs/kit';

import { db } from '$lib/server/database';
import { characters, skills, runes, tags } from '$lib/server/options';
import type { Build } from '$lib';

export const load: Load = async ({ params, cookies }: any) => {
	const session_id = cookies.get('session');
	const user = db.get_user(session_id);

	let build: Build;
	let liked = false;

	if (params.slug === "+") {
		if (!user.ok) {
			return redirect(300, '/signin');
		}

		build = {
			id: "",
			name: "new build",
			user_id: user.value.id,
			timestamp: new Date(),
			patch: "1.0g",
			character: "any",
			weapon: "any",
			skills: ["_", "_", "_", "_", "_", "_"],
			runes: {
				versatility: ["", "", ""],
				tenacity: ["", "", "", ""],
			},
			notes: "",
			tags: [],
		};
	} else {
		build = db.get_build(params.slug).expect();
		if (user.ok && db.has_vote(build.id, user.value.id).expect()) {
			liked = true;
		}
	}

	return { build, editable: user.ok ? user.value.id === build.user_id : false, liked, characters, skills, runes, tags };
};