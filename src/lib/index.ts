// place files you want to import through the `$lib` alias in this folder.
export const d3Pages = {
	fundamentals: {
		title: 'D3 Fundamentals',
		d3Element: import('./components/Fundamentals.svelte')
	},
	selectAndDataBinding: {
		title: 'Select and Data Binding',
		d3Element: import('./components/SelectAndDataBinding.svelte')
	},
	loadingDataFromFile: {
		title: 'Loading Data From File',
		d3Element: import('./components/LoadingDataFromFile.svelte')
	},
	challenge1Buildings: {
		title: 'Challenge 1: Buildings of the World',
		d3Element: import('./components/Challenge1Buildings.svelte')
	},
	scales: {
		title: 'Scales',
		d3Element: import('./components/Scales.svelte')
	},
	marginsGroupsAxesLabels: {
		title: 'Margins, Groups, Axes and Labels',
		d3Element: import('./components/MarginsGroupsAxesLabels.svelte')
	},
	project1StarBrewery: {
		title: 'Project 1: Star Brewery',
		d3Element: import('./components/Project1StarBrewery.svelte')
	},
	simulatingUpdateEvents: {
		title: 'Simulating Update Events',
		d3Element: import('./components/SimulatingUpdateEvents.svelte')
	},
	playingWithTransition: {
		title: 'Playing With Transition',
		d3Element: import('./components/PlayingWithTransition.svelte')
	},
	project2ProjectLeaf: {
		title: 'Project 2: Project Leaf',
		d3Element: import('./components/Project2ProjectLeaf.svelte')
	},
	eventHandling: {
		title: 'Event Handling',
		d3Element: import('./components/EventHandling.svelte')
	},
	lineChart: {
		title: 'Line Chart',
		d3Element: import('./components/LineChart.svelte')
	},
	areaChart: {
		title: 'Area Chart',
		d3Element: import('./components/AreaChart.svelte')
	},
	stackedAreaChart: {
		title: 'Stacked Area Chart',
		d3Element: import('./components/StackedAreaChart.svelte')
	},
	pieDonutChart: {
		title: 'Pie/Donut Chart',
		d3Element: import('./components/PieDonutChart.svelte')
	}
}
