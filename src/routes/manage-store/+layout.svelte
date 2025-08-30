<script lang="ts">
	import { onMount } from 'svelte';
	
	let { children, data } = $props();
	let currentTheme = 'light';
	
	// Function to check current theme
	function getCurrentTheme() {
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem('theme');
			const documentTheme = document.documentElement.getAttribute('data-theme');
			return documentTheme || savedTheme || 'light';
		}
		return 'light';
	}
	
	// Update theme reactively
	onMount(() => {
		currentTheme = getCurrentTheme();
		
		// Listen for theme changes
		const observer = new MutationObserver(() => {
			currentTheme = getCurrentTheme();
		});
		
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});
		
		return () => observer.disconnect();
	});
</script>

<div class="min-h-screen transition-colors duration-300 {currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}">
	<!-- Header Section with Breadcrumb -->
	<div class="sticky top-0 z-40 backdrop-blur-md {currentTheme === 'dark' ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'} border-b transition-colors duration-300">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Breadcrumb -->
				<nav class="flex items-center space-x-2 text-sm">
					<a href="/" class="{currentTheme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4"></path>
						</svg>
					</a>
					<span class="{currentTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'}">/</span>
					<a href="/dashboard" class="{currentTheme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors">
						Dashboard
					</a>
					<span class="{currentTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'}">/</span>
					<span class="{currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium">Manage Store</span>
				</nav>
				
				<!-- Quick Actions -->
				<div class="flex items-center space-x-3">
					<a href="/create-shop" 
					   class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 {currentTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} shadow-sm hover:shadow-md">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
						</svg>
						สร้างร้านใหม่
					</a>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Main Content Area -->
	<main class="relative">
		{@render children()}
	</main>
</div>

<style>
	/* Custom styles for manage-store layout */
	:global([data-theme="dark"]) {
		--manage-store-bg: theme('colors.gray.900');
		--manage-store-card-bg: theme('colors.gray.800');
		--manage-store-text: theme('colors.white');
		--manage-store-text-muted: theme('colors.gray.400');
		--manage-store-border: theme('colors.gray.700');
		--manage-store-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
	}
	
	:global([data-theme="light"]) {
		--manage-store-bg: linear-gradient(135deg, theme('colors.slate.50'), theme('colors.blue.50'), theme('colors.indigo.100'));
		--manage-store-card-bg: theme('colors.white');
		--manage-store-text: theme('colors.gray.900');
		--manage-store-text-muted: theme('colors.gray.600');
		--manage-store-border: theme('colors.gray.200');
		--manage-store-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
	
	:global(.manage-store-card) {
		background: var(--manage-store-card-bg);
		color: var(--manage-store-text);
		border-color: var(--manage-store-border);
		box-shadow: var(--manage-store-shadow);
	}
	
	:global(.manage-store-text-muted) {
		color: var(--manage-store-text-muted);
	}
</style>