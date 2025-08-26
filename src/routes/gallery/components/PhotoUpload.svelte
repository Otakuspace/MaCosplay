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

	export let photo: CosplayPhoto | null = null;
	export let isEditing = false;

	const dispatch = createEventDispatcher();

	let title = photo?.title || '';
	let description = photo?.description || '';
	let character = photo?.character || '';
	let series = photo?.series || '';
	let photographer = photo?.photographer || '';
	let tags = photo?.tags.join(', ') || '';
	let selectedFile: File | null = null;
	let imagePreview = photo?.imageUrl || '';
	let isDragOver = false;
	let isUploading = false;
	let uploadProgress = 0;

	// Popular cosplay series suggestions
	const popularSeries = [
		'Demon Slayer', 'Genshin Impact', 'Sailor Moon', 'Attack on Titan',
		'My Hero Academia', 'Naruto', 'One Piece', 'Dragon Ball',
		'Final Fantasy', 'League of Legends', 'Overwatch', 'Pokémon'
	];

	function handleClose() {
		dispatch('close');
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragOver = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;
		
		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			handleFileSelect(files[0]);
		}
	}

	function handleFileInput(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			handleFileSelect(input.files[0]);
		}
	}

	function handleFileSelect(file: File) {
		if (!file.type.startsWith('image/')) {
			alert('Please select an image file');
			return;
		}

		if (file.size > 10 * 1024 * 1024) { // 10MB limit
			alert('File size must be less than 10MB');
			return;
		}

		selectedFile = file;
		
		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			imagePreview = e.target?.result as string;
		};
		reader.readAsDataURL(file);

		// Auto-fill title from filename if empty
		if (!title) {
			title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
		}
	}

	function removeImage() {
		selectedFile = null;
		imagePreview = '';
	}

	async function handleSubmit() {
		if ((!selectedFile && !isEditing) || !title.trim()) {
			alert('Please select an image and provide a title');
			return;
		}

		isUploading = true;
		uploadProgress = 0;

		try {
			// Simulate upload progress
			const progressInterval = setInterval(() => {
				uploadProgress += 10;
				if (uploadProgress >= 90) {
					clearInterval(progressInterval);
				}
			}, 100);

			let imageUrl, thumbnailUrl;
			
			if (selectedFile) {
				// In a real app, you would upload to a server here
				// For now, we'll create a local URL
				imageUrl = URL.createObjectURL(selectedFile);
				thumbnailUrl = imageUrl; // Using same URL for demo
			} else if (isEditing && photo) {
				// Keep existing image URLs when editing without changing image
				imageUrl = photo.imageUrl;
				thumbnailUrl = photo.thumbnailUrl;
			}

			const newPhoto: CosplayPhoto = {
				id: isEditing && photo ? photo.id : Date.now().toString(),
				title: title.trim(),
				description: description.trim(),
				character: character.trim() || undefined,
				series: series.trim() || undefined,
				photographer: photographer.trim() || undefined,
				tags: tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag),
				imageUrl: imageUrl!,
				thumbnailUrl: thumbnailUrl!,
				uploadedAt: isEditing && photo ? photo.uploadedAt : new Date()
			};

			// Complete the progress
			clearInterval(progressInterval);
			uploadProgress = 100;

			setTimeout(() => {
				dispatch('photoUploaded', newPhoto);
				isUploading = false;
			}, 500);

		} catch (error) {
			console.error('Upload failed:', error);
			alert('Upload failed. Please try again.');
			isUploading = false;
		}
	}

	function addSuggestion(suggestion: string) {
		series = suggestion;
	}

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Modal Backdrop -->
<div 
	class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
	on:click={handleClose}
>
	<!-- Modal Content -->
	<div 
		class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
		on:click={(e) => e.stopPropagation()}
	>
		<!-- Header -->
		<div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-3xl">
			<div class="flex items-center justify-between">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
					{isEditing ? 'Edit Cosplay Photo' : 'Upload Cosplay Photo'}
				</h2>
				<button 
					on:click={handleClose}
					class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
				>
					<svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
		</div>

		<!-- Content -->
		<div class="p-6">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Left Column - Image Upload -->
				<div class="space-y-6">
					<!-- File Drop Zone -->
					<div class="space-y-4">
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Photo *
						</label>
						
						{#if !selectedFile}
							<div 
								class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors cursor-pointer"
								class:border-purple-500={isDragOver}
								class:bg-purple-50={isDragOver}
								class:dark:bg-purple-900/20={isDragOver}
								on:dragover={handleDragOver}
								on:dragleave={handleDragLeave}
								on:drop={handleDrop}
								on:click={() => document.getElementById('file-input')?.click()}
							>
								<svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
								</svg>
								<p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
									{isDragOver ? 'Drop your image here!' : 'Drag and drop your image'}
								</p>
								<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
									or click to browse (Max 10MB)
								</p>
								<button 
									type="button"
									class="btn bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300"
								>
									Choose File
								</button>
							</div>
							<input 
								id="file-input"
								type="file" 
								accept="image/*" 
								class="hidden"
								on:change={handleFileInput}
							/>
						{:else}
							<!-- Image Preview -->
							<div class="relative">
								<img 
									src={imagePreview} 
									alt="Preview" 
									class="w-full h-80 object-cover rounded-2xl shadow-lg"
								/>
								<button 
									type="button"
									on:click={removeImage}
									class="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</button>
							</div>
						{/if}
					</div>

					<!-- Upload Progress -->
					{#if isUploading}
						<div class="space-y-2">
							<div class="flex justify-between text-sm">
								<span class="text-gray-600 dark:text-gray-400">Uploading...</span>
								<span class="text-gray-600 dark:text-gray-400">{uploadProgress}%</span>
							</div>
							<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<div 
									class="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
									style="width: {uploadProgress}%"
								></div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Right Column - Metadata Form -->
				<div class="space-y-6">
					<!-- Title -->
					<div>
						<label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Title *
						</label>
						<input 
							id="title"
							type="text" 
							bind:value={title}
							placeholder="Amazing Nezuko Cosplay"
							class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
							required
						/>
					</div>

					<!-- Description -->
					<div>
						<label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Description
						</label>
						<textarea 
							id="description"
							bind:value={description}
							placeholder="Tell us about this cosplay..."
							rows="3"
							class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
						></textarea>
					</div>

					<!-- Character -->
					<div>
						<label for="character" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Character
						</label>
						<input 
							id="character"
							type="text" 
							bind:value={character}
							placeholder="Nezuko Kamado"
							class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
						/>
					</div>

					<!-- Series -->
					<div>
						<label for="series" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Series/Game
						</label>
						<input 
							id="series"
							type="text" 
							bind:value={series}
							placeholder="Demon Slayer"
							class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
						/>
						
						<!-- Popular Series Suggestions -->
						<div class="mt-2 flex flex-wrap gap-2">
							{#each popularSeries.slice(0, 6) as suggestion}
								<button 
									type="button"
									on:click={() => addSuggestion(suggestion)}
									class="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
								>
									{suggestion}
								</button>
							{/each}
						</div>
					</div>

					<!-- Photographer -->
					<div>
						<label for="photographer" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Photographer
						</label>
						<input 
							id="photographer"
							type="text" 
							bind:value={photographer}
							placeholder="Your name or photographer's name"
							class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
						/>
					</div>

					<!-- Tags -->
					<div>
						<label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Tags
						</label>
						<input 
							id="tags"
							type="text" 
							bind:value={tags}
							placeholder="anime, cosplay, demon-slayer (separated by commas)"
							class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
						/>
						<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Separate tags with commas. They'll be converted to lowercase automatically.
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 rounded-b-3xl">
			<div class="flex justify-end space-x-4">
				<button 
					type="button"
					on:click={handleClose}
					class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
					disabled={isUploading}
				>
					Cancel
				</button>
				<button 
					type="button"
					on:click={handleSubmit}
					class="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={isUploading || (!selectedFile && !isEditing) || !title.trim()}
				>
					{#if isUploading}
						<svg class="w-4 h-4 mr-2 animate-spin inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
						</svg>
						{isEditing ? 'Saving...' : 'Uploading...'}
					{:else}
						{isEditing ? 'Save Changes' : 'Upload Photo'}
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>