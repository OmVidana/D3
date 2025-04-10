// import adapter from '@sveltejs/adapter-cloudflare';
import { base } from '$app/paths'
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: `${base}/404.html`
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	}
}

export default config
