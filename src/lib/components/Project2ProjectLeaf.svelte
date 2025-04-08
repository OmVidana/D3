<script lang="ts">
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement

	$effect(() => {
		// Clear previous SVG if any
		d3.select(chartArea).selectAll('*').remove()

		const width = 960
		const height = 500
		const margin = { top: 40, right: 150, bottom: 60, left: 80 }
		const innerWidth = width - margin.left - margin.right
		const innerHeight = height - margin.top - margin.bottom

		const svg = d3
			.select(chartArea)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.style('background', '#ffffff')

		const g = svg
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)

		// Scales
		const x = d3.scaleLog().domain([142, 150000]).range([0, innerWidth])

		const y = d3.scaleLinear().domain([0, 90]).range([innerHeight, 0])

		const area = d3
			.scaleLinear()
			.domain([2000, 1400000000])
			.range([25 * Math.PI, 1500 * Math.PI])

		const color = d3.scaleOrdinal(d3.schemePastel1)

		// Axes
		const xAxis = d3
			.axisBottom(x)
			.tickValues([400, 4000, 40000])
			.tickFormat((d) => `$${d}`)

		const yAxis = d3.axisLeft(y)

		// Add axes
		g.append('g')
			.attr('transform', `translate(0,${innerHeight})`)
			.call(xAxis)
			.attr('class', 'x-axis')

		g.append('g').call(yAxis).attr('class', 'y-axis')

		// Add labels
		g.append('text')
			.attr('x', innerWidth / 2)
			.attr('y', innerHeight + 40)
			.attr('text-anchor', 'middle')
			.text('Income per capita')

		g.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -60)
			.attr('x', -innerHeight / 2)
			.attr('text-anchor', 'middle')
			.text('Life Expectancy')

		const yearLabel = g
			.append('text')
			.attr('x', innerWidth - 50)
			.attr('y', 30)
			.attr('text-anchor', 'end')
			.attr('class', 'year-label')
			.style('font-size', '24px')
			.style('font-weight', 'bold')

		// Legend
		const legend = svg
			.append('g')
			.attr(
				'transform',
				`translate(${width - margin.right + 40},${margin.top})`
			)

		d3.json('data/data.json').then((data: any) => {
			// Clean and format data
			const formattedData = data.map((year: any) => {
				return {
					year: year.year,
					countries: year.countries
						.filter((country: any) => {
							const dataExists = country.income && country.life_exp
							return dataExists
						})
						.map((country: any) => {
							return {
								...country,
								income: +country.income,
								life_exp: +country.life_exp,
								population: +country.population
							}
						})
				}
			})

			// Get unique continents for legend
			const continents = [
				...new Set(formattedData[0].countries.map((d: any) => d.continent))
			]
			color.domain(continents)

			// Add legend
			continents.forEach((continent: string, i: number) => {
				const legendRow = legend
					.append('g')
					.attr('transform', `translate(0, ${i * 20})`)

				legendRow
					.append('circle')
					.attr('cx', 0)
					.attr('cy', 0)
					.attr('r', 5)
					.style('fill', color(continent))

				legendRow.append('text').attr('x', 10).attr('y', 5).text(continent)
			})

			let time = 0

			// Update function
			function update(data: any) {
				const circles = g
					.selectAll('circle')
					.data(data.countries, (d: any) => d.country)

				// Exit
				circles.exit().remove()

				// Enter
				circles
					.enter()
					.append('circle')
					.merge(circles as any)
					.transition()
					.duration(900)
					.attr('cx', (d: any) => x(d.income))
					.attr('cy', (d: any) => y(d.life_exp))
					.attr('r', (d: any) => Math.sqrt(area(d.population) / Math.PI))
					.attr('fill', (d: any) => color(d.continent))
					.attr('opacity', 0.7)

				yearLabel.text(data.year)
			}

			// Animation interval
			const interval = d3.interval(() => {
				update(formattedData[time])
				time = (time + 1) % formattedData.length
			}, 1000)

			// Initial render
			update(formattedData[0])

			// Cleanup on component unmount
			return () => interval.stop()
		})
	})
</script>

<div class="flex w-full justify-center overflow-x-auto">
	<div class="w-[960px]" bind:this={chartArea}></div>
</div>

<!-- <script lang="ts">
    import * as d3 from 'd3'
    let chartArea: HTMLDivElement

    $effect(() => {
        d3.select(chartArea).selectAll('*').remove()

        const width = 960
        const height = 500
        const margin = { top: 40, right: 150, bottom: 60, left: 80 }
        const innerWidth = width - margin.left - margin.right
        const innerHeight = height - margin.top - margin.bottom

        const svg = d3
            .select(chartArea)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
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
            .attr('class', 'x-axis')
            .style('color', 'white')

        g.append('g')
            .call(yAxis)
            .attr('class', 'y-axis')
            .style('color', 'white')

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

        const legend = svg
            .append('g')
            .attr('transform', `translate(${width - margin.right + 40},${margin.top})`)
            .style('fill', 'white')

        d3.json('data/data.json').then((data: any) => {
            const formattedData = data.map((year: any) => ({
                year: year.year,
                countries: year.countries
                    .filter((country: any) => country.income && country.life_exp)
                    .map((country: any) => ({
                        ...country,
                        income: +country.income,
                        life_exp: +country.life_exp,
                        population: +country.population
                    }))
            }))

            const continents = [...new Set(formattedData[0].countries.map((d: any) => d.continent))]
            color.domain(continents)

            continents.forEach((continent: string, i: number) => {
                const legendRow = legend
                    .append('g')
                    .attr('transform', `translate(0, ${i * 20})`)

                legendRow
                    .append('rect')
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('fill', color(continent))

                legendRow
                    .append('text')
                    .attr('x', 15)
                    .attr('y', 9)
                    .text(continent)
            })

            function update(data: any) {
                const squares = g
                    .selectAll('rect.datapoint')
                    .data(data.countries, (d: any) => d.country)

                squares.exit().remove()

                squares
                    .enter()
                    .append('rect')
                    .attr('class', 'datapoint')
                    .merge(squares as any)
                    .transition()
                    .duration(900)
                    .attr('x', (d: any) => x(d.income) - Math.sqrt(area(d.population) / Math.PI))
                    .attr('y', (d: any) => y(d.life_exp) - Math.sqrt(area(d.population) / Math.PI))
                    .attr('width', (d: any) => Math.sqrt(area(d.population) / Math.PI) * 2)
                    .attr('height', (d: any) => Math.sqrt(area(d.population) / Math.PI) * 2)
                    .attr('fill', (d: any) => color(d.continent))
                    .attr('opacity', 0.7)

                yearLabel.text(data.year)
            }

            const interval = d3.interval(() => {
                update(formattedData[time])
                time = (time + 1) % formattedData.length
            }, 1000)

            update(formattedData[0])

            return () => interval.stop()
        })
    })
</script>

<div class="flex w-full justify-center overflow-x-auto">
    <div class="w-[960px]" bind:this={chartArea}></div>
</div> -->
