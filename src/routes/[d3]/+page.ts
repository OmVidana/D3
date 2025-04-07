import { d3Pages } from '$lib'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ params }) => {
	if (params.d3 in d3Pages) {
		return d3Pages[params.d3 as keyof typeof d3Pages]
	}
	error(404, `D3 page not found: ${params.d3}`)
}
