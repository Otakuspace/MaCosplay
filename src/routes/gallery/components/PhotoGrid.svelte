<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface CosplayPhoto {
		id: string;
		title: string;
		description: string;
		imageUrl: string;
		thumbnailUrl: string;
		tags: string[];
		uploadedAt: Date;
		character?: string;
		series?: string;
		photographer?: string;
	}

	export let photos: CosplayPhoto[] = [];
	export let batchMode = false;
	export let selectedPhotos: Set<string> = new Set();

	const dispatch = createEventDispatcher();

	function handlePhotoClick(photo: CosplayPhoto) {
		if (batchMode) {
			toggleSelection(photo.id);
		} else {
			dispatch('photoClick', photo);
		}
	}

	function toggleSelection(photoId: string) {
		if (selectedPhotos.has(photoId)) {
			selectedPhotos.delete(photoId);
		} else {
			selectedPhotos.add(photoId);
		}
		selectedPhotos = new Set(selectedPhotos);
		dispatch('selectionChanged', selectedPhotos);
	}

	function downloadPhoto(photo: CosplayPhoto, event: Event) {
		event.stopPropagation();
		const link = document.createElement('a');
		link.href = photo.imageUrl;
		link.download = `cosplay-${photo.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(new Date(date));
	}
</script>

<!-- Masonry Grid Layout -->
<div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6 space-y-6">
	{#each photos as photo (photo.id)}
		<div 
			class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer overflow-hidden break-inside-avoid mb-6 border-2 hover-lift {!batchMode && !selectedPhotos.has(photo.id) ? 'border-white/20 dark:border-gray-700/50' : ''} {batchMode && selectedPhotos.has(photo.id) ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : ''} {batchMode && !selectedPhotos.has(photo.id) ? 'border-gray-300 dark:border-gray-600' : ''}"
			on:click={() => handlePhotoClick(photo)}
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'Enter' && handlePhotoClick(photo)}
		>
			<!-- Image Container -->
			<div class="relative overflow-hidden rounded-t-3xl">
				<img 
					src={photo.thumbnailUrl} 
					alt={photo.title}
					class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
					class:opacity-75={batchMode && selectedPhotos.has(photo.id)}
					loading="lazy"
				/>

				<!-- Batch Selection Checkbox -->
				{#if batchMode}
					<div class="absolute top-3 left-3">
						<div class="w-6 h-6 rounded-full border-2 border-white bg-black/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
							class:bg-purple-500={selectedPhotos.has(photo.id)}
							class:border-purple-500={selectedPhotos.has(photo.id)}
						>
							{#if selectedPhotos.has(photo.id)}
								<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
							{/if}
						</div>
					</div>
				{/if}
				
				<!-- Enhanced Overlay -->
				<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
					<!-- Quick Actions Bar -->
					<div class="absolute top-3 left-3 right-3 flex justify-between items-center">
						<!-- Like Button -->
						<button
							class="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-300 hover:bg-red-500/70 hover:scale-110"
							title="Like photo"
							on:click={(e) => e.stopPropagation()}
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
							</svg>
						</button>

						<!-- Action Buttons -->
						<div class="flex space-x-2">
							<!-- Download Button -->
							<button
								class="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-300 hover:bg-white/30 hover:scale-110"
								on:click={(e) => downloadPhoto(photo, e)}
								title="Download photo"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
								</svg>
							</button>

							<!-- Edit Button -->
							<button
								class="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-300 hover:bg-purple-500/70 hover:scale-110"
								on:click={(e) => { e.stopPropagation(); handlePhotoClick(photo); }}
								title="Edit photo"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
								</svg>
							</button>
						</div>
					</div>

					<!-- Bottom Content -->
					<div class="absolute bottom-4 left-4 right-4">
						<!-- Tags -->
						<div class="flex flex-wrap gap-1 mb-3">
							{#each photo.tags.slice(0, 3) as tag}
								<span class="px-3 py-1 bg-white/25 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20">
									#{tag}
								</span>
							{/each}
							{#if photo.tags.length > 3}
								<span class="px-3 py-1 bg-purple-500/70 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20">
									+{photo.tags.length - 3}
								</span>
							{/if}
						</div>

						<!-- Quick Info -->
						<div class="text-white/90 text-xs">
							{#if photo.character}
								<div class="font-medium">{photo.character}</div>
							{/if}
							{#if photo.series}
								<div class="text-white/70">from {photo.series}</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Enhanced Content -->
			<div class="p-5">
				<!-- Title -->
				<h3 class="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
					{photo.title}
				</h3>

				<!-- Character and Series -->
				{#if photo.character || photo.series}
					<div class="mb-4 space-y-1">
						{#if photo.character}
							<div class="flex items-center space-x-2">
								<div class="w-2 h-2 bg-purple-500 rounded-full"></div>
								<p class="text-sm font-medium text-purple-600 dark:text-purple-400">
									{photo.character}
								</p>
							</div>
						{/if}
						{#if photo.series}
							<p class="text-xs text-gray-500 dark:text-gray-400 ml-4">
								from {photo.series}
							</p>
						{/if}
					</div>
				{/if}

				<!-- Description -->
				{#if photo.description}
					<p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
						{photo.description}
					</p>
				{/if}

				<!-- Tags Preview -->
				{#if photo.tags.length > 0}
					<div class="flex flex-wrap gap-1 mb-4">
						{#each photo.tags.slice(0, 2) as tag}
							<span class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
								#{tag}
							</span>
						{/each}
						{#if photo.tags.length > 2}
							<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
								+{photo.tags.length - 2}
							</span>
						{/if}
					</div>
				{/if}

				<!-- Enhanced Footer -->
				<div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
					<div class="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
						{#if photo.photographer}
							<div class="flex items-center space-x-1">
								<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
								</svg>
								<span class="truncate max-w-20">{photo.photographer}</span>
							</div>
						{/if}
					</div>
					<div class="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
						<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
						</svg>
						<span>{formatDate(photo.uploadedAt)}</span>
					</div>
				</div>
			</div>

			<!-- Enhanced Shine Effect -->
			<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:animate-pulse"></div>
			
			<!-- Glow Effect -->
			<div class="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
		</div>
	{/each}
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

	/* Masonry layout support for older browsers */
	@supports not (column-count: 1) {
		.columns-1 { column-count: 1; }
		.columns-2 { column-count: 2; }
		.columns-3 { column-count: 3; }
		.columns-4 { column-count: 4; }
		.columns-5 { column-count: 5; }
	}

	/* Enhanced hover effects */
	.hover-lift {
		transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
	}

	.hover-lift:hover {
		filter: brightness(1.05);
	}

	/* Prevent column breaks inside cards */
	.break-inside-avoid {
		break-inside: avoid;
		page-break-inside: avoid;
	}
</style>