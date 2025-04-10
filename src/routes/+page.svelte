<script lang="ts">
	import { base } from '$app/paths'
	import { d3Pages } from '$lib'
</script>

<div class="mx-auto max-w-2xl py-8">
	<h1 class="mb-8 text-center text-3xl font-bold text-gray-800">
		D3.js Visualization Examples
	</h1>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each Object.entries(d3Pages) as [key, d3Page]}
			<a
				href="{base}/{key}"
				class="block rounded-lg bg-white p-4 text-center
                       text-gray-700 shadow-md transition-shadow
                       duration-200 hover:text-blue-600 hover:shadow-lg"
			>
				{d3Page.title}
			</a>
		{/each}
	</div>
</div>
