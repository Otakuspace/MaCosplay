<script lang="ts">

	const studios = [
		{
			id: 'tts',
			title: 'TTS Studio',
			description: 'Transform your text into natural-sounding speech with customizable voices and settings.',
			icon: '🎤',
			href: '/createsoundplus/studio/tts',
			color: 'from-blue-500 to-indigo-600',
			bgColor: 'from-blue-50 to-indigo-100'
		},
		{
			id: 'emotion-turbo',
			title: 'Emotion Turbo Studio',
			description: 'Infuse your text with powerful emotional expression and intensity control.',
			icon: '⚡',
			href: '/createsoundplus/studio/emotion-turbo',
			color: 'from-purple-500 to-pink-600',
			bgColor: 'from-purple-50 to-pink-100'
		}
	];
</script>

<svelte:head>
	<title>Create Sound Plus - AI-Powered Audio Creation Studios</title>
	<meta name="description" content="Professional AI-powered audio creation studios for TTS, emotion enhancement, and more" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
				Create Sound Plus
			</h1>
			<p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
				Professional AI-powered audio creation studios for transforming text into high-quality speech and emotional audio content.
			</p>
		</div>

		<!-- Studios Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
			{#each studios as studio}
				<a 
					href={studio.href}
					class="group block transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
				>
					<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
						<!-- Studio Header -->
						<div class="bg-gradient-to-r {studio.color} p-6 text-white">
							<div class="flex items-center space-x-4">
								<span class="text-4xl">{studio.icon}</span>
								<div>
									<h3 class="text-2xl font-bold">{studio.title}</h3>
									<p class="text-blue-100 opacity-90">Professional Studio</p>
								</div>
							</div>
						</div>
						
						<!-- Studio Content -->
						<div class="p-6">
							<p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
								{studio.description}
							</p>
							
							<!-- Features -->
							<div class="space-y-2 mb-6">
								<div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
									<svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
									Character limit display
								</div>
								<div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
									<svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
									Real-time preview
								</div>
								<div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
									<svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
									High-quality output
								</div>
							</div>
							
							<!-- CTA Button -->
							<div class="text-center">
								<button class="w-full bg-gradient-to-r {studio.color} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 group-hover:shadow-lg">
									Open Studio
								</button>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- Additional Info -->
		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
				Why Choose Create Sound Plus?
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div class="text-center">
					<div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fast Processing</h3>
					<p class="text-gray-600 dark:text-gray-300">Generate high-quality audio in seconds with our optimized AI models.</p>
				</div>
				
				<div class="text-center">
					<div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Professional Quality</h3>
					<p class="text-gray-600 dark:text-gray-300">Studio-grade audio output suitable for professional projects and content creation.</p>
				</div>
				
				<div class="text-center">
					<div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
					<p class="text-gray-600 dark:text-gray-300">Your content stays private and secure with enterprise-grade security measures.</p>
				</div>
			</div>
		</div>
	</div>
</div>