<script lang="ts">
	import { base } from '$app/paths'
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement
	let flag = $state(true)

	$effect(() => {
		let margin = { top: 20, right: 20, bottom: 80, left: 60 }
		let width = 600 - margin.left - margin.right
		let height = 400 - margin.top - margin.bottom

		const svg = d3
			.select(chartArea)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.style('background', '#f9f9f9')

		let g = svg
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)

		let x = d3.scaleBand().range([0, width]).padding(0.2)
		let y = d3.scaleLinear().range([height, 0])

		let xAxisGroup = g.append('g').attr('transform', `translate(0, ${height})`)
		let yAxisGroup = g.append('g')

		let yLabel = g
			.append('text')
			.attr('y', -40)
			.attr('x', -height / 2)
			.attr('transform', 'rotate(-90)')
			.attr('text-anchor', 'middle')
			.style('fill', 'black')
			.text('Revenue')

		d3.json(`${base}/data/revenues.json`).then((data: any) => {
			data.forEach((d: any) => {
				d.revenue = +d.revenue
				d.profit = +d.profit
			})

			update(data)

			d3.interval(() => {
				flag = !flag
				update(data)
			}, 1000)
		})

		function update(data: any[]) {
			let value = flag ? 'revenue' : 'profit'

			x.domain(data.map((d) => d.month))
			y.domain([0, d3.max(data, (d) => d[value]) || 0])

			let xAxisCall = d3.axisBottom(x)
			let yAxisCall = d3.axisLeft(y).tickFormat((d) => `$${+d / 1000}K`)
			xAxisGroup.call(xAxisCall)
			yAxisGroup.call(yAxisCall)

			yLabel.text(flag ? 'Revenue' : 'Profit')

			let bars = g.selectAll('rect').data(data)

			bars.exit().remove()

			bars
				.attr('x', (d) => x(d.month)!)
				.attr('y', (d) => y(d[value]))
				.attr('width', x.bandwidth())
				.attr('height', (d) => height - y(d[value]))
				.attr('fill', 'steelblue')

			bars
				.enter()
				.append('rect')
				.attr('x', (d) => x(d.month)!)
				.attr('y', (d) => y(d[value]))
				.attr('width', x.bandwidth())
				.attr('height', (d) => height - y(d[value]))
				.attr('fill', 'steelblue')
		}
	})
</script>

<div class="flex w-full justify-center">
	<div class="w-full max-w-[600px]" bind:this={chartArea}></div>
</div>
