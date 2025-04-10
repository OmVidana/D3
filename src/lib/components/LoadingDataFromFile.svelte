<script lang="ts">
	import * as d3 from 'd3'
	let chartArea: HTMLDivElement

	$effect(() => {
		const svg = d3
			.select(chartArea)
			.append('svg')
			.attr('width', 400)
			.attr('height', 400)
			.style('border', '1px solid #f0f0f0')
			.style('background', '#f9f9f9')

		d3.csv('ages.csv').then((data: d3.DSVRowArray<string>) => {
			console.log(data)
		})

		d3.tsv('ages.tsv').then((data: d3.DSVRowArray<string>) => {
			console.log(data)
		})

		d3.json('ages.json').then((data: any | null) => {
			console.log(data)
		})

		d3.json('ages.json').then((data: any | null) => {
			type JsonElement = { name: string; age: number }
			let JsonData = data as Array<JsonElement> | null
			JsonData?.forEach((element: JsonElement, index: number) => {
				element.age = +element.age

				svg
					.append('circle')
					.attr('cx', 100 + index * 50)
					.attr('cy', 200)
					.attr('r', element.age * 2)
					.style('fill', 'steelblue')
					.style('opacity', 0.5)
			})
			console.log(JsonData)
		})
	})
</script>

<div class="flex w-full justify-center">
	<div class="w-full max-w-[400px]" bind:this={chartArea}></div>
</div>
