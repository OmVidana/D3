<script lang="ts">
	import type { PageProps } from './$types'
	let { data }: PageProps = $props()
</script>

<h1>{data.title}</h1>
{#if data.d3Element}
	{#await data.d3Element then { default: D3 }}
		<D3 />
	{:catch error}
		<p>{error.message}</p>
	{/await}
{/if}
