<script lang="ts">
	import { onMount } from 'svelte';
	import type { FeatureRequest, ViewMode } from '../../types/brainstorm';
	import { t } from '../../lib/i18n';
	import FeatureCard from './components/FeatureCard.svelte';
	import FeatureForm from './components/FeatureForm.svelte';
	import GraphFlowchart from './components/GraphFlowchart.svelte';

	let features: FeatureRequest[] = $state([]);
	let showForm = $state(false);
	let loading = $state(true);
	let error = $state('');
	let viewMode: ViewMode = $state('card');

	onMount(async () => {
		await loadFeatures();
	});

	async function loadFeatures() {
		try {
			loading = true;
			const response = await fetch('/brainstorm/api');
			if (response.ok) {
				features = await response.json();
			} else {
				error = t('failedToLoad');
			}
		} catch (err) {
			error = t('errorLoading');
			console.error('Error loading features:', err);
		} finally {
			loading = false;
		}
	}

	async function handleAddFeature(event: CustomEvent) {
		try {
			const response = await fetch('/brainstorm/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(event.detail)
			});

			if (response.ok) {
				const newFeature = await response.json();
				features = [...features, newFeature];
				showForm = false;
			} else {
				error = t('failedToAdd');
			}
		} catch (err) {
			error = t('errorAdding');
			console.error('Error adding feature:', err);
		}
	}

	async function handleUpdateFeature(event: CustomEvent) {
		try {
			const { id, ...updateData } = event.detail;
			const response = await fetch(`/brainstorm/api/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateData)
			});

			if (response.ok) {
				const updatedFeature = await response.json();
				features = features.map(f => f.id === id ? updatedFeature : f);
			} else {
				error = t('failedToUpdate');
			}
		} catch (err) {
			error = t('errorUpdating');
			console.error('Error updating feature:', err);
		}
	}

	async function handleDeleteFeature(event: CustomEvent) {
		try {
			const { id } = event.detail;
			const response = await fetch(`/brainstorm/api/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				features = features.filter(f => f.id !== id);
			} else {
				error = t('failedToDelete');
			}
		} catch (err) {
			error = t('errorDeleting');
			console.error('Error deleting feature:', err);
		}
	}

	function filterByStatus(status: string) {
		if (status === 'all') return features;
		return features.filter(f => f.status === status);
	}

	let selectedFilter = $state('all');
	let filteredFeatures = $derived(filterByStatus(selectedFilter));
</script>

<svelte:head>
	<title>{t('pageTitle')}</title>
	<meta name="description" content={t('pageDescription')} />
</svelte:head>

<div class="min-h-screen bg-base-100 p-6 brainstorm-page">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 class="text-4xl font-bold text-primary mb-2">{t('brainstormBoard')}</h1>
					<p class="text-base-content/70 text-lg">
						{t('subtitle')}
					</p>
				</div>
				<button 
					class="btn btn-primary btn-lg"
					onclick={() => showForm = !showForm}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
					</svg>
					{t('addFeatureRequest')}
				</button>
			</div>
		</div>

		<!-- Error Display -->
		{#if error}
			<div class="alert alert-error mb-6">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span>{error}</span>
				<button class="btn btn-sm btn-ghost" onclick={() => error = ''}>✕</button>
			</div>
		{/if}

		<!-- Feature Form Modal -->
		{#if showForm}
			<div class="modal modal-open">
				<div class="modal-box max-w-2xl">
					<h3 class="font-bold text-lg mb-4">{t('addNewFeatureRequest')}</h3>
					<FeatureForm 
						on:submit={handleAddFeature}
						on:cancel={() => showForm = false}
					/>
				</div>
				<div class="modal-backdrop" onclick={() => showForm = false}></div>
			</div>
		{/if}

		<!-- View Toggle and Filters -->
		<div class="mb-6">
			<!-- View Mode Toggle -->
			<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
				<div class="btn-group">
					<button 
						class="btn btn-sm {viewMode === 'card' ? 'btn-primary' : 'btn-ghost'}"
						onclick={() => viewMode = 'card'}
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
						</svg>
						{t('cardView')}
					</button>
					<button 
						class="btn btn-sm {viewMode === 'graph' ? 'btn-primary' : 'btn-ghost'}"
						onclick={() => viewMode = 'graph'}
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
						{t('graphView')}
					</button>
				</div>
			</div>
			
			<!-- Status Filters -->
			<div class="flex flex-wrap gap-2">
				<button 
					class="btn btn-sm {selectedFilter === 'all' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedFilter = 'all'}
				>
					{t('all')} ({features.length})
				</button>
				<button 
					class="btn btn-sm {selectedFilter === 'requested' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedFilter = 'requested'}
				>
					{t('requested')} ({features.filter(f => f.status === 'requested').length})
				</button>
				<button 
					class="btn btn-sm {selectedFilter === 'in-review' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedFilter = 'in-review'}
				>
					{t('inReview')} ({features.filter(f => f.status === 'in-review').length})
				</button>
				<button 
					class="btn btn-sm {selectedFilter === 'approved' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedFilter = 'approved'}
				>
					{t('approved')} ({features.filter(f => f.status === 'approved').length})
				</button>
				<button 
					class="btn btn-sm {selectedFilter === 'in-progress' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedFilter = 'in-progress'}
				>
					{t('inProgress')} ({features.filter(f => f.status === 'in-progress').length})
				</button>
				<button 
					class="btn btn-sm {selectedFilter === 'completed' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedFilter = 'completed'}
				>
					{t('completed')} ({features.filter(f => f.status === 'completed').length})
				</button>
			</div>
		</div>

		<!-- Loading State -->
		{#if loading}
			<div class="flex justify-center items-center py-12">
				<span class="loading loading-spinner loading-lg"></span>
				<p class="mt-4 text-base-content/70">{t('loading')}</p>
			</div>
		{:else if filteredFeatures.length === 0}
			<!-- Empty State -->
			<div class="text-center py-12">
				<div class="text-6xl mb-4">💡</div>
				<h3 class="text-2xl font-semibold mb-2">{t('noFeatureRequests')}</h3>
				<p class="text-base-content/70 mb-6">
					{t('beFirst')}
				</p>
				<button 
					class="btn btn-primary"
					onclick={() => showForm = true}
				>
					{t('addFirstFeatureRequest')}
				</button>
			</div>
		{:else}
			<!-- Content Views -->
			{#if viewMode === 'card'}
				<!-- Card Grid View -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each filteredFeatures as feature (feature.id)}
						<FeatureCard 
							{feature}
							on:update={handleUpdateFeature}
							on:delete={handleDeleteFeature}
						/>
					{/each}
				</div>
			{:else if viewMode === 'graph'}
				<!-- Graph Flowchart View -->
				<div class="h-[800px] w-full">
					<GraphFlowchart features={filteredFeatures} />
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.whiteboard-container {
		background-image: 
			linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px);
		background-size: 20px 20px;
	}
</style>