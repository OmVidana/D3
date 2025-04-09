<script lang="ts">
	import type { PageProps } from './$types'
	let { data }: PageProps = $props()
</script>

<div class="mx-auto max-w-7xl py-6">
	<h1 class="mb-6 text-center text-2xl font-bold text-gray-800">
		{data.title}
	</h1>

	<div class="w-full rounded-lg bg-white p-6 shadow-md">
		{#if data.d3Element}
			{#await data.d3Element then { default: D3 }}
				<D3 />
			{:catch error}
				<p class="text-red-600">{error.message}</p>
			{/await}
		{/if}
	</div>
</div>
