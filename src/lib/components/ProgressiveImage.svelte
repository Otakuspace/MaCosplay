<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	
	export let src: string;
	export let thumbnail: string = '';
	export let alt: string = '';
	export let width: string | number = 'auto';
	export let height: string | number = 'auto';
	export let placeholder: string = '/images/placeholder.png';
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let className: string = '';
	export let style: string = '';
	
	const dispatch = createEventDispatcher();
	
	let imgElement: HTMLImageElement;
	let thumbnailElement: HTMLImageElement;
	let isLoaded = false;
	let isThumbnailLoaded = false;
	let isMainImageLoaded = false;
	let observer: IntersectionObserver;
	
	$: classes = `progressive-image ${className}`.trim();
	
	onMount(() => {
		if (loading === 'lazy') {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							loadImages();
							observer.unobserve(entry.target);
						}
					});
				},
				{
					threshold: 0.1,
					rootMargin: '50px'
				}
			);
			
			observer.observe(imgElement);
		} else {
			loadImages();
		}
		
		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});
	
	function loadImages() {
		if (thumbnail) {
			loadThumbnail();
		}
		loadMainImage();
	}
	
	function loadThumbnail() {
		if (thumbnailElement) {
			thumbnailElement.src = thumbnail;
		}
	}
	
	function loadMainImage() {
		if (imgElement) {
			imgElement.src = src;
		}
	}
	
	function handleThumbnailLoad() {
		isThumbnailLoaded = true;
		dispatch('thumbnailload');
	}
	
	function handleThumbnailError() {
		dispatch('thumbnailerror');
	}
	
	function handleMainImageLoad() {
		isMainImageLoaded = true;
		isLoaded = true;
		dispatch('load');
	}
	
	function handleMainImageError() {
		dispatch('error');
	}
</script>

<div class={classes} style={style}>
	{#if !isLoaded}
		<!-- Placeholder -->
		<div class="placeholder" style="width: {width}; height: {height};">
			<img
				src={placeholder}
				alt="Loading placeholder"
				style="width: 100%; height: 100%; object-fit: cover;"
			/>
		</div>
	{/if}
	
	<!-- Thumbnail (shown first) -->
	{#if thumbnail && !isMainImageLoaded}
		<img
			bind:this={thumbnailElement}
			src=""
			alt={alt}
			style="width: 100%; height: 100%; object-fit: cover; opacity: {isThumbnailLoaded ? 1 : 0}; transition: opacity 0.3s ease;"
			on:load={handleThumbnailLoad}
			on:error={handleThumbnailError}
		/>
	{/if}
	
	<!-- Main image -->
	<img
		bind:this={imgElement}
		src=""
		alt={alt}
		style="width: 100%; height: 100%; object-fit: cover; opacity: {isMainImageLoaded ? 1 : 0}; transition: opacity 0.3s ease;"
		on:load={handleMainImageLoad}
		on:error={handleMainImageError}
	/>
</div>

<style>
	.progressive-image {
		position: relative;
		overflow: hidden;
	}
	
	.progressive-image img {
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
</style>
