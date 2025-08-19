<script lang="ts">
    import { onMount } from 'svelte';
    
    export let data: { userStore: any[] }; // Define data type
    let fullImage = null;
    let isLoading = true;
    let imagesLoaded = new Set();
    
    // Enhanced interaction states
    let hoveredCard = null;
    
    // Simulate initial loading
    onMount(() => {
        setTimeout(() => {
            isLoading = false;
        }, 800);
    });
    
    // Handle image load events
    function handleImageLoad(shopId: string) {
        imagesLoaded.add(shopId);
        imagesLoaded = imagesLoaded; // Trigger reactivity
    }
</script>

<section class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Modern Header Section -->
        <div class="text-center mb-8 sm:mb-10 lg:mb-12">
            <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
            </div>
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
                ร้านค้า Cosplay Store ของคุณ
            </h1>
            <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4 leading-relaxed">
                จัดการร้านค้าของคุณได้อย่างง่ายดาย พร้อมเครื่องมือครบครันสำหรับการขาย
            </p>
            
            <!-- Action Bar -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <a href="/create-shop" class="group w-full sm:w-auto">
                    <button class="btn-primary-modern flex items-center gap-3 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center">
                        <svg class="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        สร้างร้านค้าใหม่
                    </button>
                </a>
                
                <!-- Store Count Badge -->
                <div class="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg border border-white/20">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-gray-700 font-medium text-sm sm:text-base">
                        <span class="hidden sm:inline">{data.userStore.length} / 1 ร้านค้าที่ใช้งานอยู่</span>
                        <span class="sm:hidden">{data.userStore.length}/1 ร้านค้า</span>
                    </span>
                </div>
            </div>
        </div>
        <!-- Store Grid -->
        {#if isLoading}
            <!-- Skeleton Loading State -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {#each Array(3) as _, index}
                    <div class="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100/50 animate-pulse">
                        <!-- Skeleton Banner -->
                        <div class="w-full h-56 bg-gray-200 loading-shimmer"></div>
                        
                        <!-- Skeleton Content -->
                        <div class="p-6">
                            <div class="h-6 bg-gray-200 rounded-lg mb-4 loading-shimmer"></div>
                            <div class="space-y-3 mb-6">
                                <div class="flex gap-2">
                                    <div class="w-4 h-4 bg-gray-200 rounded mt-1"></div>
                                    <div class="flex-1">
                                        <div class="h-3 bg-gray-200 rounded mb-2"></div>
                                        <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <div class="w-4 h-4 bg-gray-200 rounded"></div>
                                    <div class="flex-1">
                                        <div class="h-3 bg-gray-200 rounded mb-2"></div>
                                        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="h-12 bg-gray-200 rounded-xl loading-shimmer"></div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else if data.userStore && data.userStore.length > 0}
            <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {#each data.userStore as shop, index}
                    <div 
                        class="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50"
                        on:mouseenter={() => hoveredCard = index}
                        on:mouseleave={() => hoveredCard = null}
                    >
                        <!-- Store Banner -->
                        <div class="relative overflow-hidden">
                            <!-- Image Loading Placeholder -->
                            {#if !imagesLoaded.has(shop.id)}
                                <div class="absolute inset-0 bg-gray-200 loading-shimmer flex items-center justify-center">
                                    <svg class="w-12 h-12 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            {/if}
                            
                            <img 
                                src={`https://file.macosplay.com/nrxs44dis9q1tgb/${shop.id}/${shop.banner}`} 
                                alt="{shop.Name} Banner" 
                                class="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110 cursor-pointer {imagesLoaded.has(shop.id) ? 'opacity-100' : 'opacity-0'}" 
                                on:click={() => (fullImage = `https://file.macosplay.com/nrxs44dis9q1tgb/${shop.id}/${shop.banner}`)}
                                on:load={() => handleImageLoad(shop.id)}
                                loading="lazy"
                            />
                            
                            <!-- Overlay Gradient -->
                            <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <!-- Quick View Button -->
                            <button 
                                class="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                                on:click={() => (fullImage = `https://file.macosplay.com/nrxs44dis9q1tgb/${shop.id}/${shop.banner}`)}
                            >
                                <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </button>
                        </div>

                        <!-- Card Content -->
                        <div class="p-4 sm:p-6">
                            <!-- Store Name -->
                            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                {shop.Name}
                            </h2>
                            
                            <!-- Store Details -->
                            <div class="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                <div class="flex items-start gap-2">
                                    <svg class="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                    </svg>
                                    <div class="min-w-0 flex-1">
                                        <p class="text-sm text-gray-500 mb-1">รายละเอียด</p>
                                        <a href={shop.Details} class="text-blue-600 hover:text-blue-800 font-medium text-sm break-all transition-colors duration-200" target="_blank">
                                            {shop.Details}
                                        </a>
                                    </div>
                                </div>
                                
                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <div>
                                        <p class="text-sm text-gray-500">สร้างเมื่อ</p>
                                        <p class="text-sm font-medium text-gray-700">
                                            {new Date(shop.created).toLocaleDateString('th-TH', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Action Button -->
                            <a href="/manage-store/{shop.id}" class="block">
                                <button class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    จัดการร้านค้า
                                    <svg class="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </a>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <!-- Enhanced Empty State -->
            <div class="text-center py-16">
                <div class="max-w-md mx-auto">
                    <!-- Empty State Illustration -->
                    <div class="mb-8">
                        <div class="relative mx-auto w-32 h-32 mb-6">
                            <div class="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
                            <div class="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Empty State Content -->
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">
                        ยังไม่มีร้านค้า
                    </h3>
                    <p class="text-gray-600 mb-8 leading-relaxed">
                        เริ่มต้นการขายด้วยการสร้างร้านค้าแรกของคุณ<br>
                        ง่ายๆ เพียงไม่กี่ขั้นตอน
                    </p>
                    
                    <!-- Call to Action -->
                    <a href="/create-shop" class="group inline-block">
                        <button class="btn-primary-modern flex items-center gap-3 text-lg px-8 py-4 mx-auto">
                            <svg class="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            สร้างร้านค้าแรกของคุณ
                        </button>
                    </a>
                    
                    <!-- Features Preview -->
                    <div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-1">อัปโหลดสินค้า</h4>
                            <p class="text-sm text-gray-500">เพิ่มรูปภาพและรายละเอียดสินค้า</p>
                        </div>
                        
                        <div class="text-center">
                            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-1">จัดการราคา</h4>
                            <p class="text-sm text-gray-500">ตั้งราคาและโปรโมชั่น</p>
                        </div>
                        
                        <div class="text-center">
                            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-1">ติดตามยอดขาย</h4>
                            <p class="text-sm text-gray-500">ดูสถิติและรายงาน</p>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</section>


<!-- Enhanced Image Modal -->
{#if fullImage}
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
		on:click={() => (fullImage = null)}
		on:keydown={(e) => e.key === 'Escape' && (fullImage = null)}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div 
			class="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 scale-95 animate-[modalSlideIn_0.3s_ease-out_forwards]"
			on:click|stopPropagation
		>
			<!-- Modal Header -->
			<div class="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-6">
				<div class="flex items-center justify-between">
					<h3 class="text-white font-semibold text-lg">ภาพขยายแบบเต็ม</h3>
					<button 
						class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
						on:click={() => (fullImage = null)}
						aria-label="ปิดภาพ"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
			</div>
			
			<!-- Modal Image -->
			<img 
				src={fullImage} 
				alt="ภาพขยายแบบเต็ม" 
				class="w-full h-auto max-h-[90vh] object-contain"
				loading="lazy"
			/>
			
			<!-- Modal Footer -->
			<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
				<div class="flex items-center justify-center gap-4">
					<button 
						class="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
						on:click={() => window.open(fullImage, '_blank')}
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
						</svg>
						เปิดในแท็บใหม่
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes modalSlideIn {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
	
	/* Enhanced card hover effects */
	:global(.group:hover .group-hover\:scale-110) {
		transform: scale(1.1);
	}
	
	/* Smooth image loading */
	:global(img) {
		transition: opacity 0.3s ease;
	}
	
	:global(img[loading="lazy"]) {
		opacity: 0;
		animation: fadeIn 0.5s ease forwards;
	}
	
	@keyframes fadeIn {
		to {
			opacity: 1;
		}
	}
	
	/* Line clamp utility for text truncation */
	:global(.line-clamp-2) {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	
	/* Enhanced responsive hover effects */
	@media (min-width: 768px) {
		:global(.group:hover) {
			transform: translateY(-8px);
		}
	}
	
	/* Touch-friendly interactions on mobile */
	@media (max-width: 767px) {
		:global(.group:active) {
			transform: scale(0.98);
		}
		
		:global(.btn-primary-modern:active) {
			transform: scale(0.95);
		}
	}
	
	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		:global(*) {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>