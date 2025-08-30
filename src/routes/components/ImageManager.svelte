<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	export let itemId: string;
	export let existingImages: string[] = [];
	
	const dispatch = createEventDispatcher();
	
	let dragOver = false;
	let uploading = false;
	let uploadProgress = 0;
	
	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
	const maxFileSize = 5 * 1024 * 1024; // 5MB
	
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}
	
	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
	}
	
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		
		const files = Array.from(event.dataTransfer?.files || []);
		handleFiles(files);
	}
	
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = Array.from(target.files || []);
		handleFiles(files);
	}
	
	async function handleFiles(files: File[]) {
		const validFiles = files.filter(file => {
			if (!allowedTypes.includes(file.type)) {
				alert(`File ${file.name} is not a supported image type`);
				return false;
			}
			if (file.size > maxFileSize) {
				alert(`File ${file.name} is too large (max 5MB)`);
				return false;
			}
			return true;
		});
		
		if (validFiles.length === 0) return;
		
		uploading = true;
		uploadProgress = 0;
		
		try {
			for (let i = 0; i < validFiles.length; i++) {
				const file = validFiles[i];
				await uploadImage(file);
				uploadProgress = ((i + 1) / validFiles.length) * 100;
			}
			
			// Refresh images after upload
			dispatch('imagesUpdated');
		} catch (error) {
			console.error('Upload error:', error);
			alert('Upload failed. Please try again.');
		} finally {
			uploading = false;
			uploadProgress = 0;
		}
	}
	
	async function uploadImage(file: File) {
		// This would normally upload to your backend/PocketBase
		// For now, we'll simulate the upload
		return new Promise((resolve) => {
			setTimeout(() => {
				console.log(`Simulated upload of ${file.name} for item ${itemId}`);
				resolve(true);
			}, 1000);
		});
	}
</script>

<div class="bg-base-200 rounded-lg p-4">
	<h3 class="text-lg font-semibold mb-4">Image Management for Item: {itemId}</h3>
	
	<!-- Existing Images -->
	{#if existingImages.length > 0}
		<div class="mb-4">
			<h4 class="text-md font-medium mb-2">Current Images:</h4>
			<div class="grid grid-cols-3 gap-2">
				{#each existingImages as image, index}
					<div class="relative aspect-square rounded-lg overflow-hidden bg-base-300">
						<img 
							src={image.startsWith('/images/') ? image : `https://file.macosplay.com/mxj3660ce5olheb/${image}`}
							alt={`Item ${itemId} - Image ${index + 1}`}
							class="w-full h-full object-cover"
						/>
						<div class="absolute bottom-1 right-1 bg-base-100/80 rounded px-1 text-xs">
							{index + 1}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
	
	<!-- Upload Area -->
	<div 
		class="border-2 border-dashed rounded-lg p-6 text-center transition-colors {dragOver ? 'border-primary bg-primary/10' : 'border-base-content/20'}"
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
	>
		{#if uploading}
			<div class="space-y-3">
				<div class="loading loading-spinner loading-lg text-primary"></div>
				<div class="text-sm">Uploading... {Math.round(uploadProgress)}%</div>
				<progress class="progress progress-primary w-full" value={uploadProgress} max="100"></progress>
			</div>
		{:else}
			<div class="space-y-3">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
				</svg>
				<div>
					<p class="text-base-content/70">Drag and drop images here, or</p>
					<label class="btn btn-outline btn-sm mt-2">
						Choose Files
						<input 
							type="file" 
							class="hidden" 
							multiple 
							accept="image/*"
							on:change={handleFileSelect}
						/>
					</label>
				</div>
				<p class="text-xs text-base-content/50">
					Supported: JPG, PNG, WebP (max 5MB each)
				</p>
			</div>
		{/if}
	</div>
	
	<!-- Image Naming Convention Info -->
	<div class="mt-4 p-3 bg-base-300 rounded-lg text-xs">
		<div class="font-semibold mb-1">Expected Image Names:</div>
		<div class="grid grid-cols-2 gap-1 text-base-content/70">
			<div>• {itemId}/main.jpg</div>
			<div>• {itemId}/detail1.jpg</div>
			<div>• {itemId}/detail2.jpg</div>
			<div>• {itemId}/back.jpg</div>
			<div>• {itemId}/side.jpg</div>
			<div>• {itemId}/accessories.jpg</div>
		</div>
	</div>
</div>