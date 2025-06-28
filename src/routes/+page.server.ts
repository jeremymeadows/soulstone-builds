import type { Load } from '@sveltejs/kit';

import type { Build } from '$lib';
import { db } from '$lib/server/database';
import { characters } from '$lib/server/options';

export const load: Load = () => {
	return {
		builds: db.get_builds().expect().map((build: Build) => build),
		characters,
	};
};