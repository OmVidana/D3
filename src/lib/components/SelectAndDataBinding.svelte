<script lang="ts">
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement
	let widthRectangles: number[] = [25, 20, 15, 10, 5]
	$effect(() => {
		const svg = d3
			.select(chartArea)
			.append('svg')
			.attr('width', 400)
			.attr('height', 400)
			.style('border', '1px solid #f0f0f0')
			.style('background', '#f9f9f9')

		widthRectangles.forEach((height: number) => {
			let x: number = Math.floor(Math.random() * 376)
			let y: number = Math.floor(Math.random() * 376)
			let color: string = d3.schemeCategory10[Math.floor(Math.random() * 10)]
			svg
				.append('rect')
				.attr('x', x)
				.attr('y', y)
				.attr('width', 40)
				.attr('height', height)
				.style('fill', color)
		})
	})
</script>

<div class="flex w-full justify-center">
	<div class="w-full max-w-[500px]" bind:this={chartArea}></div>
</div>
