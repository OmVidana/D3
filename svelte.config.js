// import adapter from '@sveltejs/adapter-cloudflare';
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		paths: { base: process.env.NODE_ENV === 'production' ? '/D3' : '' }
	}
}

export default config
