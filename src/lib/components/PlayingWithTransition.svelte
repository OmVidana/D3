<script lang="ts">
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement
	let flag = $state(true)

	interface RevenueData {
		month: string
		revenue: number
		profit: number
		[key: string]: number | string
	}

	$effect(() => {
		d3.select(chartArea).selectAll('*').remove()

		let margin = { top: 20, right: 20, bottom: 80, left: 60 }
		let width = 600 - margin.left - margin.right
		let height = 400 - margin.top - margin.bottom

		const svg = d3
			.select(chartArea)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.style('background', '#181A1B')

		let g = svg
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)

		let x = d3.scaleBand().range([0, width]).padding(0.2)
		let y = d3.scaleLinear().range([height, 0])

		let xAxisGroup = g
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.attr('class', 'x-axis')
			.style('color', 'white')

		let yAxisGroup = g
			.append('g')
			.attr('class', 'y-axis')
			.style('color', 'white')

		let yLabel = g
			.append('text')
			.attr('y', -60)
			.attr('x', -(height / 2))
			.attr('text-anchor', 'middle')
			.attr('transform', 'rotate(-90)')
			.attr('fill', 'white')
			.text('Revenue')

		d3.json<RevenueData[]>('data/revenues.json').then((data) => {
			if (!data) return

			data.forEach((d) => {
				d.revenue = +d.revenue
				d.profit = +d.profit
			})

			function update(data: RevenueData[]) {
				let value = flag ? 'revenue' : 'profit'
				let t = d3.transition().duration(750)

				x.domain(data.map((d) => d.month))
				y.domain([0, d3.max(data, (d) => d[value] as number) || 0])

				let xAxisCall = d3.axisBottom(x)
				let yAxisCall = d3.axisLeft(y).tickFormat((d) => `$${+d / 1000}K`)

				xAxisGroup
					.transition(t)
					.call(xAxisCall)
					.selectAll('text')
					.attr('y', 10)
					.attr('x', -5)
					.attr('text-anchor', 'end')
					.attr('transform', 'rotate(-40)')

				yAxisGroup.transition(t).call(yAxisCall)

				let rects = g
					.selectAll<SVGRectElement, RevenueData>('rect')
					.data(data, (d) => d.month)

				rects
					.exit()
					.attr('fill', '#ff6b6b')
					.transition(t)
					.attr('y', y(0))
					.attr('height', 0)
					.remove()

				rects
					.enter()
					.append('rect')
					.attr('fill', '#69b3a2')
					.attr('y', y(0))
					.attr('height', 0)
					.attr('x', (d) => x(d.month)!)
					.attr('width', x.bandwidth())
					.merge(rects)
					.transition(t)
					.attr('x', (d) => x(d.month)!)
					.attr('width', x.bandwidth())
					.attr('y', (d) => y(d[value] as number))
					.attr('height', (d) => height - y(d[value] as number))

				let label = flag ? 'Revenue' : 'Profit'
				yLabel.text(label)
			}

			update(data)

			d3.interval(() => {
				let newData = flag ? data : data.slice(1)
				update(newData)
				flag = !flag
			}, 1000)
		})
	})
</script>

<div class="flex w-full justify-center">
	<div class="w-full max-w-[600px]" bind:this={chartArea}></div>
</div>
