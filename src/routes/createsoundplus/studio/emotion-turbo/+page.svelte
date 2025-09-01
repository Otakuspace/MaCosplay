<script lang="ts">

	let textInput = '';
	let selectedEmotion = 'happy';
	let selectedIntensity = 'medium';
	let isGenerating = false;
	let generatedAudio = null;

	const emotions = [
		{ id: 'happy', name: 'Happy', icon: '😊' },
		{ id: 'sad', name: 'Sad', icon: '😢' },
		{ id: 'angry', name: 'Angry', icon: '😠' },
		{ id: 'excited', name: 'Excited', icon: '🤩' },
		{ id: 'calm', name: 'Calm', icon: '😌' },
		{ id: 'mysterious', name: 'Mysterious', icon: '😏' }
	];

	const intensities = [
		{ id: 'low', name: 'Low' },
		{ id: 'medium', name: 'Medium' },
		{ id: 'high', name: 'High' }
	];

	const maxCharacters = 300;

	function handleTextChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		if (target.value.length <= maxCharacters) {
			textInput = target.value;
		}
	}

	function generateEmotionTurbo() {
		if (!textInput.trim()) return;
		
		isGenerating = true;
		// Simulate emotion-turbo generation
		setTimeout(() => {
			isGenerating = false;
			// In a real implementation, this would call the emotion-turbo API
			console.log('Generating emotion-turbo for:', textInput);
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
	<title>Emotion Turbo Studio - Create Sound Plus</title>
	<meta name="description" content="Emotion Turbo studio with character limit display and emotion customization options" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
				Emotion Turbo Studio
			</h1>
			<p class="text-lg text-gray-600 dark:text-gray-300">
				Infuse your text with powerful emotional expression
			</p>
		</div>

		<!-- Main Content -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
			<!-- Text Input Section -->
			<div class="mb-6">
				<label for="text-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Text to Enhance
				</label>
				<textarea
					id="text-input"
					bind:value={textInput}
					on:input={handleTextChange}
					placeholder="Enter your text here (max 300 characters)..."
					class="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
						class="h-2 rounded-full transition-all duration-300 {textInput.length > maxCharacters * 0.9 ? 'bg-red-500' : textInput.length > maxCharacters * 0.7 ? 'bg-orange-500' : 'bg-purple-500'}"
						style="width: {(textInput.length / maxCharacters) * 100}%"
					></div>
				</div>
			</div>

			<!-- Emotion Settings -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<!-- Emotion Selection -->
				<div>
					<label for="emotion-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Emotion
					</label>
					<select
						id="emotion-select"
						bind:value={selectedEmotion}
						class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
					>
						{#each emotions as emotion}
							<option value={emotion.id}>{emotion.icon} {emotion.name}</option>
						{/each}
					</select>
				</div>

				<!-- Intensity Control -->
				<div>
					<label for="intensity-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Intensity
					</label>
					<select
						id="intensity-select"
						bind:value={selectedIntensity}
						class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
					>
						{#each intensities as intensity}
							<option value={intensity.id}>{intensity.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Generate Button -->
			<div class="text-center">
				<button
					on:click={generateEmotionTurbo}
					disabled={!textInput.trim() || isGenerating}
					class="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
				>
					{#if isGenerating}
						<div class="flex items-center justify-center">
							<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
							Generating...
						</div>
					{:else}
						Generate Emotion Turbo
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