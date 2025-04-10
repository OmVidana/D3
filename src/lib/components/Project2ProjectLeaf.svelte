<script lang="ts">
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement
	let time = $state(0)

	interface Country {
		country: string
		continent: string
		income: number
		life_exp: number
		population: number
	}

	interface YearData {
		year: number
		countries: Country[]
	}

	$effect(() => {
		d3.select(chartArea).selectAll('*').remove()

		let width = 960
		let height = 500
		let margin = { top: 40, right: 40, bottom: 60, left: 80 }
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

		let x = d3.scaleLog().domain([142, 150000]).range([0, innerWidth])
		let y = d3.scaleLinear().domain([0, 90]).range([innerHeight, 0])
		let area = d3
			.scaleLinear()
			.domain([2000, 1400000000])
			.range([25 * Math.PI, 1500 * Math.PI])
		let color = d3.scaleOrdinal(d3.schemePastel1)

		let xAxis = d3
			.axisBottom(x)
			.tickValues([400, 4000, 40000])
			.tickFormat((d) => `$${d}`)
		let yAxis = d3.axisLeft(y).ticks(9)

		g.append('g')
			.attr('transform', `translate(0,${innerHeight})`)
			.call(xAxis)
			.style('color', 'white')

		g.append('g').call(yAxis).style('color', 'white')

		g.append('text')
			.attr('x', innerWidth / 2)
			.attr('y', innerHeight + 40)
			.attr('text-anchor', 'middle')
			.attr('fill', 'white')
			.text('GDP Per Capita ($)')

		g.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -60)
			.attr('x', -innerHeight / 2)
			.attr('text-anchor', 'middle')
			.attr('fill', 'white')
			.text('Life Expectancy (years)')

		let yearLabel = g
			.append('text')
			.attr('x', innerWidth - 20)
			.attr('y', innerHeight - 10)
			.attr('text-anchor', 'end')
			.attr('fill', 'white')
			.style('font-size', '24px')
			.style('font-weight', 'bold')

		let legend = svg
			.append('g')
			.attr('transform', `translate(${innerWidth + 48}, ${innerHeight - 96})`)
			.style('fill', 'white')

		d3.json<YearData[]>('data/data.json').then((data) => {
			if (!data) return

			let formattedData = data.map((year) => ({
				year: year.year,
				countries: year.countries
					.filter((country) => country.income && country.life_exp)
					.map((country) => ({
						...country,
						income: +country.income,
						life_exp: +country.life_exp,
						population: +country.population
					}))
			}))

			let continents = [
				...new Set(formattedData[0].countries.map((d) => d.continent))
			]
			color.domain(continents)

			continents.forEach((continent, i) => {
				let legendRow = legend
					.append('g')
					.attr('transform', `translate(0, ${i * 25})`)

				legendRow
					.append('text')
					.attr('x', -10)
					.attr('y', 9)
					.attr('text-anchor', 'end')
					.text(continent.charAt(0).toUpperCase() + continent.slice(1))

				legendRow
					.append('rect')
					.attr('x', 0)
					.attr('width', 10)
					.attr('height', 10)
					.attr('fill', color(continent))
			})

			function update(data: YearData) {
				let circles = g
					.selectAll<SVGCircleElement, Country>('circle.datapoint')
					.data(data.countries, (d) => d.country)

				circles.exit().remove()

				circles
					.enter()
					.append('circle')
					.attr('class', 'datapoint')
					.merge(circles)
					.transition()
					.duration(900)
					.attr('cx', (d) => x(d.income))
					.attr('cy', (d) => y(d.life_exp))
					.attr('r', (d) => Math.sqrt(area(d.population) / Math.PI))
					.attr('fill', (d) => color(d.continent))
					.attr('opacity', 0.7)

				yearLabel.text(data.year.toString())
			}

			let interval = d3.interval(() => {
				update(formattedData[time])
				time = (time + 1) % formattedData.length
			}, 1000)

			update(formattedData[0])

			return () => interval.stop()
		})
	})
</script>

<div class="flex w-full justify-center">
	<div
		class="w-full max-w-[960px] min-w-[500px] overflow-x-auto p-4"
		bind:this={chartArea}
	></div>
</div>
