<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let error: any;
	export let status: number;

	$: errorMessage = error?.message || 'An unexpected error occurred';
	$: isUrlError = errorMessage.includes('URL format') || errorMessage.includes('Invalid shop') || errorMessage.includes('Invalid outfit');
</script>

<svelte:head>
	<title>Error {status} - MaCosplay</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
	<div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
		<div class="mb-6">
			{#if status === 400 && isUrlError}
				<div class="text-6xl mb-4">🔗</div>
				<h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Invalid URL Format</h1>
				<p class="text-gray-600 dark:text-gray-300 mb-6">
					The URL you're trying to access doesn't match the expected format for our store pages.
				</p>
			{:else if status === 503}
				<div class="text-6xl mb-4">🔧</div>
				<h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Service Temporarily Unavailable</h1>
				<p class="text-gray-600 dark:text-gray-300 mb-6">
					Our database service is currently unavailable. Please try again later.
				</p>
			{:else}
				<div class="text-6xl mb-4">⚠️</div>
				<h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Error {status}</h1>
				<p class="text-gray-600 dark:text-gray-300 mb-6">
					{errorMessage}
				</p>
			{/if}
		</div>

		<div class="space-y-4">
			{#if isUrlError}
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
					Valid store URLs should look like: <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">/store/shop-name/outfit-id</code>
				</p>
			{/if}

			<button
				on:click={() => goto('/')}
				class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
			>
				Go to Homepage
			</button>

			<button
				on:click={() => goto('/shops')}
				class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
			>
				Browse All Shops
			</button>

			{#if status === 503}
				<button
					on:click={() => window.location.reload()}
					class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
				>
					Try Again
				</button>
			{/if}
		</div>

		{#if isUrlError}
			<div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
				<h3 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Common URL Issues:</h3>
				<ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
					<li>• Facebook share URLs are not valid store URLs</li>
					<li>• URLs should not contain special characters</li>
					<li>• Use only letters, numbers, hyphens, and underscores</li>
				</ul>
			</div>
		{/if}
	</div>
</div>