<script lang="ts">
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement

	$effect(() => {
		const svg = d3
			.select(chartArea)
			.append('svg')
			.attr('width', 500)
			.attr('height', 500)
			.style('border', '1px solid #f0f0f0')
			.style('background', '#f9f9f9')

		d3.json('data/buildings.json').then((data: any | null) => {
			type JsonElement = { name: string; height: number; country: string }
			let JsonData = data as Array<JsonElement> | null
			JsonData?.forEach((d) => {
				d.height = +d.height
			})

			let margin = { top: 20, right: 20, bottom: 80, left: 40 }
			let width = 500 - margin.left - margin.right
			let height = 500 - margin.top - margin.bottom

			let x = d3
				.scaleBand()
				.domain(JsonData?.map((d) => d.name) || [])
				.range([0, width])
				.paddingInner(0.3)
				.paddingOuter(0.3)

			let y = d3.scaleLinear().domain([0, 828]).range([height, 0])
			let color = d3.scaleOrdinal(d3.schemeSet3)

			let g = svg
				.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`)

			g.selectAll('rect')
				.data(JsonData!)
				.enter()
				.append('rect')
				.attr('x', (d) => x(d.name)!)
				.attr('y', (d) => y(d.height))
				.attr('width', x.bandwidth())
				.attr('height', (d) => height - y(d.height))
				.attr('fill', (d) => color(d.name) || 'black')

			g.selectAll('text')
				.data(JsonData!)
				.enter()
				.append('text')
				.attr('x', (d) => x(d.name)! + x.bandwidth() / 2)
				.attr('y', height + 20)
				.attr('text-anchor', 'middle')
				.text((d) => d.height)
				.attr('fill', 'black')

			let xAxis = d3.axisBottom(x)
			let yAxis = d3.axisLeft(y)

			g.append('g')
				.attr('transform', `translate(0, ${height})`)
				.call(xAxis)
				.selectAll('text')
				.attr('transform', 'rotate(-45)')
				.style('text-anchor', 'end')
				.style('font-size', '4px')
				.attr('y', 20)
				.attr('x', -20)

			g.append('g').call(yAxis)
		})
	})
</script>

<div class="container">
	<div class="row">
		<div bind:this={chartArea} id="chart-area"></div>
	</div>
</div>
