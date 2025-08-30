<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	

	export let data: any;

	let currentImageIndex = 0;
	let isDarkTheme = false;
	let imageLoading = true;
	let imageError = false;

	// Extract outfit and shop data
	$: outfit = data?.itemList?.[0] || null;
	$: shop = data?.userStore || null;
	$: productImages = outfit?.Images ? 
		(outfit.Images.filter((img: string) => img && img.trim() !== '')) : 
		(outfit?.Image ? [outfit.Image] : []);

	onMount(() => {
		// Check current theme
		const checkTheme = () => {
			const theme = document.documentElement.getAttribute('data-theme');
			isDarkTheme = theme === 'dark';
		};

		// Initial check
		checkTheme();

		// Watch for theme changes
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});

		return () => observer.disconnect();
	});

	function nextImage() {
		if (productImages.length > 1) {
			currentImageIndex = (currentImageIndex + 1) % productImages.length;
			imageLoading = true;
			imageError = false;
		}
	}

	function prevImage() {
		if (productImages.length > 1) {
			currentImageIndex = currentImageIndex === 0 ? productImages.length - 1 : currentImageIndex - 1;
			imageLoading = true;
			imageError = false;
		}
	}

	function selectImage(index: number) {
		currentImageIndex = index;
		imageLoading = true;
		imageError = false;
	}

	function getImageUrl(image: string): string {
		// If it's already a full URL, return as is
		if (image.startsWith('http')) {
			return image;
		}
		
		// If it's a local static image path, return as is (Vite will handle it)
		if (image.startsWith('/images/')) {
			return image;
		}
		
		// If it's a relative path from PocketBase, construct the full URL using the outfit record id
		return `https://file.macosplay.com/mxj3660ce5olheb/${outfit?.id || $page.params.outfitID}/${image}`;
	}
</script>

<svelte:head>
	<title>{outfit?.Name || 'Outfit'} - {shop?.name || 'Shop'} | MaCosplay</title>
	<meta name="description" content={outfit?.Description || 'View outfit details and shop information'} />
</svelte:head>

<div class="min-h-screen bg-base-100">
	<!-- Breadcrumb -->
	<div class="container mx-auto px-4 py-4">
		<div class="text-sm breadcrumbs">
			<ul>
				<li><a href="/" class="text-base-content/70 hover:text-base-content">หน้าแรก</a></li>
				<li><a href="/shop" class="text-base-content/70 hover:text-base-content">ร้านค้า</a></li>
				<li><a href="/store/{$page.params.shopID}" class="text-base-content/70 hover:text-base-content">{shop?.name || 'Shop'}</a></li>
				<li class="text-base-content">{outfit?.Name || 'Outfit'}</li>
			</ul>
		</div>
	</div>

	<div class="container mx-auto px-4 py-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			
			<!-- Image Gallery Column -->
			<div class="lg:col-span-1">
				<div class="bg-base-200 rounded-2xl p-6 shadow-lg">
					<!-- Main Image Display -->
					<div class="relative mb-6">
						{#if productImages.length > 0}
							<div class="relative aspect-square rounded-xl overflow-hidden bg-base-300">
								{#if productImages.length > 1}
									<!-- Navigation Arrows -->
									<button 
										class="absolute left-3 top-1/2 transform -translate-y-1/2 bg-base-100/80 hover:bg-base-100 text-base-content rounded-full p-2 shadow-lg transition-all duration-200 z-10"
										on:click={prevImage}
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
										</svg>
									</button>
									
									<button 
										class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-base-100/80 hover:bg-base-100 text-base-content rounded-full p-2 shadow-lg transition-all duration-200 z-10"
										on:click={nextImage}
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
										</svg>
									</button>
								{/if}

								<!-- Main Image -->
								<img
									src={getImageUrl(productImages[currentImageIndex])}
									alt={outfit?.Name || 'Outfit Image'}
									class="w-full h-full object-cover"
									on:load={() => {
										imageLoading = false;
										imageError = false;
									}}
									on:error={(e) => {
										imageLoading = false;
										imageError = true;
										const target = e.target as HTMLImageElement;
										target.src = '/images/Example/example01.jpg'; // Fallback image
									}}
								/>
								
								<!-- Loading Overlay -->
								{#if imageLoading}
									<div class="absolute inset-0 bg-base-300 flex items-center justify-center">
										<div class="loading loading-spinner loading-lg text-primary"></div>
									</div>
								{/if}
								
								<!-- Error Overlay -->
								{#if imageError}
									<div class="absolute inset-0 bg-base-300 flex items-center justify-center">
										<div class="text-center text-base-content/50">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
											</svg>
											<p>รูปภาพไม่สามารถโหลดได้</p>
										</div>
									</div>
								{/if}
							</div>

							<!-- Image Counter -->
							{#if productImages.length > 1}
								<div class="text-center text-sm text-base-content/70 mt-2">
									{currentImageIndex + 1} / {productImages.length}
								</div>
							{/if}
						{:else}
							<div class="aspect-square rounded-xl bg-base-300 flex items-center justify-center">
								<div class="text-center text-base-content/50">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									<p>ไม่มีรูปภาพ</p>
								</div>
							</div>
						{/if}
					</div>

					<!-- Thumbnail Navigation -->
					{#if productImages.length > 1}
						<div class="grid grid-cols-4 gap-2">
							{#each productImages as image, index}
								<button 
									class="aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 {index === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-base-content/20'}"
									on:click={() => selectImage(index)}
								>
									<img
										src={getImageUrl(image)}
										alt={`${outfit?.Name || 'Outfit'} - Image ${index + 1}`}
										class="w-full h-full object-cover"
										on:error={(e) => {
											const target = e.target as HTMLImageElement;
											target.src = '/images/Example/example01.jpg'; // Fallback image
										}}
									/>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Product Details Column -->
			<div class="lg:col-span-1">
				<div class="bg-base-200 rounded-2xl p-6 shadow-lg h-fit">
					<h1 class="text-3xl font-bold text-base-content mb-4">{outfit?.Name || 'Outfit Name'}</h1>
					
					<!-- Price -->
					<div class="mb-6">
						<div class="text-2xl font-bold text-primary">
							฿{outfit?.Price ? outfit.Price.toLocaleString() : '0'}
						</div>
						{#if outfit?.OriginalPrice && outfit.OriginalPrice > outfit?.Price}
							<div class="text-base-content/50 line-through">
								฿{outfit.OriginalPrice.toLocaleString()}
							</div>
						{/if}
					</div>

					<!-- Description -->
					<div class="mb-6">
						<h3 class="text-lg font-semibold text-base-content mb-2">รายละเอียด</h3>
						<p class="text-base-content/80 leading-relaxed">
							{outfit?.Description || 'ไม่มีรายละเอียด'}
						</p>
					</div>

					<!-- Specifications -->
					<div class="mb-6">
						<h3 class="text-lg font-semibold text-base-content mb-3">ข้อมูลสินค้า</h3>
						<div class="space-y-3">
							{#if outfit?.Size}
								<div class="flex justify-between">
									<span class="text-base-content/70">ขนาด:</span>
									<span class="font-medium">{outfit.Size}</span>
								</div>
							{/if}
							{#if outfit?.Gender}
								<div class="flex justify-between">
									<span class="text-base-content/70">เพศ:</span>
									<span class="font-medium">{outfit.Gender}</span>
								</div>
							{/if}
							{#if outfit?.Series}
								<div class="flex justify-between">
									<span class="text-base-content/70">ซีรีส์:</span>
									<span class="font-medium">{outfit.Series}</span>
								</div>
							{/if}
							{#if outfit?.Condition}
								<div class="flex justify-between">
									<span class="text-base-content/70">สภาพ:</span>
									<span class="font-medium">{outfit.Condition}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="space-y-3">
						<button class="btn btn-primary w-full">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
							</svg>
							เพิ่มลงตะกร้า
						</button>
						
						<button class="btn btn-outline w-full">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
							</svg>
							เพิ่มในรายการโปรด
						</button>
					</div>
				</div>
			</div>

			<!-- Seller Information Column -->
			<div class="lg:col-span-1">
				<div class="bg-base-200 rounded-2xl p-6 shadow-lg h-fit">
					<h3 class="text-xl font-bold text-base-content mb-4">ข้อมูลร้านค้า</h3>
					
					<!-- Shop Info -->
					<div class="mb-6">
						<div class="flex items-center mb-4">
							<div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
								{shop?.name ? shop.name.charAt(0).toUpperCase() : 'S'}
							</div>
							<div>
								<h4 class="text-lg font-semibold text-base-content">{shop?.name || 'Shop Name'}</h4>
								<p class="text-base-content/70">{shop?.location || 'Location not specified'}</p>
							</div>
						</div>
						
						{#if shop?.description}
							<p class="text-base-content/80 leading-relaxed mb-4">
								{shop.description}
							</p>
						{/if}
					</div>

					<!-- Contact Information -->
					<div class="mb-6">
						<h4 class="text-lg font-semibold text-base-content mb-3">ข้อมูลติดต่อ</h4>
						<div class="space-y-2">
							{#if shop?.phone}
								<div class="flex items-center text-base-content/80">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
									</svg>
									{shop.phone}
								</div>
							{/if}
							{#if shop?.email}
								<div class="flex items-center text-base-content/80">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									{shop.email}
								</div>
							{/if}
						</div>
					</div>

					<!-- Shop Actions -->
					<div class="space-y-3">
						<a href="/store/{$page.params.shopID}" class="btn btn-outline w-full">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
							</svg>
							ดูร้านค้า
						</a>
						
						<button class="btn btn-outline w-full">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
							</svg>
							ติดต่อร้านค้า
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
