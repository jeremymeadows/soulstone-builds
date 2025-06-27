// import adapter from '@sveltejs/adapter-auto';
import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, message }) => {
				if (path === '/builds/+') {
					return;
				}
				throw new Error(message);
			}
		},
	},

	compilerOptions: {
		runes: true
	},

	onwarn: (warning, handler) => {
		if (warning.code === "element_invalid_self_closing_tag") return;
		handler(warning);
	}
};

export default config;
