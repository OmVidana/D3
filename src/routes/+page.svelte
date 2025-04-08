<script>
	import { d3Pages } from '$lib'
</script>

<div class="links">
	{#each Object.entries(d3Pages) as [key, d3Page]}
		<a href={key}>{d3Page.title}</a>
	{/each}
</div>

<style>
	.links {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	a {
		text-decoration: none;
		color: blue;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
