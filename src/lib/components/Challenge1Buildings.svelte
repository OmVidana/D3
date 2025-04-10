<script lang="ts">
	import { base } from '$app/paths'
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement

	$effect(() => {
		const width = 1000
		const height = 600
		const margin = { top: 20, right: 20, bottom: 100, left: 60 }

		const svg = d3
			.select(chartArea)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.style('background', '#f9f9f9')

		d3.json(`${base}/data/buildings.json`).then((data: any | null) => {
			type JsonElement = { name: string; height: number; country: string }
			let JsonData = data as Array<JsonElement> | null
			JsonData?.forEach((d) => {
				d.height = +d.height
			})

			const x = d3
				.scaleBand()
				.domain(JsonData?.map((d) => d.name) || [])
				.range([margin.left, width - margin.right])
				.padding(0.2)

			const y = d3
				.scaleLinear()
				.domain([0, d3.max(JsonData || [], (d) => d.height) || 0])
				.range([height - margin.bottom, margin.top])

			const g = svg.append('g')

			g.selectAll('rect')
				.data(JsonData!)
				.join('rect')
				.attr('x', (d) => x(d.name)!)
				.attr('y', (d) => y(d.height))
				.attr('width', x.bandwidth())
				.attr('height', (d) => height - margin.bottom - y(d.height))
				.attr('fill', 'steelblue')

			g.append('g')
				.attr('transform', `translate(0,${height - margin.bottom})`)
				.call(d3.axisBottom(x))
				.selectAll('text')
				.attr('transform', 'rotate(-45)')
				.style('text-anchor', 'end')
				.attr('dx', '-0.8em')
				.attr('dy', '0.15em')

			g.append('g')
				.attr('transform', `translate(${margin.left},0)`)
				.call(d3.axisLeft(y))
		})
	})
</script>

<div class="flex w-full justify-center overflow-auto">
	<div class="w-[1000px]" bind:this={chartArea}></div>
</div>
