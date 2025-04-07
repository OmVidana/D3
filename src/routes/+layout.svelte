<script lang="ts">
	import type { Snippet } from 'svelte'

	let props: { children: Snippet } = $props()
</script>

<svelte:head>
	<title>Vidaña - D3 Labs</title>
</svelte:head>

<nav>
	<div>
		<a href="/">D3 Labs</a>
		<a href="https://www.linkedin.com/in/omar-vida%C3%B1a-rodr%C3%ADguez-85b88b293/">Omar Vidaña</a>
	</div>
</nav>
{@render props.children?.()}
