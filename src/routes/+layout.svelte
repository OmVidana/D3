<script lang="ts">
	import { base } from '$app/paths'
	import type { Snippet } from 'svelte'
	import '../app.css'
	let props: { children: Snippet } = $props()
</script>

<svelte:head>
	<title>Vidaña - D3 Labs</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<nav class="bg-white shadow-lg">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<a
					href="{base}/"
					class="text-xl font-bold text-gray-800 hover:text-blue-600"
				>
					D3 Labs
				</a>
				<a
					href="https://www.linkedin.com/in/omar-vida%C3%B1a-rodr%C3%ADguez-85b88b293/"
					class="text-gray-600 hover:text-blue-600"
					target="_blank"
					rel="noopener noreferrer"
				>
					Omar Vidaña
				</a>
			</div>
		</div>
	</nav>

	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		{@render props.children?.()}
	</main>
</div>
