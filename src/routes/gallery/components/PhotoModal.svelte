<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FrameEditor from './FrameEditor.svelte';
	import PhotoEditor from './PhotoEditor.svelte';

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

	export let photo: CosplayPhoto;

	const dispatch = createEventDispatcher();

	let isImageLoaded = false;
	let imageError = false;
	let showDeleteConfirm = false;
	let showFrameEditor = false;
	let showPhotoEditor = false;

	function handleClose() {
		dispatch('close');
	}

	function downloadPhoto() {
		const link = document.createElement('a');
		link.href = photo.imageUrl;
		link.download = `cosplay-${photo.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function sharePhoto() {
		if (navigator.share) {
			navigator.share({
				title: photo.title,
				text: photo.description,
				url: photo.imageUrl,
			});
		} else {
			// Fallback: copy URL to clipboard
			navigator.clipboard.writeText(photo.imageUrl).then(() => {
				alert('Photo URL copied to clipboard!');
			});
		}
	}

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(date));
	}

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}

	function handleImageLoad() {
		isImageLoaded = true;
	}

	function handleImageError() {
		imageError = true;
	}

	function handleDelete() {
		showDeleteConfirm = true;
	}

	function confirmDelete() {
		dispatch('deletePhoto', photo);
		handleClose();
	}

	function cancelDelete() {
		showDeleteConfirm = false;
	}

	function handleEdit() {
		dispatch('editPhoto', photo);
		handleClose();
	}

	function openFrameEditor() {
		showFrameEditor = true;
	}

	function closeFrameEditor() {
		showFrameEditor = false;
	}

	function openPhotoEditor() {
		showPhotoEditor = true;
	}

	function closePhotoEditor() {
		showPhotoEditor = false;
	}

	function handleEditedImageSaved(event: CustomEvent) {
		const { dataURL, title, settings } = event.detail;
		
		// Create a new photo with the edited image
		const editedPhoto = {
			...photo,
			id: Date.now().toString(),
			title: title || `${photo.title} (Edited)`,
			imageUrl: dataURL,
			thumbnailUrl: dataURL,
			tags: [...photo.tags, 'edited'].filter(tag => tag),
			uploadedAt: new Date()
		};

		dispatch('photoUploaded', editedPhoto);
		showPhotoEditor = false;
	}

	function handleFramedImageSaved(event: CustomEvent) {
		const { dataURL, frameId } = event.detail;
		
		// Create a new photo with the framed image
		const framedPhoto = {
			...photo,
			id: Date.now().toString(),
			title: `${photo.title} (Framed)`,
			imageUrl: dataURL,
			thumbnailUrl: dataURL,
			tags: [...photo.tags, 'framed', frameId].filter(tag => tag !== 'none'),
			uploadedAt: new Date()
		};

		dispatch('photoUploaded', framedPhoto);
		showFrameEditor = false;
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Modal Backdrop -->
<div 
	class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
	on:click={handleClose}
>
	<!-- Modal Content -->
	<div 
		class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
		on:click={(e) => e.stopPropagation()}
	>
		<!-- Image Section -->
		<div class="flex-1 relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
			{#if !isImageLoaded && !imageError}
				<!-- Loading State -->
				<div class="flex flex-col items-center justify-center p-8">
					<div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
					<p class="text-gray-600 dark:text-gray-400">Loading image...</p>
				</div>
			{/if}

			{#if imageError}
				<!-- Error State -->
				<div class="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
					<svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
					</svg>
					<p>Failed to load image</p>
				</div>
			{:else}
				<img 
					src={photo.imageUrl} 
					alt={photo.title}
					class="max-w-full max-h-full object-contain rounded-2xl shadow-lg"
					class:opacity-0={!isImageLoaded}
					class:opacity-100={isImageLoaded}
					on:load={handleImageLoad}
					on:error={handleImageError}
				/>
			{/if}

			<!-- Close Button -->
			<button 
				on:click={handleClose}
				class="absolute top-4 right-4 p-3 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-all duration-300 z-10"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>

			<!-- Action Buttons -->
			<div class="absolute bottom-4 right-4 flex space-x-2 z-10">
				<button 
					on:click={downloadPhoto}
					class="p-3 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-all duration-300 hover:scale-110"
					title="Download photo"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
					</svg>
				</button>
				<button 
					on:click={sharePhoto}
					class="p-3 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-all duration-300 hover:scale-110"
					title="Share photo"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
					</svg>
				</button>
				<button 
					on:click={openPhotoEditor}
					class="p-3 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-all duration-300 hover:scale-110"
					title="Edit photo"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
					</svg>
				</button>
				<button 
					on:click={openFrameEditor}
					class="p-3 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-all duration-300 hover:scale-110"
					title="Add frame"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
					</svg>
				</button>
				<button 
					on:click={handleEdit}
					class="p-3 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-all duration-300 hover:scale-110"
					title="Edit photo"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
					</svg>
				</button>
				<button 
					on:click={handleDelete}
					class="p-3 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-all duration-300 hover:scale-110"
					title="Delete photo"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
					</svg>
				</button>
			</div>
		</div>

		<!-- Details Section -->
		<div class="w-full lg:w-96 flex flex-col">
			<!-- Header -->
			<div class="p-6 border-b border-gray-200 dark:border-gray-700">
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
					{photo.title}
				</h1>
				{#if photo.character || photo.series}
					<div class="mb-4">
						{#if photo.character}
							<p class="text-lg font-medium text-purple-600 dark:text-purple-400">
								{photo.character}
							</p>
						{/if}
						{#if photo.series}
							<p class="text-sm text-gray-500 dark:text-gray-400">
								from {photo.series}
							</p>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Content -->
			<div class="flex-1 p-6 space-y-6 overflow-y-auto">
				<!-- Description -->
				{#if photo.description}
					<div>
						<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
							Description
						</h3>
						<p class="text-gray-600 dark:text-gray-400 leading-relaxed">
							{photo.description}
						</p>
					</div>
				{/if}

				<!-- Tags -->
				{#if photo.tags.length > 0}
					<div>
						<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
							Tags
						</h3>
						<div class="flex flex-wrap gap-2">
							{#each photo.tags as tag}
								<span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full">
									#{tag}
								</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Metadata -->
				<div>
					<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
						Details
					</h3>
					<div class="space-y-3">
						{#if photo.photographer}
							<div class="flex items-center space-x-3">
								<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
								</svg>
								<div>
									<p class="text-xs text-gray-500 dark:text-gray-400">Photographer</p>
									<p class="text-sm text-gray-700 dark:text-gray-300">{photo.photographer}</p>
								</div>
							</div>
						{/if}

						<div class="flex items-center space-x-3">
							<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
							</svg>
							<div>
								<p class="text-xs text-gray-500 dark:text-gray-400">Uploaded</p>
								<p class="text-sm text-gray-700 dark:text-gray-300">{formatDate(photo.uploadedAt)}</p>
							</div>
						</div>

						<div class="flex items-center space-x-3">
							<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
							</svg>
							<div>
								<p class="text-xs text-gray-500 dark:text-gray-400">ID</p>
								<p class="text-sm text-gray-700 dark:text-gray-300 font-mono">{photo.id}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Social Actions -->
				<div>
					<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
						Actions
					</h3>
					<div class="grid grid-cols-2 gap-3">
						<button 
							on:click={downloadPhoto}
							class="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
							</svg>
							<span>Download</span>
						</button>
						<button 
							on:click={sharePhoto}
							class="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
							</svg>
							<span>Share</span>
						</button>
					</div>
					
					<!-- Photo Editing Actions -->
					<div class="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
						<button 
							on:click={openPhotoEditor}
							class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
							</svg>
							<span>Pro Photo Editor</span>
						</button>
						<button 
							on:click={openFrameEditor}
							class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
							</svg>
							<span>Add Cosplay Frame</span>
						</button>
					</div>

					<!-- Management Actions -->
					<div class="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
						<button 
							on:click={handleEdit}
							class="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
							</svg>
							<span>Edit</span>
						</button>
						<button 
							on:click={handleDelete}
							class="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
							</svg>
							<span>Delete</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
			<div class="flex items-center space-x-3 mb-4">
				<div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
					<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
					</svg>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Photo</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
				</div>
			</div>
			
			<p class="text-gray-600 dark:text-gray-300 mb-6">
				Are you sure you want to delete "<strong>{photo.title}</strong>"? This will permanently remove the photo from your gallery.
			</p>
			
			<div class="flex space-x-3">
				<button 
					on:click={cancelDelete}
					class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
				>
					Cancel
				</button>
				<button 
					on:click={confirmDelete}
					class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
				>
					Delete Photo
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Photo Editor -->
<PhotoEditor 
	bind:isOpen={showPhotoEditor}
	imageUrl={photo.imageUrl}
	photoTitle={photo.title}
	on:close={closePhotoEditor}
	on:imageSaved={handleEditedImageSaved}
/>

<!-- Frame Editor -->
<FrameEditor 
	bind:isOpen={showFrameEditor}
	imageUrl={photo.imageUrl}
	on:close={closeFrameEditor}
	on:imageSaved={handleFramedImageSaved}
/>