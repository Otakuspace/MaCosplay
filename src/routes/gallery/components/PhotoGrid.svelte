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

	const dispatch = createEventDispatcher();

	function handlePhotoClick(photo: CosplayPhoto) {
		dispatch('photoClick', photo);
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

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
	{#each photos as photo (photo.id)}
		<div 
			class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
			on:click={() => handlePhotoClick(photo)}
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'Enter' && handlePhotoClick(photo)}
		>
			<!-- Image Container -->
			<div class="relative overflow-hidden rounded-t-2xl aspect-[3/4]">
				<img 
					src={photo.thumbnailUrl} 
					alt={photo.title}
					class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
					loading="lazy"
				/>
				
				<!-- Overlay -->
				<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<div class="absolute bottom-4 left-4 right-4">
						<div class="flex flex-wrap gap-1 mb-2">
							{#each photo.tags.slice(0, 3) as tag}
								<span class="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
									#{tag}
								</span>
							{/each}
							{#if photo.tags.length > 3}
								<span class="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
									+{photo.tags.length - 3}
								</span>
							{/if}
						</div>
					</div>
				</div>

				<!-- Download Button -->
				<button
					class="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110"
					on:click={(e) => downloadPhoto(photo, e)}
					title="Download photo"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
					</svg>
				</button>

				<!-- Heart/Like Button -->
				<button
					class="absolute top-3 left-3 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/50 hover:scale-110"
					title="Like photo"
					on:click={(e) => e.stopPropagation()}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
					</svg>
				</button>
			</div>

			<!-- Content -->
			<div class="p-4">
				<!-- Title -->
				<h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
					{photo.title}
				</h3>

				<!-- Character and Series -->
				{#if photo.character || photo.series}
					<div class="mb-3">
						{#if photo.character}
							<p class="text-sm font-medium text-purple-600 dark:text-purple-400">
								{photo.character}
							</p>
						{/if}
						{#if photo.series}
							<p class="text-xs text-gray-500 dark:text-gray-400">
								from {photo.series}
							</p>
						{/if}
					</div>
				{/if}

				<!-- Description -->
				<p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
					{photo.description}
				</p>

				<!-- Footer -->
				<div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
					<div class="flex items-center space-x-2">
						{#if photo.photographer}
							<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
							</svg>
							<span class="truncate">{photo.photographer}</span>
						{/if}
					</div>
					<div class="flex items-center space-x-1">
						<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
						</svg>
						<span>{formatDate(photo.uploadedAt)}</span>
					</div>
				</div>
			</div>

			<!-- Shine Effect -->
			<div class="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700"></div>
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
</style>