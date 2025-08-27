<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { FeatureRequest } from '../../../types/brainstorm';
	import { t, getNestedTranslation } from '../../../lib/i18n';

	interface Props {
		feature: FeatureRequest;
	}

	let { feature }: Props = $props();

	const dispatch = createEventDispatcher();

	function getPriorityColor(priority: string) {
		switch (priority) {
			case 'critical': return 'badge-error';
			case 'high': return 'badge-warning';
			case 'medium': return 'badge-info';
			case 'low': return 'badge-success';
			default: return 'badge-ghost';
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'requested': return 'bg-gray-100 text-gray-800';
			case 'in-review': return 'bg-blue-100 text-blue-800';
			case 'approved': return 'bg-green-100 text-green-800';
			case 'in-progress': return 'bg-yellow-100 text-yellow-800';
			case 'completed': return 'bg-purple-100 text-purple-800';
			case 'rejected': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}

	function getCategoryIcon(category: string) {
		return getNestedTranslation('categoryIcons', category);
	}

	function handleVote() {
		dispatch('update', {
			id: feature.id,
			votes: feature.votes + 1
		});
	}

	function handleStatusChange(newStatus: string) {
		dispatch('update', {
			id: feature.id,
			status: newStatus
		});
	}

	function handleDelete() {
		if (confirm(t('deleteConfirmation'))) {
			dispatch('delete', { id: feature.id });
		}
	}

	let showDetails = $state(false);
</script>

<div class="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-200 border border-base-300">
	<div class="card-body p-4">
		<!-- Header -->
		<div class="flex items-start justify-between mb-3">
			<div class="flex items-center gap-2">
				<span class="text-2xl">{getCategoryIcon(feature.category)}</span>
				<div class="flex flex-col">
					<span class="text-xs opacity-60">{t(feature.category as any).toUpperCase()}</span>
					<span class="badge {getPriorityColor(feature.priority)} badge-xs">
						{t(feature.priority as any)}
					</span>
				</div>
			</div>
					<div class="dropdown dropdown-end">
			<button class="btn btn-ghost btn-xs" aria-label="Feature options menu">⋮</button>
			<ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
				<li><button onclick={() => showDetails = !showDetails}>
					{showDetails ? t('hideDetails') : t('showDetails')}
				</button></li>
				<li><button onclick={handleDelete} class="text-error">{t('delete')}</button></li>
			</ul>
		</div>
		</div>

		<!-- Title -->
		<h3 class="card-title text-base mb-2 line-clamp-2">{feature.title}</h3>

		<!-- Description -->
		<p class="text-sm opacity-70 mb-3 line-clamp-3">{feature.description}</p>

		<!-- Status -->
		<div class="mb-3">
			<select 
				class="select select-xs w-full max-w-xs {getStatusColor(feature.status)}"
				value={feature.status}
				onchange={(e) => handleStatusChange(e.currentTarget.value)}
			>
				<option value="requested">{t('requested')}</option>
				<option value="in-review">{t('inReview')}</option>
				<option value="approved">{t('approved')}</option>
				<option value="in-progress">{t('inProgress')}</option>
				<option value="completed">{t('completed')}</option>
				<option value="rejected">{t('rejected')}</option>
			</select>
		</div>

		<!-- Tags -->
		{#if feature.tags.length > 0}
			<div class="flex flex-wrap gap-1 mb-3">
				{#each feature.tags.slice(0, 3) as tag}
					<span class="badge badge-outline badge-xs">{tag}</span>
				{/each}
				{#if feature.tags.length > 3}
					<span class="badge badge-ghost badge-xs">+{feature.tags.length - 3}</span>
				{/if}
			</div>
		{/if}

		<!-- Footer -->
		<div class="flex items-center justify-between pt-2 border-t border-base-300">
			<div class="flex items-center gap-2">
				<button 
					class="btn btn-ghost btn-xs gap-1"
					onclick={handleVote}
				>
					👍 {feature.votes}
				</button>
				<span class="text-xs opacity-60">{t('by')} {feature.author}</span>
			</div>
			<span class="text-xs opacity-60">
				{new Date(feature.createdAt).toLocaleDateString()}
			</span>
		</div>

		<!-- Expanded Details -->
		{#if showDetails}
			<div class="mt-4 pt-4 border-t border-base-300">
				<div class="space-y-2 text-sm">
					<div><strong>ID:</strong> {feature.id}</div>
					<div><strong>{t('createdAt')}:</strong> {new Date(feature.createdAt).toLocaleString('th-TH')}</div>
					<div><strong>{t('updatedAt')}:</strong> {new Date(feature.updatedAt).toLocaleString('th-TH')}</div>
					{#if feature.tags.length > 0}
						<div>
							<strong>{t('allTags')}:</strong>
							<div class="flex flex-wrap gap-1 mt-1">
								{#each feature.tags as tag}
									<span class="badge badge-outline badge-xs">{tag}</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>