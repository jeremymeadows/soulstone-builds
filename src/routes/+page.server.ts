import type { Load } from '@sveltejs/kit';

import { db } from '$lib/server/database';
import type { Build } from '$lib';

export const load: Load = () => {
	return {
		builds: db.get_builds().expect().map((build: Build) => build),
	};
};