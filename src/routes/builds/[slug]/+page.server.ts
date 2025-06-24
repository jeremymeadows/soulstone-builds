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
			}
		};
	}

	return {
		build: db.get_build(params.slug).expect().pojo(),
	};
};