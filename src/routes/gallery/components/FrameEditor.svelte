<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let imageUrl: string;
	export let isOpen = false;

	const dispatch = createEventDispatcher();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let image: HTMLImageElement;
	let frameImage: HTMLImageElement | null = null;
	let selectedFrame = '';
	let isLoading = false;
	let canvasWidth = 800;
	let canvasHeight = 600;

	// Cosplay-themed frames
	const frames = [
		{
			id: 'none',
			name: 'No Frame',
			preview: null,
			description: 'Original photo without frame'
		},
		{
			id: 'anime-border',
			name: 'Anime Border',
			preview: null,
			description: 'Classic anime-style decorative border'
		},
		{
			id: 'magical-girl',
			name: 'Magical Girl',
			preview: null,
			description: 'Sparkly magical girl themed frame'
		},
		{
			id: 'gothic-lolita',
			name: 'Gothic Lolita',
			preview: null,
			description: 'Elegant gothic lolita style frame'
		},
		{
			id: 'cyberpunk',
			name: 'Cyberpunk',
			preview: null,
			description: 'Futuristic cyberpunk themed border'
		},
		{
			id: 'fantasy-rpg',
			name: 'Fantasy RPG',
			preview: null,
			description: 'Medieval fantasy game style frame'
		},
		{
			id: 'mecha',
			name: 'Mecha',
			preview: null,
			description: 'Robot/mecha themed industrial frame'
		},
		{
			id: 'kawaii',
			name: 'Kawaii',
			preview: null,
			description: 'Cute kawaii style with hearts and stars'
		}
	];

	// Frame effects and filters
	const effects = [
		{
			id: 'none',
			name: 'Original',
			filter: ''
		},
		{
			id: 'vintage',
			name: 'Vintage',
			filter: 'sepia(0.5) contrast(1.2) brightness(1.1)'
		},
		{
			id: 'dramatic',
			name: 'Dramatic',
			filter: 'contrast(1.3) saturate(1.2) brightness(0.9)'
		},
		{
			id: 'soft',
			name: 'Soft',
			filter: 'blur(0.5px) brightness(1.1) saturate(0.8)'
		},
		{
			id: 'cool',
			name: 'Cool Tone',
			filter: 'hue-rotate(180deg) saturate(1.1)'
		},
		{
			id: 'warm',
			name: 'Warm Tone',
			filter: 'hue-rotate(-30deg) saturate(1.2) brightness(1.1)'
		}
	];

	let selectedEffect = 'none';
	let brightness = 100;
	let contrast = 100;
	let saturation = 100;

	onMount(() => {
		if (canvas) {
			ctx = canvas.getContext('2d')!;
			loadImage();
		}
	});

	function loadImage() {
		if (!imageUrl) return;
		
		isLoading = true;
		image = new Image();
		image.crossOrigin = 'anonymous';
		
		image.onload = () => {
			// Calculate canvas dimensions maintaining aspect ratio
			const aspectRatio = image.width / image.height;
			if (aspectRatio > 1) {
				canvasWidth = 800;
				canvasHeight = 800 / aspectRatio;
			} else {
				canvasHeight = 600;
				canvasWidth = 600 * aspectRatio;
			}
			
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			
			drawImage();
			isLoading = false;
		};
		
		image.onerror = () => {
			isLoading = false;
			console.error('Failed to load image');
		};
		
		image.src = imageUrl;
	}

	function drawImage() {
		if (!ctx || !image) return;

		// Clear canvas
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		// Apply filters
		const filterStr = getFilterString();
		ctx.filter = filterStr;

		// Draw main image
		ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

		// Reset filter for frame
		ctx.filter = 'none';

		// Draw frame if selected
		if (selectedFrame !== 'none' && frameImage) {
			ctx.drawImage(frameImage, 0, 0, canvasWidth, canvasHeight);
		} else if (selectedFrame !== 'none') {
			drawProgrammaticFrame();
		}
	}

	function getFilterString() {
		const baseEffect = effects.find(e => e.id === selectedEffect)?.filter || '';
		const customFilters = [
			`brightness(${brightness}%)`,
			`contrast(${contrast}%)`,
			`saturate(${saturation}%)`
		].join(' ');

		return baseEffect ? `${baseEffect} ${customFilters}` : customFilters;
	}

	function drawProgrammaticFrame() {
		if (!ctx) return;

		const borderWidth = Math.min(canvasWidth, canvasHeight) * 0.05;
		
		switch (selectedFrame) {
			case 'anime-border':
				drawAnimeBorder(borderWidth);
				break;
			case 'magical-girl':
				drawMagicalGirlFrame(borderWidth);
				break;
			case 'gothic-lolita':
				drawGothicFrame(borderWidth);
				break;
			case 'cyberpunk':
				drawCyberpunkFrame(borderWidth);
				break;
			case 'fantasy-rpg':
				drawFantasyFrame(borderWidth);
				break;
			case 'mecha':
				drawMechaFrame(borderWidth);
				break;
			case 'kawaii':
				drawKawaiiFrame(borderWidth);
				break;
		}
	}

	function drawAnimeBorder(borderWidth: number) {
		// Classic anime-style border with gradient
		const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
		gradient.addColorStop(0, '#FF69B4');
		gradient.addColorStop(0.5, '#9370DB');
		gradient.addColorStop(1, '#4169E1');

		ctx.strokeStyle = gradient;
		ctx.lineWidth = borderWidth;
		ctx.strokeRect(borderWidth/2, borderWidth/2, canvasWidth - borderWidth, canvasHeight - borderWidth);

		// Inner decorative border
		ctx.strokeStyle = '#FFD700';
		ctx.lineWidth = 2;
		ctx.strokeRect(borderWidth - 5, borderWidth - 5, canvasWidth - (borderWidth - 5) * 2, canvasHeight - (borderWidth - 5) * 2);
	}

	function drawMagicalGirlFrame(borderWidth: number) {
		// Sparkly magical girl frame
		const gradient = ctx.createRadialGradient(canvasWidth/2, canvasHeight/2, 0, canvasWidth/2, canvasHeight/2, Math.max(canvasWidth, canvasHeight)/2);
		gradient.addColorStop(0, 'rgba(255, 192, 203, 0.3)');
		gradient.addColorStop(1, 'rgba(255, 105, 180, 0.8)');

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvasWidth, borderWidth);
		ctx.fillRect(0, canvasHeight - borderWidth, canvasWidth, borderWidth);
		ctx.fillRect(0, 0, borderWidth, canvasHeight);
		ctx.fillRect(canvasWidth - borderWidth, 0, borderWidth, canvasHeight);

		// Add stars
		drawStars();
	}

	function drawGothicFrame(borderWidth: number) {
		// Gothic lolita style frame
		ctx.fillStyle = '#2F1B2E';
		ctx.fillRect(0, 0, canvasWidth, borderWidth);
		ctx.fillRect(0, canvasHeight - borderWidth, canvasWidth, borderWidth);
		ctx.fillRect(0, 0, borderWidth, canvasHeight);
		ctx.fillRect(canvasWidth - borderWidth, 0, borderWidth, canvasHeight);

		// Add lace-like pattern
		ctx.strokeStyle = '#8B4B8B';
		ctx.lineWidth = 2;
		for (let i = 0; i < canvasWidth; i += 20) {
			ctx.beginPath();
			ctx.arc(i, borderWidth/2, 5, 0, Math.PI * 2);
			ctx.stroke();
		}
	}

	function drawCyberpunkFrame(borderWidth: number) {
		// Futuristic cyberpunk frame
		const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
		gradient.addColorStop(0, '#00FFFF');
		gradient.addColorStop(0.5, '#FF00FF');
		gradient.addColorStop(1, '#00FFFF');

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvasWidth, borderWidth);
		ctx.fillRect(0, canvasHeight - borderWidth, canvasWidth, borderWidth);
		ctx.fillRect(0, 0, borderWidth, canvasHeight);
		ctx.fillRect(canvasWidth - borderWidth, 0, borderWidth, canvasHeight);

		// Add circuit-like lines
		ctx.strokeStyle = '#00FF00';
		ctx.lineWidth = 2;
		drawCircuitPattern();
	}

	function drawFantasyFrame(borderWidth: number) {
		// Medieval fantasy frame
		ctx.fillStyle = '#8B4513';
		ctx.fillRect(0, 0, canvasWidth, borderWidth);
		ctx.fillRect(0, canvasHeight - borderWidth, canvasWidth, borderWidth);
		ctx.fillRect(0, 0, borderWidth, canvasHeight);
		ctx.fillRect(canvasWidth - borderWidth, 0, borderWidth, canvasHeight);

		// Add ornate decorations
		ctx.fillStyle = '#DAA520';
		drawOrnateCorners(borderWidth);
	}

	function drawMechaFrame(borderWidth: number) {
		// Industrial mecha frame
		ctx.fillStyle = '#36454F';
		ctx.fillRect(0, 0, canvasWidth, borderWidth);
		ctx.fillRect(0, canvasHeight - borderWidth, canvasWidth, borderWidth);
		ctx.fillRect(0, 0, borderWidth, canvasHeight);
		ctx.fillRect(canvasWidth - borderWidth, 0, borderWidth, canvasHeight);

		// Add metal rivets
		ctx.fillStyle = '#C0C0C0';
		drawRivets(borderWidth);
	}

	function drawKawaiiFrame(borderWidth: number) {
		// Cute kawaii frame with hearts and stars
		const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
		gradient.addColorStop(0, '#FFB6C1');
		gradient.addColorStop(0.5, '#FFC0CB');
		gradient.addColorStop(1, '#FFB6C1');

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvasWidth, borderWidth);
		ctx.fillRect(0, canvasHeight - borderWidth, canvasWidth, borderWidth);
		ctx.fillRect(0, 0, borderWidth, canvasHeight);
		ctx.fillRect(canvasWidth - borderWidth, 0, borderWidth, canvasHeight);

		// Add hearts and stars
		drawHeartsAndStars();
	}

	function drawStars() {
		ctx.fillStyle = '#FFD700';
		for (let i = 0; i < 20; i++) {
			const x = Math.random() * canvasWidth;
			const y = Math.random() * canvasHeight;
			drawStar(x, y, 5, 3, 1.5);
		}
	}

	function drawStar(x: number, y: number, spikes: number, outerRadius: number, innerRadius: number) {
		let rot = Math.PI / 2 * 3;
		let step = Math.PI / spikes;

		ctx.beginPath();
		ctx.moveTo(x, y - outerRadius);

		for (let i = 0; i < spikes; i++) {
			ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
			rot += step;
			ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
			rot += step;
		}

		ctx.lineTo(x, y - outerRadius);
		ctx.closePath();
		ctx.fill();
	}

	function drawCircuitPattern() {
		// Simple circuit-like pattern
		for (let i = 0; i < 10; i++) {
			const x = Math.random() * canvasWidth;
			const y = Math.random() * canvasHeight;
			ctx.beginPath();
			ctx.rect(x, y, 10, 2);
			ctx.stroke();
		}
	}

	function drawOrnateCorners(borderWidth: number) {
		// Simple ornate corner decorations
		const cornerSize = borderWidth * 0.8;
		// Top-left
		ctx.beginPath();
		ctx.arc(cornerSize, cornerSize, cornerSize/2, 0, Math.PI * 2);
		ctx.fill();
		// Top-right
		ctx.beginPath();
		ctx.arc(canvasWidth - cornerSize, cornerSize, cornerSize/2, 0, Math.PI * 2);
		ctx.fill();
		// Bottom-left
		ctx.beginPath();
		ctx.arc(cornerSize, canvasHeight - cornerSize, cornerSize/2, 0, Math.PI * 2);
		ctx.fill();
		// Bottom-right
		ctx.beginPath();
		ctx.arc(canvasWidth - cornerSize, canvasHeight - cornerSize, cornerSize/2, 0, Math.PI * 2);
		ctx.fill();
	}

	function drawRivets(borderWidth: number) {
		const rivetSize = 4;
		const spacing = 30;
		
		// Top and bottom rivets
		for (let x = spacing; x < canvasWidth - spacing; x += spacing) {
			ctx.beginPath();
			ctx.arc(x, borderWidth/2, rivetSize, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(x, canvasHeight - borderWidth/2, rivetSize, 0, Math.PI * 2);
			ctx.fill();
		}
		
		// Left and right rivets
		for (let y = spacing; y < canvasHeight - spacing; y += spacing) {
			ctx.beginPath();
			ctx.arc(borderWidth/2, y, rivetSize, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(canvasWidth - borderWidth/2, y, rivetSize, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	function drawHeartsAndStars() {
		// Hearts
		ctx.fillStyle = '#FF1493';
		for (let i = 0; i < 15; i++) {
			const x = Math.random() * canvasWidth;
			const y = Math.random() * canvasHeight;
			drawHeart(x, y, 8);
		}
		
		// Stars
		ctx.fillStyle = '#FFD700';
		for (let i = 0; i < 10; i++) {
			const x = Math.random() * canvasWidth;
			const y = Math.random() * canvasHeight;
			drawStar(x, y, 5, 4, 2);
		}
	}

	function drawHeart(x: number, y: number, size: number) {
		ctx.beginPath();
		ctx.moveTo(x, y + size/4);
		ctx.bezierCurveTo(x, y, x - size/2, y, x - size/2, y + size/4);
		ctx.bezierCurveTo(x - size/2, y + size/2, x, y + size, x, y + size);
		ctx.bezierCurveTo(x, y + size, x + size/2, y + size/2, x + size/2, y + size/4);
		ctx.bezierCurveTo(x + size/2, y, x, y, x, y + size/4);
		ctx.fill();
	}

	function selectFrame(frameId: string) {
		selectedFrame = frameId;
		drawImage();
	}

	function selectEffect(effectId: string) {
		selectedEffect = effectId;
		drawImage();
	}

	function updateBrightness(value: number) {
		brightness = value;
		drawImage();
	}

	function updateContrast(value: number) {
		contrast = value;
		drawImage();
	}

	function updateSaturation(value: number) {
		saturation = value;
		drawImage();
	}

	function saveFramedImage() {
		if (!canvas) return;
		
		const dataURL = canvas.toDataURL('image/png');
		dispatch('imageSaved', { dataURL, frameId: selectedFrame });
	}

	function resetSettings() {
		selectedFrame = 'none';
		selectedEffect = 'none';
		brightness = 100;
		contrast = 100;
		saturation = 100;
		drawImage();
	}

	function handleClose() {
		dispatch('close');
	}

	$: if (canvas && image) {
		drawImage();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
		<div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
			<!-- Header -->
			<div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-3xl">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
						Photo Frame Editor
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

			<div class="p-6">
				<div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
					<!-- Canvas Preview -->
					<div class="xl:col-span-2">
						<div class="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 flex items-center justify-center min-h-[400px]">
							{#if isLoading}
								<div class="flex items-center space-x-2 text-gray-500">
									<svg class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
									</svg>
									<span>Loading image...</span>
								</div>
							{:else}
								<canvas 
									bind:this={canvas}
									class="max-w-full max-h-full border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg"
								></canvas>
							{/if}
						</div>
					</div>

					<!-- Controls Panel -->
					<div class="space-y-6">
						<!-- Frame Selection -->
						<div>
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cosplay Frames</h3>
							<div class="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
								{#each frames as frame}
									<button
										class="p-3 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md"
										class:border-purple-500={selectedFrame === frame.id}
										class:bg-purple-50={selectedFrame === frame.id}
										class:dark:bg-purple-900={selectedFrame === frame.id}
										class:border-gray-200={selectedFrame !== frame.id}
										class:dark:border-gray-600={selectedFrame !== frame.id}
										on:click={() => selectFrame(frame.id)}
									>
										<div class="font-medium text-sm text-gray-900 dark:text-white">{frame.name}</div>
										<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{frame.description}</div>
									</button>
								{/each}
							</div>
						</div>

						<!-- Effect Selection -->
						<div>
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Effects</h3>
							<div class="grid grid-cols-2 gap-2">
								{#each effects as effect}
									<button
										class="p-2 border rounded-lg text-sm transition-colors"
										class:border-purple-500={selectedEffect === effect.id}
										class:bg-purple-50={selectedEffect === effect.id}
										class:dark:bg-purple-900={selectedEffect === effect.id}
										class:border-gray-200={selectedEffect !== effect.id}
										class:dark:border-gray-600={selectedEffect !== effect.id}
										on:click={() => selectEffect(effect.id)}
									>
										{effect.name}
									</button>
								{/each}
							</div>
						</div>

						<!-- Adjustment Controls -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Adjustments</h3>
							
							<!-- Brightness -->
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Brightness: {brightness}%
								</label>
								<input
									type="range"
									min="50"
									max="150"
									bind:value={brightness}
									on:input={(e) => updateBrightness(parseInt(e.target.value))}
									class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
								/>
							</div>

							<!-- Contrast -->
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Contrast: {contrast}%
								</label>
								<input
									type="range"
									min="50"
									max="150"
									bind:value={contrast}
									on:input={(e) => updateContrast(parseInt(e.target.value))}
									class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
								/>
							</div>

							<!-- Saturation -->
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Saturation: {saturation}%
								</label>
								<input
									type="range"
									min="0"
									max="200"
									bind:value={saturation}
									on:input={(e) => updateSaturation(parseInt(e.target.value))}
									class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
								/>
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
							<button
								on:click={saveFramedImage}
								class="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
							>
								Save Framed Image
							</button>
							
							<button
								on:click={resetSettings}
								class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
							>
								Reset Settings
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}