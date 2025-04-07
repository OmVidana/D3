<script lang="ts">
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement
	$effect(() => {
		const svg = d3
			.select(chartArea)
			.append('svg')
			.attr('width', 400)
			.attr('height', 400)
			.style('border', '1px solid #f0f0f0')
			.style('background', '#f9f9f9')

		let circle = svg
			.append('circle')
			.attr('cx', 100)
			.attr('cy', 250)
			.attr('r', 70)
			.style('fill', 'blue')

		let rect = svg
			.append('rect')
			.attr('x', 20)
			.attr('y', 20)
			.attr('width', 20)
			.attr('height', 20)
			.style('fill', 'red')
	})
</script>

<div class="container">
	<div class="row">
		<div bind:this={chartArea} id="chart-area"></div>
	</div>
</div>
