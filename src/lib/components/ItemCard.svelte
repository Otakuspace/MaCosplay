<script lang="ts">
	import type { ItemListRecord } from '$types/pocketbase';
	import { createEventDispatcher } from 'svelte';

	export let item: ItemListRecord;
	export let showRating = true;
	export let showTags = true;
	export let showLocation = true;
	export let showPrice = true;
	export let showStoreInfo = true;
	export let compact = false;
	export let itemHeight = 'h-48 sm:h-64';
	export let clickable = true;

	const dispatch = createEventDispatcher<{
		itemClick: { item: ItemListRecord };
		storeClick: { item: ItemListRecord };
		imageClick: { item: ItemListRecord };
	}>();

	// Helper function to limit text length
	const limitText = (text: string, maxLength: number) => {
		return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
	};

	// Helper function to get optimized image URL
	const getOptimizedImageUrl = (itemId: string, imageName: string): string => {
		return `https://file.macosplay.com/mxj3660ce5olheb/${itemId}/${imageName}?w=400&format=avif&quality=60`;
	};

	// Helper function to get display price
	const getDisplayPrice = (item: ItemListRecord) => {
		if (item.price === 0) {
			return item.price_pri || 0;
		}
		return item.price || 0;
	};

	// Helper function to get price type
	const getPriceType = (item: ItemListRecord) => {
		if (item.price === 0) {
			return 'ไพรเวท';
		}
		return 'ปกติ';
	};

	function handleItemClick() {
		if (clickable) {
			dispatch('itemClick', { item });
		}
	}

	function handleStoreClick(event: Event) {
		event.stopPropagation();
		dispatch('storeClick', { item });
	}

	function handleImageClick(event: Event) {
		event.stopPropagation();
		dispatch('imageClick', { item });
	}
</script>

<div 
	class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 {clickable ? 'cursor-pointer' : ''} {compact ? 'text-sm' : ''}"
	on:click={handleItemClick}
>
	<!-- Product Image -->
	<div class="relative">
		{#if item.Image}
			<img
				src={getOptimizedImageUrl(item.id, item.Image)}
				alt="{item.Name}"
				class="w-full {itemHeight} object-cover"
				loading="lazy"
				on:click={handleImageClick}
			/>
		{:else}
			<img
				src="/images/Example/Macosplay.png?w=400&format=webp"
				alt="{item.Name}"
				class="w-full {itemHeight} object-cover"
				loading="lazy"
				on:click={handleImageClick}
			/>
		{/if}
		
		{#if showRating}
			<!-- Rating Badge -->
			<div class="absolute top-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-semibold">
				⭐ 3.5
			</div>
		{/if}

		<!-- Price Badge -->
		{#if showPrice}
			<div class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
				{getPriceType(item)}
			</div>
		{/if}
	</div>

	<!-- Product Info -->
	<div class="p-3 sm:p-4">
		{#if showStoreInfo}
			<!-- Seller Info -->
			<div class="flex items-center space-x-2 mb-3">
				<div class="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
				<div class="flex-1 min-w-0">
					<p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
						{limitText(item.expand?.userStore?.Name || '', 20)}
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400 truncate">
						@{item.expand?.userStore?.Name?.toLowerCase().replace(/\s+/g, '') || 'store'}
					</p>
				</div>
				<button
					class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
					on:click={handleStoreClick}
				>
					ดูร้าน
				</button>
			</div>
		{/if}

		<!-- Product Title -->
		<h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm sm:text-base">
			{item.Name}
		</h3>

		{#if showPrice}
			<!-- Price -->
			<div class="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 mb-3">
				฿{getDisplayPrice(item).toLocaleString()}
				<span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">/ 3 วัน</span>
			</div>
		{/if}

		{#if showTags}
			<!-- Tags -->
			<div class="flex flex-wrap gap-2 mb-3">
				<!-- Size tag -->
				{#if item.Size}
					<span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
						ขนาด {item.Size}
					</span>
				{/if}
				
				<!-- Status tag -->
				{#if item.Status}
					<span class="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
						{item.Status}
					</span>
				{/if}

				<!-- Custom tags from item.tags array -->
				{#if item.tags && item.tags.length > 0}
					{#each item.tags.slice(0, 3) as tag}
						<span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
							{tag}
						</span>
					{/each}
					{#if item.tags.length > 3}
						<span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
							+{item.tags.length - 3}
						</span>
					{/if}
				{/if}
			</div>
		{/if}

		{#if showLocation}
			<!-- Location -->
			<p class="text-xs text-gray-500 dark:text-gray-400">
				{item.Province || 'ไม่ระบุตำแหน่ง'}
			</p>
		{/if}
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>