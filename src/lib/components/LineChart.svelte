<script lang="ts">
	import { base } from '$app/paths'
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement

	interface DataPoint {
		year: string
		value: number
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

		d3.json<DataPoint[]>(`${base}/data/example.json`).then((data) => {
			if (!data) return

			let formattedData = data.map((d) => ({
				year: d.year,
				value: +d.value
			}))

			let x = d3
				.scalePoint<string>()
				.domain(formattedData.map((d) => d.year))
				.range([0, innerWidth])
				.padding(0.5)

			let y = d3.scaleLinear().domain([765000, 790000]).range([innerHeight, 0])

			let line = d3
				.line<DataPoint>()
				.x((d) => x(d.year) || 0)
				.y((d) => y(d.value))

			g.append('path')
				.datum(formattedData)
				.attr('class', 'line')
				.attr('fill', 'none')
				.attr('stroke', 'white')
				.attr('stroke-width', 2)
				.attr('d', line)

			g.append('g')
				.attr('transform', `translate(0,${innerHeight})`)
				.call(d3.axisBottom(x))
				.style('color', 'white')

			g.append('g')
				.call(
					d3
						.axisLeft(y)
						.tickFormat((d) => `${(+d / 1000).toFixed(0)}k`)
						.tickValues([770000, 775000, 780000, 785000])
				)
				.style('color', 'white')

			g.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('x', -margin.top * 3.5)
				.attr('y', margin.left * 0.5)
				.attr('text-anchor', 'start')
				.attr('fill', 'white')
				.style('font-size', '14px')
				.text('Population')

			let circles = g
				.selectAll<SVGCircleElement, DataPoint>('circle')
				.data(formattedData)
				.enter()
				.append('circle')
				.attr('cx', (d) => x(d.year) || 0)
				.attr('cy', (d) => y(d.value))
				.attr('r', 4)
				.attr('fill', 'white')
				.attr('stroke', 'white')
				.attr('stroke-width', 1)

			let tooltip = g.append('g').style('display', 'none')

			circles
				.on('mouseover', function (event: MouseEvent, d: DataPoint) {
					d3.select(this).transition().duration(200).attr('r', 6)

					tooltip
						.style('display', null)
						.attr('transform', `translate(${x(d.year)},${y(d.value)})`)

					tooltip.selectAll('text').remove()
					tooltip
						.append('text')
						.attr('y', -10)
						.attr('text-anchor', 'middle')
						.attr('fill', 'white')
						.text(`${d.year}: ${d.value.toLocaleString()}`)
				})
				.on('mouseout', function () {
					d3.select(this).transition().duration(200).attr('r', 4)
					tooltip.style('display', 'none')
				})
		})
	})
</script>

<div class="flex w-full justify-center">
	<div
		class="w-full max-w-[960px] min-w-[500px] overflow-x-auto p-4"
		bind:this={chartArea}
	></div>
</div>
