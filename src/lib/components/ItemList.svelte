<script lang="ts">
	import type { ItemListRecord } from '$types/pocketbase';
	import { createEventDispatcher } from 'svelte';
	import ItemCard from './ItemCard.svelte';

	export let items: ItemListRecord[] = [];
	export let loading = false;
	export let showRating = true;
	export let showTags = true;
	export let showLocation = true;
	export let showPrice = true;
	export let showStoreInfo = true;
	export let gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';
	export let itemHeight = 'h-48 sm:h-64';
	export let compact = false;

	const dispatch = createEventDispatcher<{
		itemClick: { item: ItemListRecord };
		storeClick: { item: ItemListRecord };
		imageClick: { item: ItemListRecord };
	}>();



	function handleItemClick(item: ItemListRecord) {
		dispatch('itemClick', { item });
	}

	function handleStoreClick(item: ItemListRecord, event: Event) {
		if (event && event.stopPropagation) {
			event.stopPropagation();
		}
		dispatch('storeClick', { item });
	}

	function handleImageClick(item: ItemListRecord, event: Event) {
		if (event && event.stopPropagation) {
			event.stopPropagation();
		}
		dispatch('imageClick', { item });
	}
</script>

<div class="w-full">
	{#if loading}
		<!-- Loading Skeleton -->
		<div class="grid {gridCols} gap-4 lg:gap-6">
			{#each Array(8) as _}
				<div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="animate-pulse">
						<div class="bg-gray-300 dark:bg-gray-600 {itemHeight}"></div>
						<div class="p-3 sm:p-4 space-y-3">
							<div class="flex items-center space-x-2">
								<div class="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
								<div class="space-y-2 flex-1">
									<div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
									<div class="h-2 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
								</div>
							</div>
							<div class="space-y-2">
								<div class="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
								<div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
							</div>
							<div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
							<div class="flex gap-2">
								<div class="h-5 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
								<div class="h-5 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
							</div>
							<div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else if items.length > 0}
		<!-- Product Grid -->
		<div class="grid {gridCols} gap-4 lg:gap-6">
			{#each items as item}
				<ItemCard
					{item}
					{showRating}
					{showTags}
					{showLocation}
					{showPrice}
					{showStoreInfo}
					{compact}
					{itemHeight}
					clickable={true}
					on:itemClick={() => handleItemClick(item)}
					on:storeClick={() => handleStoreClick(item)}
					on:imageClick={() => handleImageClick(item)}
				/>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div class="col-span-full">
			<div class="text-center py-12 lg:py-16">
				<div class="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 lg:mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
					<svg class="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
				</div>
				<h3 class="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-2">ไม่พบสินค้า</h3>
				<p class="text-gray-600 dark:text-gray-400 mb-4 lg:mb-6 text-sm lg:text-base">
					ลองเปลี่ยนเงื่อนไขการค้นหาหรือรีเซ็ตตัวกรอง
				</p>
			</div>
		</div>
	{/if}
</div>

