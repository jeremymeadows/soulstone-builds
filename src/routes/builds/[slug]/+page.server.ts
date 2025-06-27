import fs from 'fs';

import { redirect, type Load } from '@sveltejs/kit';

import { db } from '$lib/server/database';

export const load: Load = async ({ params, cookies }: any) => {
	let build = {
		id: undefined,
		name: "new build",
		created: new Date(),
		owner: undefined,
		patch: "1.0g",
		character: "any",
		weapon: "any",
		skills: ["_", "_", "_", "_", "_", "_"],
		runes: {
			versatility: ["", "", ""],
			tenacity: ["", "", "", ""],
		},
		notes: ""
	};

	if (params.slug === "+") {
		const session_id = cookies.get('session');
		const user_id = db.get_user(session_id).value_or(null)?.steamid;

		if (!user_id) {
			return redirect(300, '/signin');
		}

		build.owner = user_id;
	} else {
		build = db.get_build(params.slug).expect();
	}

	return {
		build,
		characters: JSON.parse(fs.readFileSync('static/characters.json', 'utf-8')),
		skills: JSON.parse(fs.readFileSync('static/skills.json', 'utf-8')),
		runes: JSON.parse(fs.readFileSync('static/runes.json', 'utf-8')),
	};
};