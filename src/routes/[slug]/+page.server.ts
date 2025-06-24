import type { Load } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const load: Load = async ({ params }: any) => {
	db.get_build(params.slug);
	return {
		post: {
			title: `Title for ${params.slug} goes here`,
			content: `Content for ${params.slug} goes here`
		}
	};
};