<script lang="ts">
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement

	$effect(() => {
		const svg = d3
			.select(chartArea)
			.append('svg')
			.attr('width', 1000)
			.attr('height', 1000)
			.style('border', '1px solid #f0f0f0')
			.style('background', '#f9f9f9')

		d3.json('data/buildings.json').then((data: any | null) => {
			type JsonElement = { name: string; height: number; country: string }
			let JsonData = data as Array<JsonElement> | null
			let barWidth = JsonData ? (1000 / JsonData.length) * 0.8 : 0
			let barSpacing = JsonData ? (1000 / JsonData.length) * 0.2 : 0
			JsonData?.forEach((element: JsonElement, index: number) => {
				element.height = +element.height
				console.log(element.height)
				svg
					.append('rect')
					.attr('x', (index + 0.1) * (barWidth + barSpacing))
					.attr('y', 990 - element.height)
					.attr('width', barWidth)
					.attr('height', element.height)
					.attr('fill', 'steelblue')
			})
		})
	})
</script>

<div class="container">
	<div class="row">
		<div bind:this={chartArea} id="chart-area"></div>
	</div>
</div>
