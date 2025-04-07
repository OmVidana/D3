<script>
	import { d3Pages } from '$lib'
</script>

{#each Object.entries(d3Pages) as [key, d3Page]}
	<a href={key}>{d3Page.title}</a>
{/each}
