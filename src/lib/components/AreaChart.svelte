<script lang="ts">
	import { base } from '$app/paths'
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement

	interface DataPoint {
		date: Date
		close: number
	}

	$effect(() => {
		d3.select(chartArea).selectAll('*').remove()

		let width = 960
		let height = 500
		let margin = { top: 20, right: 20, bottom: 30, left: 60 }
		let innerWidth = width - margin.left - margin.right
		let innerHeight = height - margin.top - margin.bottom

		const svg = d3
			.select(chartArea)
			.append('svg')
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.style('width', '100%')
			.style('height', 'auto')
			.style('background', '#181A1B')

		let g = svg
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)

		let parseTime = d3.timeParse('%d-%b-%y')

		d3.tsv(`${base}/data/area.tsv`).then((data) => {
			let formattedData: DataPoint[] = data.map((d) => ({
				date: parseTime(d.date) as Date,
				close: +d.close
			}))

			let x = d3
				.scaleTime()
				.domain(d3.extent(formattedData, (d) => d.date) as [Date, Date])
				.range([0, innerWidth])

			let y = d3
				.scaleLinear()
				.domain([0, d3.max(formattedData, (d) => d.close) || 0])
				.range([innerHeight, 0])

			let area = d3
				.area<DataPoint>()
				.x((d) => x(d.date))
				.y0(innerHeight)
				.y1((d) => y(d.close))

			g.append('path')
				.datum(formattedData)
				.attr('fill', 'steelblue')
				.attr('opacity', 0.7)
				.attr('d', area)

			g.append('g')
				.attr('transform', `translate(0,${innerHeight})`)
				.call(d3.axisBottom(x))
				.style('color', 'white')

			g.append('g').call(d3.axisLeft(y)).style('color', 'white')

			g.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('x', -margin.top * 1.5)
				.attr('y', +margin.left * 0.5)
				.attr('text-anchor', 'middle')
				.attr('fill', 'white')
				.text('Price ($)')
		})
	})
</script>

<div class="flex w-full justify-center">
	<div
		class="w-full max-w-[960px] min-w-[500px] overflow-x-auto p-4"
		bind:this={chartArea}
	></div>
</div>
