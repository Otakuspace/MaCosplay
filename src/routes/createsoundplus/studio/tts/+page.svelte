<script lang="ts">

	let textInput = '';
	let selectedVoice = 'en-US-1';
	let selectedSpeed = 1.0;
	let selectedPitch = 1.0;
	let isGenerating = false;
	let generatedAudio = null;

	const voices = [
		{ id: 'en-US-1', name: 'English (US) - Female 1' },
		{ id: 'en-US-2', name: 'English (US) - Male 1' },
		{ id: 'en-US-3', name: 'English (US) - Female 2' },
		{ id: 'en-GB-1', name: 'English (UK) - Female 1' },
		{ id: 'en-GB-2', name: 'English (UK) - Male 1' }
	];

	const maxCharacters = 500;

	function handleTextChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		if (target.value.length <= maxCharacters) {
			textInput = target.value;
		}
	}

	function generateTTS() {
		if (!textInput.trim()) return;
		
		isGenerating = true;
		// Simulate TTS generation
		setTimeout(() => {
			isGenerating = false;
			// In a real implementation, this would call the TTS API
			console.log('Generating TTS for:', textInput);
		}, 2000);
	}

	function downloadAudio() {
		if (generatedAudio) {
			// Implementation for downloading generated audio
			console.log('Downloading audio...');
		}
	}
</script>

<svelte:head>
	<title>TTS Studio - Create Sound Plus</title>
	<meta name="description" content="Text-to-Speech studio with character limit display and voice customization options" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
				TTS Studio
			</h1>
			<p class="text-lg text-gray-600 dark:text-gray-300">
				Transform your text into natural-sounding speech
			</p>
		</div>

		<!-- Main Content -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
			<!-- Text Input Section -->
			<div class="mb-6">
				<label for="text-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Text to Convert
				</label>
				<textarea
					id="text-input"
					bind:value={textInput}
					on:input={handleTextChange}
					placeholder="Enter your text here (max 500 characters)..."
					class="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
					maxlength={maxCharacters}
				></textarea>
				
				<!-- Character Count Display -->
				<div class="flex justify-between items-center mt-2">
					<span class="text-sm text-gray-500 dark:text-gray-400">
						{textInput.length} / {maxCharacters} characters
					</span>
					{#if textInput.length > maxCharacters * 0.8}
						<span class="text-sm text-orange-500 font-medium">
							{maxCharacters - textInput.length} characters remaining
						</span>
					{/if}
				</div>
				
				<!-- Progress Bar -->
				<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
					<div 
						class="h-2 rounded-full transition-all duration-300 {textInput.length > maxCharacters * 0.9 ? 'bg-red-500' : textInput.length > maxCharacters * 0.7 ? 'bg-orange-500' : 'bg-blue-500'}"
						style="width: {(textInput.length / maxCharacters) * 100}%"
					></div>
				</div>
			</div>

			<!-- Voice Settings -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<!-- Voice Selection -->
				<div>
					<label for="voice-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Voice
					</label>
					<select
						id="voice-select"
						bind:value={selectedVoice}
						class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
					>
						{#each voices as voice}
							<option value={voice.id}>{voice.name}</option>
						{/each}
					</select>
				</div>

				<!-- Speed Control -->
				<div>
					<label for="speed-range" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Speed: {selectedSpeed}x
					</label>
					<input
						id="speed-range"
						type="range"
						min="0.5"
						max="2.0"
						step="0.1"
						bind:value={selectedSpeed}
						class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
					/>
				</div>

				<!-- Pitch Control -->
				<div>
					<label for="pitch-range" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Pitch: {selectedPitch}x
					</label>
					<input
						id="pitch-range"
						type="range"
						min="0.5"
						max="2.0"
						step="0.1"
						bind:value={selectedPitch}
						class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
					/>
				</div>
			</div>

			<!-- Generate Button -->
			<div class="text-center">
				<button
					on:click={generateTTS}
					disabled={!textInput.trim() || isGenerating}
					class="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
				>
					{#if isGenerating}
						<div class="flex items-center justify-center">
							<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
							Generating...
						</div>
					{:else}
						Generate TTS
					{/if}
				</button>
			</div>
		</div>

		<!-- Generated Audio Section -->
		{#if generatedAudio}
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
				<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
					Generated Audio
				</h3>
				<div class="flex items-center justify-center space-x-4">
					<audio controls class="w-full max-w-md">
						<source src={generatedAudio} type="audio/mpeg" />
						Your browser does not support the audio element.
					</audio>
					<button
						on:click={downloadAudio}
						class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
					>
						Download
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
		border: none;
	}
</style>