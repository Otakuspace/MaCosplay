<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import ImageManager from '../../../components/ImageManager.svelte';
	import type { StorePageData, ItemData, ShopData, ImageCheckResponse } from '../../../types/images';
	

	export let data: StorePageData;

	let currentImageIndex = 0;
	let isDarkTheme = false;
	let imageLoading = true;
	let imageError = false;
	let itemSpecificImagesLoaded = false;
	let showImageManager = false;

	// Extract outfit and shop data
	$: outfit = data?.itemList?.[0] || null;
	$: shop = data?.userStore || null;
	$: productImages = outfit?.Images ? 
		(outfit.Images.filter((img: string) => img && img.trim() !== '')) : 
		(outfit?.Image ? [outfit.Image] : []);

	// Reactive statement to check for images when outfit ID changes
	$: if (outfit?.id && !itemSpecificImagesLoaded) {
		checkItemImages();
	}

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

		// Check for item-specific images
		if (outfit?.id || $page.params.outfitID) {
			checkItemImages();
		}

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
		
		// Handle item ID-based image paths
		const itemId = outfit?.id || $page.params.outfitID;
		
		// If image path includes item ID pattern, use it directly
		if (image.includes(itemId)) {
			return `https://file.macosplay.com/mxj3660ce5olheb/${image}`;
		}
		
		// If it's a relative path from PocketBase, construct the full URL using the item ID
		return `https://file.macosplay.com/mxj3660ce5olheb/${itemId}/${image}`;
	}

	function getImageWithFallback(image: string, index: number): string {
		// Primary image URL based on item ID
		const primaryUrl = getImageUrl(image);
		
		// Return the primary URL - error handling will be done in the img tag's on:error event
		return primaryUrl;
	}

	function handleImageError(event: Event, index: number) {
		const target = event.target as HTMLImageElement;
		const fallbackImages = [
			'/images/Example/Anime_alya_cos.png',
			'/images/Example/MakimaCos.png',
			'/images/Example/VentiCos.png',
			'/images/Example/Anime_main.png',
			'/images/Example/example01.jpg'
		];
		
		// Try fallback images based on index
		const fallbackImage = fallbackImages[index % fallbackImages.length];
		if (target.src !== fallbackImage) {
			target.src = fallbackImage;
		} else {
			// If even fallback fails, show placeholder
			imageError = true;
		}
	}

	// Function to preload item-specific images and check availability
	async function checkItemImages() {
		const itemId = outfit?.id || $page.params.outfitID;
		
		try {
			// Use our API endpoint to check for available images
			const response = await fetch(`/api/check-images?itemId=${encodeURIComponent(itemId)}`);
			const result: ImageCheckResponse = await response.json();
			
			// Always mark as loaded to hide the spinner
			itemSpecificImagesLoaded = true;

			if (response.ok && result.availableImages && result.availableImages.length > 0) {
				// Extract just the paths from the API response
				const imagePaths = result.availableImages.map((img) => img.path);
				
				// Update outfit images with item-specific images first, then fallbacks
				if (outfit) {
					outfit.Images = [
						...imagePaths,
						...outfit.Images.filter((img: string) => img.startsWith('/images/Example/'))
					];
				}
			}
		} catch (error) {
			itemSpecificImagesLoaded = true;
		}
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
						<!-- Loading indicator for image availability check -->
						{#if !itemSpecificImagesLoaded && outfit?.id}
							<div class="absolute top-2 right-2 z-20">
								<div class="bg-base-100/80 rounded-full p-2">
									<div class="loading loading-spinner loading-sm text-primary"></div>
								</div>
							</div>
						{/if}
						
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
									src={getImageWithFallback(productImages[currentImageIndex], currentImageIndex)}
									alt={outfit?.Name || 'Outfit Image'}
									class="w-full h-full object-cover"
									on:load={() => {
										imageLoading = false;
										imageError = false;
									}}
									on:error={(e) => {
										imageLoading = false;
										handleImageError(e, currentImageIndex);
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
										src={getImageWithFallback(image, index)}
										alt={`${outfit?.Name || 'Outfit'} - Image ${index + 1}`}
										class="w-full h-full object-cover"
										on:error={(e) => handleImageError(e, index)}
									/>
								</button>
							{/each}
						</div>
					{/if}

					<!-- Image Management Toggle -->
					<div class="mt-4">
						<button 
							class="btn btn-outline btn-sm w-full"
							on:click={() => showImageManager = !showImageManager}
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							{showImageManager ? 'Hide' : 'Manage'} Images
						</button>
					</div>

					<!-- Image Manager -->
					{#if showImageManager && outfit?.id}
						<div class="mt-4">
							<ImageManager 
								itemId={outfit.id}
								existingImages={productImages}
								on:imagesUpdated={() => {
									// Refresh images when updated
									checkItemImages();
								}}
							/>
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
							{#if outfit?.isPriTest}
								<div class="space-y-2">
									<div class="flex items-center justify-between">
										<span class="text-lg text-base-content/70">ไพรเวท:</span>
										<span>฿{outfit.price_pri ? outfit.price_pri.toLocaleString() : '0'}</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-lg text-base-content/70">ทดสอบ:</span>
										<span>฿{outfit.price_test ? outfit.price_test.toLocaleString() : '0'}</span>
									</div>
								</div>
							{:else}
								฿{outfit?.Price || outfit?.price ? (outfit.Price || outfit.price).toLocaleString() : '0'}
							{/if}
						</div>
						{#if outfit?.OriginalPrice && outfit.OriginalPrice > (outfit?.Price || outfit?.price)}
							<div class="text-base-content/50 line-through">
								฿{outfit.OriginalPrice.toLocaleString()}
							</div>
						{/if}
					</div>

					<!-- Status -->
					{#if outfit?.Status}
						<div class="mb-6">
							<div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {outfit.Status === 'พร้อมให้เช่า' ? 'bg-green-100 text-green-800' : outfit.Status === 'กำลังถูกเช่า' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
								{outfit.Status}
							</div>
						</div>
					{/if}

					<!-- Description -->
					<div class="mb-6">
						<h3 class="text-lg font-semibold text-base-content mb-2">รายละเอียด</h3>
						<p class="text-base-content/80 leading-relaxed">
							{outfit?.Description || outfit?.Desc || outfit?.Details || 'ไม่มีรายละเอียด'}
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
							{#if outfit?.Province}
								<div class="flex justify-between">
									<span class="text-base-content/70">จังหวัด:</span>
									<span class="font-medium">{outfit.Province}</span>
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
							{#if shop?.expand?.user?.avatar}
								<div class="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-primary">
									<img
										src={`https://file.macosplay.com/_pb_users_auth_/${shop.expand.user.id}/${shop.expand.user.avatar}`}
										alt="{shop?.Name || shop?.name} Avatar"
										class="w-full h-full object-cover"
									/>
								</div>
							{:else}
								<div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
									{(shop?.Name || shop?.name || 'S').charAt(0).toUpperCase()}
								</div>
							{/if}
							<div>
								<h4 class="text-lg font-semibold text-base-content">{shop?.Name || shop?.name || 'Shop Name'}</h4>
								<p class="text-base-content/70">{shop?.location || shop?.Province || 'Location not specified'}</p>
							</div>
						</div>
						
						{#if shop?.description || shop?.Details}
							<p class="text-base-content/80 leading-relaxed mb-4">
								{shop.description || shop.Details}
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
							{#if shop?.fbPage}
								<div class="flex items-center text-base-content/80">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
										<path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
									</svg>
									เพจร้านค้า
								</div>
							{/if}
						</div>
					</div>

					<!-- Shop Actions -->
					<div class="space-y-3">
						<a href="/store/{shop?.slug || $page.params.shopID}" class="btn btn-outline w-full">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
							</svg>
							ดูร้านค้า
						</a>
						
						{#if shop?.fbPage}
							<a href={shop.fbPage} target="_blank" class="btn btn-outline w-full">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
									<path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
								</svg>
								เพจร้านค้า
							</a>
						{:else}
							<button class="btn btn-outline w-full">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
								</svg>
								ติดต่อร้านค้า
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
