<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as d3 from 'd3';
	import type { FeatureRequest, GraphData, GraphNode, GraphLink } from '../../../types/brainstorm';
	import { t, getNestedTranslation } from '../../../lib/i18n';

	interface Props {
		features: FeatureRequest[];
	}

	let { features }: Props = $props();

	let svgElement: SVGSVGElement;
	let containerElement: HTMLDivElement;
	let simulation: d3.Simulation<GraphNode, GraphLink>;

	// Transform features into graph data
	function createGraphData(features: FeatureRequest[]): GraphData {
		const nodes: GraphNode[] = features.map(feature => ({
			id: feature.id,
			title: feature.title,
			category: feature.category,
			priority: feature.priority,
			status: feature.status,
			votes: feature.votes,
			complexity: feature.complexity
		}));

		const links: GraphLink[] = [];
		
		// Create dependency links
		features.forEach(feature => {
			if (feature.dependencies) {
				feature.dependencies.forEach(depId => {
					if (features.find(f => f.id === depId)) {
						links.push({
							source: depId,
							target: feature.id,
							type: 'dependency'
						});
					}
				});
			}
			
			// Create related feature links
			if (feature.relatedFeatures) {
				feature.relatedFeatures.forEach(relatedId => {
					if (features.find(f => f.id === relatedId)) {
						// Avoid duplicate links
						const existingLink = links.find(l => 
							(l.source === feature.id && l.target === relatedId) ||
							(l.source === relatedId && l.target === feature.id)
						);
						if (!existingLink) {
							links.push({
								source: feature.id,
								target: relatedId,
								type: 'related'
							});
						}
					}
				});
			}
		});

		return { nodes, links };
	}

	function getNodeColor(node: GraphNode): string {
		switch (node.status) {
			case 'requested': return '#9CA3AF'; // gray
			case 'in-review': return '#3B82F6'; // blue
			case 'approved': return '#10B981'; // green
			case 'in-progress': return '#F59E0B'; // yellow
			case 'completed': return '#8B5CF6'; // purple
			case 'rejected': return '#EF4444'; // red
			default: return '#6B7280';
		}
	}

	function getNodeSize(node: GraphNode): number {
		const baseSize = 8;
		const voteMultiplier = Math.min(node.votes * 2, 20);
		const priorityMultiplier = {
			'low': 1,
			'medium': 1.2,
			'high': 1.5,
			'critical': 2
		}[node.priority] || 1;
		
		return baseSize + voteMultiplier + (baseSize * priorityMultiplier * 0.5);
	}

	function getLinkColor(link: GraphLink): string {
		return link.type === 'dependency' ? '#EF4444' : '#6B7280';
	}

	function getLinkWidth(link: GraphLink): number {
		return link.type === 'dependency' ? 3 : 1;
	}

	function initializeGraph() {
		if (!svgElement || !containerElement) return;

		const graphData = createGraphData(features);
		if (graphData.nodes.length === 0) return;

		// Clear previous content
		d3.select(svgElement).selectAll("*").remove();

		const container = containerElement;
		const width = container.clientWidth;
		const height = container.clientHeight;

		const svg = d3.select(svgElement)
			.attr('width', width)
			.attr('height', height);

		// Create zoom behavior
		const zoom = d3.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.1, 4])
			.on('zoom', (event) => {
				g.attr('transform', event.transform);
			});

		svg.call(zoom);

		const g = svg.append('g');

		// Create arrow marker for dependencies
		svg.append('defs').append('marker')
			.attr('id', 'arrowhead')
			.attr('viewBox', '-0 -5 10 10')
			.attr('refX', 15)
			.attr('refY', 0)
			.attr('orient', 'auto')
			.attr('markerWidth', 8)
			.attr('markerHeight', 8)
			.attr('xoverflow', 'visible')
			.append('svg:path')
			.attr('d', 'M 0,-5 L 10 ,0 L 0,5')
			.attr('fill', '#EF4444')
			.style('stroke', 'none');

		// Create simulation
		simulation = d3.forceSimulation(graphData.nodes)
			.force('link', d3.forceLink(graphData.links).id((d: any) => d.id).distance(100))
			.force('charge', d3.forceManyBody().strength(-300))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('collision', d3.forceCollide().radius((d: any) => getNodeSize(d) + 5));

		// Create links
		const link = g.append('g')
			.attr('class', 'links')
			.selectAll('line')
			.data(graphData.links)
			.enter().append('line')
			.attr('stroke', (d: GraphLink) => getLinkColor(d))
			.attr('stroke-width', (d: GraphLink) => getLinkWidth(d))
			.attr('stroke-dasharray', (d: GraphLink) => d.type === 'related' ? '5,5' : 'none')
			.attr('marker-end', (d: GraphLink) => d.type === 'dependency' ? 'url(#arrowhead)' : 'none');

		// Create nodes
		const node = g.append('g')
			.attr('class', 'nodes')
			.selectAll('g')
			.data(graphData.nodes)
			.enter().append('g')
			.attr('class', 'node')
			.call(d3.drag<SVGGElement, GraphNode>()
				.on('start', dragstarted)
				.on('drag', dragged)
				.on('end', dragended));

		// Add circles for nodes
		node.append('circle')
			.attr('r', (d: GraphNode) => getNodeSize(d))
			.attr('fill', (d: GraphNode) => getNodeColor(d))
			.attr('stroke', '#fff')
			.attr('stroke-width', 2);

		// Add category icons
		node.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '.35em')
			.style('font-size', '12px')
			.text((d: GraphNode) => getNestedTranslation('categoryIcons', d.category));

		// Add labels with better Thai text handling
		node.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', (d: GraphNode) => getNodeSize(d) + 15)
			.style('font-size', '10px')
			.style('fill', '#374151')
			.style('font-family', 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"')
			.text((d: GraphNode) => {
				// Better Thai text truncation
				const maxLength = 15;
				if (d.title.length > maxLength) {
					return d.title.substring(0, maxLength) + '...';
				}
				return d.title;
			});

		// Add priority indicators
		node.append('circle')
			.attr('r', 4)
			.attr('cx', (d: GraphNode) => getNodeSize(d) - 5)
			.attr('cy', (d: GraphNode) => -getNodeSize(d) + 5)
			.attr('fill', (d: GraphNode) => {
				switch (d.priority) {
					case 'low': return '#10B981';
					case 'medium': return '#F59E0B';
					case 'high': return '#F97316';
					case 'critical': return '#EF4444';
					default: return '#6B7280';
				}
			})
			.attr('stroke', '#fff')
			.attr('stroke-width', 1);

		// Add vote count
		node.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', (d: GraphNode) => -getNodeSize(d) - 8)
			.style('font-size', '8px')
			.style('fill', '#6B7280')
			.text((d: GraphNode) => `👍 ${d.votes}`);

		// Add tooltips with better Thai formatting
		node.append('title')
			.text((d: GraphNode) => {
				const feature = features.find(f => f.id === d.id);
				const tooltip = [
					d.title,
					`${t('category')}: ${t(d.category as any)}`,
					`${t('priority')}: ${t(d.priority as any)}`,
					`${t('status')}: ${t(d.status as any)}`,
					`${t('votes')}: ${d.votes} คะแนน`
				];
				
				if (feature?.description) {
					tooltip.push('');
					tooltip.push(feature.description);
				}
				
				return tooltip.join('\n');
			});

		// Update positions on simulation tick
		simulation.on('tick', () => {
			link
				.attr('x1', (d: any) => d.source.x)
				.attr('y1', (d: any) => d.source.y)
				.attr('x2', (d: any) => d.target.x)
				.attr('y2', (d: any) => d.target.y);

			node
				.attr('transform', (d: GraphNode) => `translate(${d.x},${d.y})`);
		});

		// Drag functions
		function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
			d.fx = event.x;
			d.fy = event.y;
		}

		function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}
	}

	function handleResize() {
		if (containerElement && svgElement) {
			const width = containerElement.clientWidth;
			const height = containerElement.clientHeight;
			d3.select(svgElement).attr('width', width).attr('height', height);
			
			if (simulation) {
				simulation.force('center', d3.forceCenter(width / 2, height / 2));
				simulation.alpha(0.3).restart();
			}
		}
	}

	function zoomIn() {
		const svg = d3.select(svgElement);
		svg.transition().call(
			d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.5
		);
	}

	function zoomOut() {
		const svg = d3.select(svgElement);
		svg.transition().call(
			d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1 / 1.5
		);
	}

	function resetZoom() {
		const svg = d3.select(svgElement);
		svg.transition().call(
			d3.zoom<SVGSVGElement, unknown>().transform as any, 
			d3.zoomIdentity
		);
	}

	function fitToScreen() {
		if (!svgElement || !containerElement) return;
		
		const svg = d3.select(svgElement);
		const g = svg.select('g');
		const bounds = (g.node() as SVGGElement)?.getBBox();
		
		if (!bounds) return;
		
		const width = containerElement.clientWidth;
		const height = containerElement.clientHeight;
		const scale = Math.min(width / bounds.width, height / bounds.height) * 0.8;
		const translate = [
			(width - bounds.width * scale) / 2 - bounds.x * scale,
			(height - bounds.height * scale) / 2 - bounds.y * scale
		];
		
		svg.transition().call(
			d3.zoom<SVGSVGElement, unknown>().transform as any,
			d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
		);
	}

	onMount(() => {
		initializeGraph();
		window.addEventListener('resize', handleResize);
	});

	onDestroy(() => {
		if (simulation) {
			simulation.stop();
		}
		window.removeEventListener('resize', handleResize);
	});

	// Reactive update when features change
	$effect(() => {
		if (features) {
			initializeGraph();
		}
	});
</script>

<div class="graph-container h-full w-full relative" bind:this={containerElement}>
	<!-- Controls -->
	<div class="absolute top-4 right-4 z-10 flex flex-col gap-2">
		<div class="btn-group btn-group-vertical">
			<button class="btn btn-sm btn-ghost" onclick={zoomIn} title={t('zoomIn')}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
				</svg>
			</button>
			<button class="btn btn-sm btn-ghost" onclick={zoomOut} title={t('zoomOut')}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
				</svg>
			</button>
			<button class="btn btn-sm btn-ghost" onclick={resetZoom} title={t('resetZoom')}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
				</svg>
			</button>
			<button class="btn btn-sm btn-ghost" onclick={fitToScreen} title={t('fitToScreen')}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
				</svg>
			</button>
		</div>
	</div>

	<!-- Legend -->
	<div class="absolute bottom-4 left-4 bg-base-100 p-3 rounded-lg shadow-lg border border-base-300 z-10">
		<h4 class="font-semibold text-sm mb-2">{t('workflow')}</h4>
		<div class="space-y-1 text-xs">
			<div class="flex items-center gap-2">
				<div class="w-3 h-0.5 bg-red-500"></div>
				<span>{t('dependencies')}</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-0.5 bg-gray-500 border-dashed" style="border-top: 1px dashed #6B7280; height: 0;"></div>
				<span>{t('relatedFeatures')}</span>
			</div>
		</div>
		<div class="mt-3">
			<h5 class="font-semibold text-xs mb-1">{t('priority')}</h5>
			<div class="flex gap-1">
				<div class="w-2 h-2 rounded-full bg-green-500" title={t('low')}></div>
				<div class="w-2 h-2 rounded-full bg-yellow-500" title={t('medium')}></div>
				<div class="w-2 h-2 rounded-full bg-orange-500" title={t('high')}></div>
				<div class="w-2 h-2 rounded-full bg-red-500" title={t('critical')}></div>
			</div>
		</div>
	</div>

	<!-- Graph SVG -->
	<svg bind:this={svgElement} class="w-full h-full"></svg>

	<!-- Empty state -->
	{#if features.length === 0}
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="text-center">
				<div class="text-6xl mb-4">📊</div>
				<h3 class="text-2xl font-semibold mb-2">{t('noFeatureRequests')}</h3>
				<p class="text-base-content/70">
					{t('beFirst')}
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.graph-container {
		min-height: 600px;
		background: radial-gradient(circle at 20px 20px, #e5e7eb 1px, transparent 0),
					radial-gradient(circle at 20px 20px, #e5e7eb 1px, transparent 0);
		background-size: 40px 40px;
		background-position: 0 0, 20px 20px;
	}

	:global(.node) {
		cursor: pointer;
	}

	:global(.node circle) {
		transition: all 0.3s ease;
	}

	:global(.node:hover circle) {
		stroke-width: 3;
		filter: brightness(1.1);
	}
</style>