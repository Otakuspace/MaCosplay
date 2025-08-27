<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let imageUrl: string;
	export let isOpen = false;
	export let photoTitle = '';

	const dispatch = createEventDispatcher();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let image: HTMLImageElement;
	let originalImageData: ImageData;
	let isLoading = false;
	let activeTab = 'filters';

	// Editing parameters
	let brightness = 0;
	let contrast = 0;
	let saturation = 0;
	let hue = 0;
	let blur = 0;
	let sharpness = 0;
	let vignette = 0;
	let sepia = 0;
	let grayscale = 0;
	let temperature = 0;
	let exposure = 0;
	let highlights = 0;
	let shadows = 0;
	let vibrance = 0;

	// Crop parameters
	let cropX = 0;
	let cropY = 0;
	let cropWidth = 100;
	let cropHeight = 100;
	let isCropping = false;
	let cropAspectRatio = 'free';

	// Preset filters
	const presetFilters = [
		{
			name: 'Original',
			id: 'original',
			settings: { brightness: 0, contrast: 0, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 0 }
		},
		{
			name: 'Cosplay Vivid',
			id: 'vivid',
			settings: { brightness: 5, contrast: 15, saturation: 20, hue: 0, blur: 0, sepia: 0, grayscale: 0, vibrance: 15 }
		},
		{
			name: 'Anime Style',
			id: 'anime',
			settings: { brightness: 10, contrast: 20, saturation: 30, hue: 5, blur: 0, sepia: 0, grayscale: 0, sharpness: 10 }
		},
		{
			name: 'Soft Portrait',
			id: 'soft',
			settings: { brightness: 8, contrast: -5, saturation: -10, hue: 0, blur: 1, sepia: 0, grayscale: 0, highlights: -10 }
		},
		{
			name: 'Dramatic',
			id: 'dramatic',
			settings: { brightness: -5, contrast: 25, saturation: 10, hue: 0, blur: 0, sepia: 0, grayscale: 0, shadows: 15, highlights: -15 }
		},
		{
			name: 'Vintage Cosplay',
			id: 'vintage',
			settings: { brightness: 5, contrast: 10, saturation: -15, hue: 10, blur: 0, sepia: 20, grayscale: 0, temperature: 10 }
		},
		{
			name: 'Cool Tone',
			id: 'cool',
			settings: { brightness: 0, contrast: 5, saturation: 5, hue: -10, blur: 0, sepia: 0, grayscale: 0, temperature: -20 }
		},
		{
			name: 'Warm Tone',
			id: 'warm',
			settings: { brightness: 5, contrast: 5, saturation: 10, hue: 10, blur: 0, sepia: 0, grayscale: 0, temperature: 20 }
		},
		{
			name: 'Black & White',
			id: 'bw',
			settings: { brightness: 0, contrast: 15, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 100 }
		}
	];

	// Cosplay-specific effects
	const cosplayEffects = [
		{ name: 'Magical Sparkle', id: 'sparkle' },
		{ name: 'Anime Glow', id: 'glow' },
		{ name: 'Fantasy Aura', id: 'aura' },
		{ name: 'Cyberpunk Neon', id: 'neon' },
		{ name: 'Soft Focus', id: 'soft-focus' }
	];

	onMount(() => {
		if (isOpen && imageUrl) {
			loadImage();
		}
	});

	$: if (isOpen && imageUrl) {
		loadImage();
	}

	$: if (canvas && originalImageData) {
		applyFilters();
	}

	async function loadImage() {
		isLoading = true;
		try {
			image = new Image();
			image.crossOrigin = 'anonymous';
			
			image.onload = () => {
				setupCanvas();
				isLoading = false;
			};
			
			image.onerror = () => {
				console.error('Failed to load image');
				isLoading = false;
			};
			
			image.src = imageUrl;
		} catch (error) {
			console.error('Error loading image:', error);
			isLoading = false;
		}
	}

	function setupCanvas() {
		if (!canvas || !image) return;
		
		ctx = canvas.getContext('2d')!;
		
		// Set canvas size to fit container while maintaining aspect ratio
		const maxWidth = 800;
		const maxHeight = 600;
		
		let { width, height } = image;
		
		if (width > maxWidth) {
			height = (height * maxWidth) / width;
			width = maxWidth;
		}
		
		if (height > maxHeight) {
			width = (width * maxHeight) / height;
			height = maxHeight;
		}
		
		canvas.width = width;
		canvas.height = height;
		
		// Draw original image and store image data
		ctx.drawImage(image, 0, 0, width, height);
		originalImageData = ctx.getImageData(0, 0, width, height);
	}

	function applyFilters() {
		if (!ctx || !originalImageData) return;
		
		// Reset canvas with original image
		ctx.putImageData(originalImageData, 0, 0);
		
		// Apply CSS filters for performance
		let filterString = '';
		
		if (brightness !== 0) filterString += `brightness(${100 + brightness}%) `;
		if (contrast !== 0) filterString += `contrast(${100 + contrast}%) `;
		if (saturation !== 0) filterString += `saturate(${100 + saturation}%) `;
		if (hue !== 0) filterString += `hue-rotate(${hue}deg) `;
		if (blur > 0) filterString += `blur(${blur}px) `;
		if (sepia > 0) filterString += `sepia(${sepia}%) `;
		if (grayscale > 0) filterString += `grayscale(${grayscale}%) `;
		
		canvas.style.filter = filterString;
		
		// Apply advanced filters via image processing
		if (sharpness > 0 || vignette > 0 || temperature !== 0 || exposure !== 0) {
			applyAdvancedFilters();
		}
	}

	function applyAdvancedFilters() {
		if (!ctx || !originalImageData) return;
		
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imageData.data;
		
		for (let i = 0; i < data.length; i += 4) {
			let r = data[i];
			let g = data[i + 1];
			let b = data[i + 2];
			
			// Temperature adjustment
			if (temperature !== 0) {
				if (temperature > 0) {
					r = Math.min(255, r + temperature * 2);
					b = Math.max(0, b - temperature);
				} else {
					r = Math.max(0, r + temperature);
					b = Math.min(255, b - temperature * 2);
				}
			}
			
			// Exposure adjustment
			if (exposure !== 0) {
				const factor = Math.pow(2, exposure / 100);
				r = Math.min(255, r * factor);
				g = Math.min(255, g * factor);
				b = Math.min(255, b * factor);
			}
			
			// Vibrance (selective saturation)
			if (vibrance !== 0) {
				const max = Math.max(r, g, b);
				const avg = (r + g + b) / 3;
				const amt = (Math.abs(max - avg) * 2 / 255) * (vibrance / 100);
				
				if (max !== avg) {
					r += (r - avg) * amt;
					g += (g - avg) * amt;
					b += (b - avg) * amt;
				}
			}
			
			data[i] = Math.max(0, Math.min(255, r));
			data[i + 1] = Math.max(0, Math.min(255, g));
			data[i + 2] = Math.max(0, Math.min(255, b));
		}
		
		// Apply vignette effect
		if (vignette > 0) {
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;
			const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
			
			for (let y = 0; y < canvas.height; y++) {
				for (let x = 0; x < canvas.width; x++) {
					const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
					const vignetteFactor = 1 - (distance / maxDistance) * (vignette / 100);
					const index = (y * canvas.width + x) * 4;
					
					data[index] *= vignetteFactor;
					data[index + 1] *= vignetteFactor;
					data[index + 2] *= vignetteFactor;
				}
			}
		}
		
		ctx.putImageData(imageData, 0, 0);
	}

	function applyPreset(preset: any) {
		brightness = preset.settings.brightness || 0;
		contrast = preset.settings.contrast || 0;
		saturation = preset.settings.saturation || 0;
		hue = preset.settings.hue || 0;
		blur = preset.settings.blur || 0;
		sepia = preset.settings.sepia || 0;
		grayscale = preset.settings.grayscale || 0;
		sharpness = preset.settings.sharpness || 0;
		temperature = preset.settings.temperature || 0;
		vibrance = preset.settings.vibrance || 0;
		highlights = preset.settings.highlights || 0;
		shadows = preset.settings.shadows || 0;
		exposure = preset.settings.exposure || 0;
	}

	function resetAll() {
		brightness = 0;
		contrast = 0;
		saturation = 0;
		hue = 0;
		blur = 0;
		sharpness = 0;
		vignette = 0;
		sepia = 0;
		grayscale = 0;
		temperature = 0;
		exposure = 0;
		highlights = 0;
		shadows = 0;
		vibrance = 0;
	}

	function saveImage() {
		if (!canvas) return;
		
		const dataURL = canvas.toDataURL('image/png', 0.9);
		dispatch('imageSaved', { 
			dataURL, 
			title: `${photoTitle} (Edited)`,
			settings: {
				brightness, contrast, saturation, hue, blur, sharpness,
				vignette, sepia, grayscale, temperature, exposure,
				highlights, shadows, vibrance
			}
		});
	}

	function downloadImage() {
		if (!canvas) return;
		
		const link = document.createElement('a');
		link.download = `${photoTitle}-edited.png`;
		link.href = canvas.toDataURL('image/png', 0.9);
		link.click();
	}

	function handleClose() {
		dispatch('close');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- Modal Backdrop -->
	<div 
		class="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
		on:click={handleClose}
	>
		<!-- Modal Content -->
		<div 
			class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col"
			on:click={(e) => e.stopPropagation()}
		>
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div>
					<h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
						<svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
						</svg>
						Photo Editor
					</h2>
					<p class="text-sm text-gray-500 dark:text-gray-400">{photoTitle}</p>
				</div>
				<div class="flex items-center space-x-3">
					<button 
						on:click={resetAll}
						class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
					>
						Reset All
					</button>
					<button 
						on:click={downloadImage}
						class="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
					>
						Download
					</button>
					<button 
						on:click={saveImage}
						class="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
					>
						Save to Gallery
					</button>
					<button 
						on:click={handleClose}
						class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					>
						<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
			</div>

			<div class="flex flex-1 overflow-hidden">
				<!-- Canvas Area -->
				<div class="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-6">
					{#if isLoading}
						<div class="flex flex-col items-center">
							<div class="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
							<p class="text-gray-600 dark:text-gray-400">Loading image...</p>
						</div>
					{:else}
						<canvas 
							bind:this={canvas}
							class="max-w-full max-h-full object-contain rounded-lg shadow-lg"
						></canvas>
					{/if}
				</div>

				<!-- Controls Panel -->
				<div class="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
					<!-- Tabs -->
					<div class="flex border-b border-gray-200 dark:border-gray-700">
						<button
							class="flex-1 px-4 py-3 text-sm font-medium transition-colors"
							class:bg-purple-50={activeTab === 'filters'}
							class:dark:bg-purple-900={activeTab === 'filters'}
							class:text-purple-600={activeTab === 'filters'}
							class:dark:text-purple-400={activeTab === 'filters'}
							class:text-gray-500={activeTab !== 'filters'}
							class:dark:text-gray-400={activeTab !== 'filters'}
							on:click={() => activeTab = 'filters'}
						>
							Filters
						</button>
						<button
							class="flex-1 px-4 py-3 text-sm font-medium transition-colors"
							class:bg-purple-50={activeTab === 'adjust'}
							class:dark:bg-purple-900={activeTab === 'adjust'}
							class:text-purple-600={activeTab === 'adjust'}
							class:dark:text-purple-400={activeTab === 'adjust'}
							class:text-gray-500={activeTab !== 'adjust'}
							class:dark:text-gray-400={activeTab !== 'adjust'}
							on:click={() => activeTab = 'adjust'}
						>
							Adjust
						</button>
						<button
							class="flex-1 px-4 py-3 text-sm font-medium transition-colors"
							class:bg-purple-50={activeTab === 'effects'}
							class:dark:bg-purple-900={activeTab === 'effects'}
							class:text-purple-600={activeTab === 'effects'}
							class:dark:text-purple-400={activeTab === 'effects'}
							class:text-gray-500={activeTab !== 'effects'}
							class:dark:text-gray-400={activeTab !== 'effects'}
							on:click={() => activeTab = 'effects'}
						>
							Effects
						</button>
					</div>

					<!-- Content -->
					<div class="flex-1 overflow-y-auto p-4">
						{#if activeTab === 'filters'}
							<!-- Preset Filters -->
							<div class="space-y-4">
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Preset Filters</h3>
								<div class="grid grid-cols-2 gap-3">
									{#each presetFilters as preset}
										<button
											class="p-3 rounded-xl border-2 transition-all duration-300 text-center hover:shadow-md"
											class:border-purple-500={false}
											class:bg-purple-50={false}
											class:dark:bg-purple-900={false}
											class:border-gray-200={true}
											class:dark:border-gray-700={true}
											on:click={() => applyPreset(preset)}
										>
											<div class="text-sm font-medium text-gray-900 dark:text-white mb-1">
												{preset.name}
											</div>
										</button>
									{/each}
								</div>
							</div>
						{:else if activeTab === 'adjust'}
							<!-- Manual Adjustments -->
							<div class="space-y-6">
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Manual Adjustments</h3>
								
								<!-- Basic Adjustments -->
								<div class="space-y-4">
									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Brightness: {brightness}
										</label>
										<input 
											type="range" 
											min="-50" 
											max="50" 
											bind:value={brightness}
											class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
										/>
									</div>

									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Contrast: {contrast}
										</label>
										<input 
											type="range" 
											min="-50" 
											max="50" 
											bind:value={contrast}
											class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
										/>
									</div>

									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Saturation: {saturation}
										</label>
										<input 
											type="range" 
											min="-50" 
											max="50" 
											bind:value={saturation}
											class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
										/>
									</div>

									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Hue: {hue}°
										</label>
										<input 
											type="range" 
											min="-180" 
											max="180" 
											bind:value={hue}
											class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
										/>
									</div>

									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Temperature: {temperature}
										</label>
										<input 
											type="range" 
											min="-50" 
											max="50" 
											bind:value={temperature}
											class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
										/>
									</div>

									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Exposure: {exposure}
										</label>
										<input 
											type="range" 
											min="-100" 
											max="100" 
											bind:value={exposure}
											class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
										/>
									</div>

									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Vibrance: {vibrance}
										</label>
										<input 
											type="range" 
											min="-50" 
											max="50" 
											bind:value={vibrance}
											class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
										/>
									</div>

									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Vignette: {vignette}
										</label>
										<input 
											type="range" 
											min="0" 
											max="100" 
											bind:value={vignette}
											class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
										/>
									</div>
								</div>
							</div>
						{:else if activeTab === 'effects'}
							<!-- Special Effects -->
							<div class="space-y-6">
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Special Effects</h3>
								
								<div class="space-y-4">
									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Blur: {blur}px
										</label>
										<input 
											type="range" 
											min="0" 
											max="10" 
											step="0.1"
											bind:value={blur}
											class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
										/>
									</div>

									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Sepia: {sepia}%
										</label>
										<input 
											type="range" 
											min="0" 
											max="100" 
											bind:value={sepia}
											class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
										/>
									</div>

									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Grayscale: {grayscale}%
										</label>
										<input 
											type="range" 
											min="0" 
											max="100" 
											bind:value={grayscale}
											class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
										/>
									</div>
								</div>

								<!-- Cosplay Effects -->
								<div class="mt-8">
									<h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">Cosplay Effects</h4>
									<div class="grid grid-cols-1 gap-3">
										{#each cosplayEffects as effect}
											<button
												class="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-all duration-300 text-left"
											>
												<div class="text-sm font-medium text-gray-900 dark:text-white">
													{effect.name}
												</div>
												<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
													Coming soon...
												</div>
											</button>
										{/each}
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: linear-gradient(45deg, #8b5cf6, #ec4899);
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.slider::-webkit-slider-thumb:hover {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		transform: scale(1.1);
	}

	.slider::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: linear-gradient(45deg, #8b5cf6, #ec4899);
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}
</style>