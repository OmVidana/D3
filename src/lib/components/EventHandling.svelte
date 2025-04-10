<script lang="ts">
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement

	let isPlaying = $state(true)
	let time = $state(0)
	let selectedContinent = $state('all')
	let interval: d3.Timer | null = $state(null)
	let formattedData: YearData[] = $state([])

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

	let update: (data: YearData) => void

	function startInterval() {
		if (interval) interval.stop()
		interval = d3.interval(() => {
			time = (time + 1) % formattedData.length
		}, 1000)
	}

	function togglePlay() {
		isPlaying = !isPlaying
		if (isPlaying) {
			startInterval()
		} else if (interval) {
			interval.stop()
			interval = null
		}
	}

	function reset() {
		time = 0
		if (!isPlaying) {
			isPlaying = true
			startInterval()
		}
	}

	$effect(() => {
		if (formattedData.length && update) {
			update(formattedData[time])
		}
	})

	$effect(() => {
		if (formattedData.length && update) {
			update(formattedData[time])
		}
	})

	$effect(() => {
		d3.select(chartArea).selectAll('*').remove()

		const width = 960
		const height = 500
		const margin = { top: 40, right: 40, bottom: 100, left: 80 }
		const innerWidth = width - margin.left - margin.right
		const innerHeight = height - margin.top - margin.bottom

		const svg = d3
			.select(chartArea)
			.append('svg')
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.style('background', '#181A1B')

		const g = svg
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)

		const x = d3.scaleLog().domain([142, 150000]).range([0, innerWidth])

		const y = d3.scaleLinear().domain([0, 90]).range([innerHeight, 0])

		const area = d3
			.scaleLinear()
			.domain([2000, 1400000000])
			.range([25 * Math.PI, 1500 * Math.PI])

		const color = d3.scaleOrdinal(d3.schemePastel1)

		const xAxis = d3
			.axisBottom(x)
			.tickValues([400, 4000, 40000])
			.tickFormat((d) => `$${d}`)

		const yAxis = d3.axisLeft(y).ticks(9)

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

		const yearLabel = g
			.append('text')
			.attr('x', innerWidth - 20)
			.attr('y', innerHeight - 10)
			.attr('text-anchor', 'end')
			.attr('fill', 'white')
			.style('font-size', '24px')
			.style('font-weight', 'bold')

		const tooltip = d3
			.select(chartArea)
			.append('div')
			.attr('class', 'tooltip')
			.style('opacity', 0)
			.style('position', 'absolute')
			.style('background-color', 'white')
			.style('border', 'solid')
			.style('border-width', '1px')
			.style('border-radius', '5px')
			.style('padding', '10px')

		d3.json<YearData[]>('data/data.json').then((data) => {
			if (!data) return

			formattedData = data.map((year) => ({
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

			const continents = [
				...new Set(formattedData[0].countries.map((d) => d.continent))
			]
			color.domain(continents)

			const legend = svg
				.append('g')
				.attr('transform', `translate(${innerWidth + 48}, ${innerHeight - 96})`)
				.style('fill', 'white')

			continents.forEach((continent, i) => {
				const legendRow = legend
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

			update = (data: YearData) => {
				const filteredCountries =
					selectedContinent === 'all'
						? data.countries
						: data.countries.filter((d) => d.continent === selectedContinent)

				const circles = g
					.selectAll<SVGCircleElement, Country>('circle')
					.data(filteredCountries, (d) => d.country)

				circles.exit().transition().duration(900).attr('r', 0).remove()

				const circlesEnter = circles
					.enter()
					.append('circle')
					.attr('cx', (d) => x(d.income))
					.attr('cy', (d) => y(d.life_exp))
					.attr('r', 0)
					.attr('fill', (d) => color(d.continent))
					.attr('opacity', 0.7)

				circles
					.merge(circlesEnter)
					.on('mouseover', (event, d) => {
						tooltip.transition().duration(200).style('opacity', 0.9)
						tooltip
							.html(
								`
                            Country: ${d.country}<br/>
                            Continent: ${d.continent}<br/>
                            Income: $${d.income.toFixed(0)}<br/>
                            Life Exp: ${d.life_exp.toFixed(1)}<br/>
                            Population: ${d3.format(',')(d.population)}
                        `
							)
							.style('left', `${event.pageX + 10}px`)
							.style('top', `${event.pageY - 28}px`)
					})
					.on('mouseout', () => {
						tooltip.transition().duration(500).style('opacity', 0)
					})
					.transition()
					.duration(900)
					.attr('cx', (d) => x(d.income))
					.attr('cy', (d) => y(d.life_exp))
					.attr('r', (d) => Math.sqrt(area(d.population) / Math.PI))
					.attr('fill', (d) => color(d.continent))
					.attr('opacity', 0.7)

				yearLabel.text(data.year.toString())
			}

			update(formattedData[0])

			if (isPlaying) {
				startInterval()
			}

			return () => {
				if (interval) interval.stop()
			}
		})
	})
</script>

<div class="flex w-full flex-col items-center gap-4">
	<div class="flex gap-4">
		<button
			class="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			onclick={togglePlay}
		>
			{isPlaying ? 'Pause' : 'Play'}
		</button>
		<button
			class="rounded-md bg-gray-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
			onclick={reset}
		>
			Reset
		</button>
		<select
			class="rounded-md border-0 bg-white px-8 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			bind:value={selectedContinent}
		>
			<option value="all">All Continents</option>
			<option value="africa">Africa</option>
			<option value="americas">Americas</option>
			<option value="asia">Asia</option>
			<option value="europe">Europe</option>
		</select>
	</div>

	<input
		type="range"
		min="0"
		max="214"
		bind:value={time}
		class="h-2 w-full max-w-[600px] cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500 hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
	/>

	<div
		class="w-full max-w-[960px] min-w-[500px] overflow-x-auto p-4"
		bind:this={chartArea}
	></div>
</div>

<style>
	:global(.tooltip) {
		@apply pointer-events-none z-50;
	}
</style>
