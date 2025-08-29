<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	
	export let src: string;
	export let alt: string = '';
	export let width: string | number = 'auto';
	export let height: string | number = 'auto';
	export let placeholder: string = '/images/placeholder.png';
	export let threshold: number = 0.1;
	export let rootMargin: string = '50px';
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let className: string = '';
	export let style: string = '';
	
	const dispatch = createEventDispatcher();
	
	let imgElement: HTMLImageElement;
	let isLoaded = false;
	let hasError = false;
	let observer: IntersectionObserver;
	
	$: classes = `lazy-image ${className}`.trim();
	
	onMount(() => {
		if (loading === 'lazy') {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							loadImage();
							observer.unobserve(entry.target);
						}
					});
				},
				{
					threshold,
					rootMargin
				}
			);
			
			observer.observe(imgElement);
		} else {
			loadImage();
		}
		
		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});
	
	function loadImage() {
		if (imgElement && src) {
			imgElement.src = src;
		}
	}
	
	function handleImageLoad() {
		isLoaded = true;
		dispatch('load');
	}
	
	function handleImageError() {
		hasError = true;
		dispatch('error');
	}
</script>

<div class={classes} style={style}>
	{#if !isLoaded && !hasError}
		<!-- Loading placeholder -->
		<div class="placeholder" style="width: {width}; height: {height};">
			<img
				src={placeholder}
				alt="Loading placeholder"
				style="width: 100%; height: 100%; object-fit: cover;"
			/>
		</div>
	{:else if hasError}
		<!-- Error fallback -->
		<div class="error-fallback" style="width: {width}; height: {height};">
			<img
				src={placeholder}
				alt="Error fallback"
				style="width: 100%; height: 100%; object-fit: cover; opacity: 0.5;"
			/>
			<div class="error-overlay">
				<svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
			</div>
		</div>
	{/if}
	
	<!-- Actual image -->
	{#if !hasError}
		<img
			bind:this={imgElement}
			src=""
			alt={alt}
			style="width: 100%; height: 100%; object-fit: cover; opacity: {isLoaded ? 1 : 0}; transition: opacity 0.3s ease;"
			on:load={handleImageLoad}
			on:error={handleImageError}
		/>
	{/if}
</div>

<style>
	.lazy-image {
		position: relative;
		overflow: hidden;
	}
	
	.lazy-image img {
		display: block;
	}
	
	.placeholder {
		position: absolute;
		top: 0;
		left: 0;
		background-color: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.error-fallback {
		position: relative;
		background-color: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.error-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.error-icon {
		width: 1.5rem;
		height: 1.5rem;
		color: #ef4444;
	}
</style>
