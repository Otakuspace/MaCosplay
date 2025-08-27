<script lang="ts">
	import { onMount } from 'svelte';
	import type { FeatureRequest } from '../../types/brainstorm';
	import FeatureCard from './components/FeatureCard.svelte';
	import FeatureForm from './components/FeatureForm.svelte';

	let features: FeatureRequest[] = $state([]);
	let showForm = $state(false);
	let loading = $state(true);
	let error = $state('');

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
				error = 'Failed to load features';
			}
		} catch (err) {
			error = 'Error loading features';
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
				error = 'Failed to add feature request';
			}
		} catch (err) {
			error = 'Error adding feature request';
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
				error = 'Failed to update feature request';
			}
		} catch (err) {
			error = 'Error updating feature request';
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
				error = 'Failed to delete feature request';
			}
		} catch (err) {
			error = 'Error deleting feature request';
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
	<title>Brainstorm Board - MacOSPlay</title>
	<meta name="description" content="Feature request brainstorm board for MacOSPlay" />
</svelte:head>

<div class="min-h-screen bg-base-100 p-6">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 class="text-4xl font-bold text-primary mb-2">🧠 Brainstorm Board</h1>
					<p class="text-base-content/70 text-lg">
						Share your ideas and vote on features for MacOSPlay
					</p>
				</div>
				<button 
					class="btn btn-primary btn-lg"
					onclick={() => showForm = !showForm}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
					</svg>
					Add Feature Request
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
					<h3 class="font-bold text-lg mb-4">Add New Feature Request</h3>
					<FeatureForm 
						on:submit={handleAddFeature}
						on:cancel={() => showForm = false}
					/>
				</div>
				<div class="modal-backdrop" onclick={() => showForm = false}></div>
			</div>
		{/if}

		<!-- Filters -->
		<div class="mb-6">
			<div class="flex flex-wrap gap-2">
				<button 
					class="btn btn-sm {selectedFilter === 'all' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedFilter = 'all'}
				>
					All ({features.length})
				</button>
				<button 
					class="btn btn-sm {selectedFilter === 'requested' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedFilter = 'requested'}
				>
					Requested ({features.filter(f => f.status === 'requested').length})
				</button>
				<button 
					class="btn btn-sm {selectedFilter === 'in-review' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedFilter = 'in-review'}
				>
					In Review ({features.filter(f => f.status === 'in-review').length})
				</button>
				<button 
					class="btn btn-sm {selectedFilter === 'approved' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedFilter = 'approved'}
				>
					Approved ({features.filter(f => f.status === 'approved').length})
				</button>
				<button 
					class="btn btn-sm {selectedFilter === 'in-progress' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedFilter = 'in-progress'}
				>
					In Progress ({features.filter(f => f.status === 'in-progress').length})
				</button>
				<button 
					class="btn btn-sm {selectedFilter === 'completed' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedFilter = 'completed'}
				>
					Completed ({features.filter(f => f.status === 'completed').length})
				</button>
			</div>
		</div>

		<!-- Loading State -->
		{#if loading}
			<div class="flex justify-center items-center py-12">
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{:else if filteredFeatures.length === 0}
			<!-- Empty State -->
			<div class="text-center py-12">
				<div class="text-6xl mb-4">💡</div>
				<h3 class="text-2xl font-semibold mb-2">No feature requests yet</h3>
				<p class="text-base-content/70 mb-6">
					Be the first to share your ideas for MacOSPlay!
				</p>
				<button 
					class="btn btn-primary"
					onclick={() => showForm = true}
				>
					Add First Feature Request
				</button>
			</div>
		{:else}
			<!-- Whiteboard Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredFeatures as feature (feature.id)}
					<FeatureCard 
						{feature}
						on:update={handleUpdateFeature}
						on:delete={handleDeleteFeature}
					/>
				{/each}
			</div>
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