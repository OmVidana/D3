<script lang="ts">
	import { base } from '$app/paths'
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement

	$effect(() => {
		const svg = d3
			.select(chartArea)
			.append('svg')
			.attr('width', 500)
			.attr('height', 500)
			.style('background', '#181A1B')

		d3.json(`${base}/data/revenues.json`).then((data: any | null) => {
			type JsonElement = { month: string; revenue: number; profit: number }
			let JsonData = data as Array<JsonElement> | null
			JsonData?.forEach((d) => {
				d.revenue = +d.revenue
				d.profit = +d.profit
			})

			let margin = { top: 20, right: 20, bottom: 80, left: 60 }
			let width = 500 - margin.left - margin.right
			let height = 500 - margin.top - margin.bottom
			const maxRevenue = d3.max(JsonData || [], (d) => d.revenue) || 0
			const yDomainMax = Math.ceil(maxRevenue / 10000) * 10000

			let x = d3
				.scaleBand()
				.domain(JsonData?.map((d) => d.month) || [])
				.range([0, width])
				.paddingInner(0.3)
				.paddingOuter(0.3)

			let y = d3.scaleLinear().domain([0, yDomainMax]).range([height, 0])

			let g = svg
				.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`)

			g.append('text')
				.attr(
					'transform',
					`translate(${width / 2}, ${height + margin.bottom - 10})`
				)
				.style('text-anchor', 'middle')
				.style('fill', 'white')
				.text('Month')

			g.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('y', 0 - margin.left)
				.attr('x', 0 - height / 2)
				.attr('dy', '1em')
				.style('text-anchor', 'middle')
				.style('fill', 'white')
				.text('Revenue (dlls.)')

			g.selectAll('rect')
				.data(JsonData!)
				.enter()
				.append('rect')
				.attr('x', (d) => x(d.month)!)
				.attr('y', (d) => y(d.revenue))
				.attr('width', x.bandwidth())
				.attr('height', (d) => height - y(d.revenue))
				.attr('fill', '#CCCC00')

			let xAxis = d3.axisBottom(x)
			let yAxis = d3
				.axisLeft(y)
				.tickFormat((d) => `$${+d / 1000}K`)
				.ticks(10)

			g.append('g')
				.attr('transform', `translate(0, ${height})`)
				.call(xAxis)
				.selectAll('text')
				.style('text-anchor', 'middle')
				.style('fill', 'white')
				.attr('dy', '1em')

			g.append('g').call(yAxis).selectAll('text').style('fill', 'white')
			g.selectAll('.domain, .tick line').style('stroke', 'white')
		})
	})
</script>

<div class="mx-auto flex w-full max-w-[500px] flex-col">
	<nav class="flex h-[60px] w-full items-center bg-[#845a0b] px-4">
		<a href="." class="flex h-[50px] items-center">
			<img src="logo.png" alt="star-lion" class="h-full" />
		</a>
	</nav>
	<div class="w-full" bind:this={chartArea}></div>
</div>
