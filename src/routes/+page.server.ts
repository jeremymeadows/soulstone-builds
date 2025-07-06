import type { Load } from '@sveltejs/kit';

import { db } from '$lib/server/database';
import { characters, tags } from '$lib/server/options';

export const load: Load = () => {
	return {
		builds: db.get_builds().expect(),
		characters, tags,
	};
};