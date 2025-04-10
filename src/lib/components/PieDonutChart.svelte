<script lang="ts">
	import { base } from '$app/paths'
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement

	interface FruitData {
		fruit: string
		region: string
		count: number
	}

	interface NestedData {
		key: string
		values: FruitData[]
	}

	interface CustomSVGPathElement extends SVGPathElement {
		_current: d3.PieArcDatum<FruitData>
	}

	$effect(() => {
		d3.select(chartArea).selectAll('*').remove()

		let width = 960
		let height = 500
		let margin = { top: 20, right: 120, bottom: 30, left: 60 }
		let radius =
			Math.min(
				width - margin.left - margin.right,
				height - margin.top - margin.bottom
			) / 2

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
			.attr('transform', `translate(${width / 2},${height / 2})`)

		let color = d3.scaleOrdinal<string>(d3.schemeSpectral[11])

		let arc = d3
			.arc<d3.PieArcDatum<FruitData>>()
			.innerRadius(radius * 0.4)
			.outerRadius(radius * 0.8)

		let pie = d3
			.pie<FruitData>()
			.value((d) => d.count)
			.sort(null)

		d3.tsv(`${base}/data/donut2.tsv`).then((data) => {
			let formattedData = data.map((d) => ({
				fruit: d.fruit.toLowerCase(),
				region: d.region,
				count: +d.count
			}))

			let fruits = Array.from(new Set(formattedData.map((d) => d.fruit)))
			let fruitData = fruits.map((fruit) => ({
				key: fruit,
				values: formattedData.filter((d) => d.fruit === fruit)
			}))

			let form = d3
				.select(chartArea)
				.insert('div', 'svg')
				.attr('class', 'flex justify-center items-center gap-6 mb-6')
				.append('form')
				.attr('class', 'flex gap-6')

			let label = form
				.selectAll('label')
				.data(fruitData)
				.enter()
				.append('label')
				.attr('class', 'flex items-center gap-2 cursor-pointer')

			let inputContainer = label
				.append('div')
				.attr('class', 'flex items-center gap-2')

			inputContainer
				.append('input')
				.attr('type', 'radio')
				.attr('name', 'fruit')
				.attr('class', 'hidden peer')
				.attr('id', (d) => `radio-${d.key}`)
				.attr('value', (d) => d.key)
				.on('change', function () {
					update(fruitData.find((d) => d.key === this.value)!)
				})
				.filter((_, i) => i === 0)
				.property('checked', true)

			inputContainer
				.append('label')
				.attr('for', (d) => `radio-${d.key}`)
				.attr(
					'class',
					`
                    px-4 py-2 rounded-full border border-gray-400
                    peer-checked:bg-blue-500 peer-checked:border-blue-500 
                    peer-checked:text-white
                    transition-colors duration-200 uppercase text-sm
                    text-gray-400 hover:bg-blue-500/10 hover:border-blue-500/50
                `
				)
				.text(
					(d) => `${d.key.charAt(0).toUpperCase() + d.key.slice(1)} Regions`
				)

			function update(data: NestedData) {
				let paths = g
					.selectAll<CustomSVGPathElement, d3.PieArcDatum<FruitData>>('path')
					.data(pie(data.values))

				paths.exit().remove()

				paths
					.transition()
					.duration(750)
					.attrTween('d', function (d) {
						let interpolate = d3.interpolate(
							(this as CustomSVGPathElement)._current,
							d
						)
						;(this as CustomSVGPathElement)._current = interpolate(0)
						return (t) => arc(interpolate(t)) || ''
					})

				paths
					.enter()
					.append('path')
					.attr('fill', (d) => color(d.data.region))
					.attr('d', arc)
					.each(function (d) {
						;(this as CustomSVGPathElement)._current = d
					})
			}

			update(fruitData[0])
		})
	})
</script>

<div class="flex w-full justify-center">
	<div
		class="w-full max-w-[960px] min-w-[500px] overflow-x-auto p-4"
		bind:this={chartArea}
	></div>
</div>
