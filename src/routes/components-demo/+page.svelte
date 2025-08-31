<script lang="ts">
	import ItemList from '$lib/components/ItemList.svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import type { ItemListRecord } from '$types/pocketbase';

	// Sample data to demonstrate the components
	const sampleItems: ItemListRecord[] = [
		{
			id: '1',
			Name: 'Genshin Impact - Raiden Shogun Cosplay',
			Desc: 'Beautiful Raiden Shogun cosplay costume with high quality materials',
			Image: 'raiden.jpg',
			Province: 'กรุงเทพมหานคร',
			Size: 'M',
			Status: 'พร้อมเช่า',
			price: 1500,
			price_pri: 2000,
			price_test: 1000,
			public: true,
			tags: ['genshin-impact', 'raiden-shogun', 'cosplay', 'anime', 'japanese'],
			user: 'user1',
			userStore: 'store1',
			expand: {
				userStore: {
					Name: 'Cosplay Paradise',
					slug: 'cosplay-paradise'
				}
			}
		},
		{
			id: '2',
			Name: 'Demon Slayer - Nezuko Kimono',
			Desc: 'Traditional Nezuko kimono with demon slayer design',
			Image: 'nezuko.jpg',
			Province: 'เชียงใหม่',
			Size: 'S',
			Status: 'เช่าอยู่',
			price: 0,
			price_pri: 1800,
			price_test: 1200,
			public: true,
			tags: ['demon-slayer', 'nezuko', 'kimono', 'traditional', 'japanese'],
			user: 'user2',
			userStore: 'store2',
			expand: {
				userStore: {
					Name: 'Anime World',
					slug: 'anime-world'
				}
			}
		},
		{
			id: '3',
			Name: 'Hololive - Marine Captain Uniform',
			Desc: 'Captain Marine uniform from Hololive with accessories',
			Image: 'marine.jpg',
			Province: 'ภูเก็ต',
			Size: 'L',
			Status: 'พร้อมเช่า',
			price: 1200,
			price_pri: 1500,
			price_test: 800,
			public: true,
			tags: ['hololive', 'marine', 'captain', 'vtuber', 'uniform'],
			user: 'user3',
			userStore: 'store3',
			expand: {
				userStore: {
					Name: 'VTuber Cosplay',
					slug: 'vtuber-cosplay'
				}
			}
		},
		{
			id: '4',
			Name: 'Jujutsu Kaisen - Gojo Satoru',
			Desc: 'Gojo Satoru school uniform with blindfold',
			Image: 'gojo.jpg',
			Province: 'ขอนแก่น',
			Size: 'XL',
			Status: 'พร้อมเช่า',
			price: 1000,
			price_pri: 1300,
			price_test: 700,
			public: true,
			tags: ['jujutsu-kaisen', 'gojo-satoru', 'school-uniform', 'blindfold', 'anime'],
			user: 'user4',
			userStore: 'store4',
			expand: {
				userStore: {
					Name: 'Modern Anime',
					slug: 'modern-anime'
				}
			}
		}
	];

	let selectedItem: ItemListRecord | null = null;
	let showCompact = false;
	let showRating = true;
	let showTags = true;
	let showLocation = true;
	let showPrice = true;
	let showStoreInfo = true;

	function handleItemClick(event: CustomEvent) {
		selectedItem = event.detail.item;
		console.log('Item clicked:', event.detail.item);
	}

	function handleStoreClick(event: CustomEvent) {
		console.log('Store clicked:', event.detail.item);
	}

	function handleImageClick(event: CustomEvent) {
		console.log('Image clicked:', event.detail.item);
	}
</script>

<svelte:head>
	<title>Components Demo - ItemList & ItemCard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
	<div class="container mx-auto px-4 py-8">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
				Components Demo
			</h1>
			<p class="text-xl text-gray-600 dark:text-gray-400">
				ItemList & ItemCard Components with Tags Support
			</p>
		</div>

		<!-- Controls -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
			<h2 class="text-2xl font-bold mb-4">Display Options</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				<label class="flex items-center space-x-2">
					<input type="checkbox" bind:checked={showRating} class="rounded">
					<span>Show Rating</span>
				</label>
				<label class="flex items-center space-x-2">
					<input type="checkbox" bind:checked={showTags} class="rounded">
					<span>Show Tags</span>
				</label>
				<label class="flex items-center space-x-2">
					<input type="checkbox" bind:checked={showLocation} class="rounded">
					<span>Show Location</span>
				</label>
				<label class="flex items-center space-x-2">
					<input type="checkbox" bind:checked={showPrice} class="rounded">
					<span>Show Price</span>
				</label>
				<label class="flex items-center space-x-2">
					<input type="checkbox" bind:checked={showStoreInfo} class="rounded">
					<span>Show Store Info</span>
				</label>
				<label class="flex items-center space-x-2">
					<input type="checkbox" bind:checked={showCompact} class="rounded">
					<span>Compact Mode</span>
				</label>
			</div>
		</div>

		<!-- ItemList Demo -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
			<h2 class="text-2xl font-bold mb-4">ItemList Component</h2>
			<p class="text-gray-600 dark:text-gray-400 mb-4">
				Grid layout displaying multiple items with proper tags support
			</p>
			
			<ItemList 
				items={sampleItems}
				loading={false}
				{showRating}
				{showTags}
				{showLocation}
				{showPrice}
				{showStoreInfo}
				gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				itemHeight="h-48 sm:h-64"
				compact={showCompact}
				on:itemClick={handleItemClick}
				on:storeClick={handleStoreClick}
				on:imageClick={handleImageClick}
			/>
		</div>

		<!-- Individual ItemCard Demo -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
			<h2 class="text-2xl font-bold mb-4">Individual ItemCard Component</h2>
			<p class="text-gray-600 dark:text-gray-400 mb-4">
				Single item display with all features enabled
			</p>
			
			<div class="max-w-sm mx-auto">
				<ItemCard
					item={sampleItems[0]}
					{showRating}
					{showTags}
					{showLocation}
					{showPrice}
					{showStoreInfo}
					compact={showCompact}
					itemHeight="h-64"
					clickable={true}
					on:itemClick={handleItemClick}
					on:storeClick={handleStoreClick}
					on:imageClick={handleImageClick}
				/>
			</div>
		</div>

		<!-- Selected Item Details -->
		{#if selectedItem}
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
				<h2 class="text-2xl font-bold mb-4">Selected Item Details</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 class="text-lg font-semibold mb-2">Basic Info</h3>
						<p><strong>Name:</strong> {selectedItem.Name}</p>
						<p><strong>Size:</strong> {selectedItem.Size}</p>
						<p><strong>Status:</strong> {selectedItem.Status}</p>
						<p><strong>Location:</strong> {selectedItem.Province}</p>
						<p><strong>Price:</strong> ฿{selectedItem.price || selectedItem.price_pri}</p>
					</div>
					<div>
						<h3 class="text-lg font-semibold mb-2">Tags</h3>
						{#if selectedItem.tags && selectedItem.tags.length > 0}
							<div class="flex flex-wrap gap-2">
								{#each selectedItem.tags as tag}
									<span class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
										{tag}
									</span>
								{/each}
							</div>
						{:else}
							<p class="text-gray-500">No tags available</p>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Features Highlight -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
			<h2 class="text-2xl font-bold mb-4">Key Features</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<h3 class="text-lg font-semibold mb-2">Tags Support</h3>
					<ul class="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
						<li>Displays custom tags from item.tags array</li>
						<li>Shows Size and Status as special tag types</li>
						<li>Color-coded tags for better visual hierarchy</li>
						<li>Handles overflow with "+X more" indicator</li>
					</ul>
				</div>
				<div>
					<h3 class="text-lg font-semibold mb-2">Component Features</h3>
					<ul class="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
						<li>Fully responsive grid layout</li>
						<li>Configurable display options</li>
						<li>Event handling for interactions</li>
						<li>Loading states and empty states</li>
						<li>Dark mode support</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>