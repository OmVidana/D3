<script lang="ts">
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement

	interface DataPoint {
		date: string
		[key: string]: string | number
	}

	type Series = d3.Series<DataPoint, string>
	type SeriesPoint = d3.SeriesPoint<DataPoint>

	$effect(() => {
		d3.select(chartArea).selectAll('*').remove()

		let width = 960
		let height = 500
		let margin = { top: 20, right: 160, bottom: 30, left: 60 }
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

		let parseDate = d3.timeParse('%Y')
		let formatBillion = (x: number) => `${(x / 1e9).toFixed(1)}`

		d3.csv('data/stacked_area2.csv').then((data) => {
			let keys = data.columns.filter((key) => key !== 'date')
			let color = d3.scaleOrdinal(d3.schemeSpectral[11]).domain(keys)

			let formattedData = data.map((d) => {
				let obj: DataPoint = { date: d.date }
				keys.forEach((key) => {
					obj[key] = +d[key]!
				})
				return obj
			})

			let maxDateVal =
				d3.max(formattedData, (d) => {
					let vals = keys.map((key) => d[key] as number)
					return d3.sum(vals)
				}) || 0

			let x = d3
				.scaleTime()
				.domain(
					d3.extent(formattedData, (d) => parseDate(d.date)) as [Date, Date]
				)
				.range([0, innerWidth])

			let y = d3.scaleLinear().domain([0, maxDateVal]).range([innerHeight, 0])

			let area = d3
				.area<SeriesPoint>()
				.x((d) => x(parseDate((d.data as DataPoint).date)!))
				.y0((d) => y(d[0]))
				.y1((d) => y(d[1]))

			let stack = d3
				.stack<DataPoint>()
				.keys(keys)
				.order(d3.stackOrderNone)
				.offset(d3.stackOffsetNone)

			let browser = g
				.selectAll<SVGGElement, Series>('.browser')
				.data(stack(formattedData))
				.enter()
				.append('g')
				.attr('class', 'browser')
				.attr('fill', (d) => color(d.key))

			browser
				.append('path')
				.attr('class', 'area')
				.attr('d', area)
				.style('opacity', 0.7)

			g.append('g')
				.attr('transform', `translate(0,${innerHeight})`)
				.call(d3.axisBottom(x))
				.style('color', 'white')

			g.append('g')
				.call(d3.axisLeft(y).tickFormat((d) => formatBillion(+d)))
				.style('color', 'white')

			g.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('x', -margin.top * 5)
				.attr('y', +margin.left * 0.35)
				.attr('text-anchor', 'start')
				.attr('fill', 'white')
				.style('font-size', '14px')
				.text('Billions of liters')

			let legend = g
				.append('g')
				.attr(
					'transform',
					`translate(${innerWidth * 1.175},${innerHeight * 0.55})`
				)

			let legendKeys = [...keys].reverse()

			legend
				.selectAll('.legendGroup')
				.data(legendKeys)
				.enter()
				.append('g')
				.attr('class', 'legendGroup')
				.attr('transform', (_, i) => `translate(0,${i * 20})`)
				.each(function (d) {
					const g = d3.select(this)
					g.append('text')
						.text(d)
						.style('font-size', '12px')
						.style('fill', 'white')
						.attr('x', -10)
						.attr('y', 10)
						.attr('text-anchor', 'end')

					g.append('rect')
						.attr('width', 10)
						.attr('height', 10)
						.attr('fill', color(d))
						.attr('x', 0)
						.style('opacity', 0.7)
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
