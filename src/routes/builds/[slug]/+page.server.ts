import fs from 'fs';

import type { Load } from '@sveltejs/kit';

import { db } from '$lib/server/database';

export const load: Load = async ({ params }: any) => {
	if (params.slug === "create") {
		return {
			build: {
				id: "create",
				name: "my build",
				created: Math.floor(Date.now() / 1000),
				owner: undefined,
				patch: "1.0g",
				character: undefined,
				weapon: undefined,
				skills: [],
				runes: [],
				notes: ""
			},
			characters: JSON.parse(fs.readFileSync('static/characters.json', 'utf-8')),
			skills: JSON.parse(fs.readFileSync('static/skills.json', 'utf-8')),
		};
	}

	return {
		build: db.get_build(params.slug).expect().pojo(),
		characters: JSON.parse(fs.readFileSync('static/characters.json', 'utf-8')),
		skills: JSON.parse(fs.readFileSync('static/skills.json', 'utf-8')),
		runes: JSON.parse(fs.readFileSync('static/runes.json', 'utf-8')),
	};
};