<script lang="ts">
    import { onMount } from 'svelte';
    
    export let data: { userStore: any[] }; // Define data type
    let fullImage = null;
    let isLoading = true;
    let imagesLoaded = new Set();
    let currentTheme = 'light';
    
    // Enhanced interaction states
    let hoveredCard = null;
    
    // Dashboard stats
    let stats = {
        totalPosts: 0,
        totalSeries: 0,
        totalCharacters: 0,
        totalBrands: 0
    };
    
    // Function to check current theme
    function getCurrentTheme() {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            const documentTheme = document.documentElement.getAttribute('data-theme');
            return documentTheme || savedTheme || 'light';
        }
        return 'light';
    }
    
    // Simulate initial loading
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
        
        // Calculate stats from store data
        if (data.userStore && data.userStore.length > 0) {
            // You can customize these calculations based on your actual data structure
            stats.totalPosts = data.userStore.reduce((total, store) => total + (store.items?.length || 0), 0);
            stats.totalSeries = data.userStore.length;
            stats.totalCharacters = data.userStore.reduce((total, store) => total + (store.characters?.length || 0), 0);
            stats.totalBrands = new Set(data.userStore.map(store => store.brand).filter(Boolean)).size;
        }
        
        setTimeout(() => {
            isLoading = false;
        }, 800);
        
        return () => observer.disconnect();
    });
    
    // Handle image load events
    function handleImageLoad(shopId: string) {
        imagesLoaded.add(shopId);
        imagesLoaded = imagesLoaded; // Trigger reactivity
    }
</script>

<!-- Dashboard Container -->
<div class="p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="mb-8">
            <div class="flex items-center gap-4 mb-6">
                <div class="flex items-center justify-center w-12 h-12 {currentTheme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-purple-700' : 'bg-gradient-to-r from-blue-500 to-purple-600'} rounded-xl">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">
                        ร้านค้า Cosplay Store ของคุณ
                    </h1>
                    <p class="{currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base">
                        จัดการร้านค้าและติดตามสถิติการขายของคุณ
                    </p>
                </div>
            </div>
            
            <!-- Stats Dashboard Cards (Inspired by the design) -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <!-- Total Posts Card -->
                <div class="manage-store-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 border">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <svg class="w-5 h-5 {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <div class="text-3xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">
                        {stats.totalPosts}
                    </div>
                    <div class="text-sm manage-store-text-muted">Total Post</div>
                </div>
                
                <!-- Total Series Card -->
                <div class="manage-store-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 border">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10z"></path>
                            </svg>
                        </div>
                        <svg class="w-5 h-5 {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <div class="text-3xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">
                        {stats.totalSeries}
                    </div>
                    <div class="text-sm manage-store-text-muted">Total Series</div>
                </div>
                
                <!-- Total Characters Card -->
                <div class="manage-store-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 border">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-xl">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <svg class="w-5 h-5 {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <div class="text-3xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">
                        {stats.totalCharacters}
                    </div>
                    <div class="text-sm manage-store-text-muted">Total Karakter</div>
                </div>
                
                <!-- Total Brands Card -->
                <div class="manage-store-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 border">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                        </div>
                        <svg class="w-5 h-5 {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <div class="text-3xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">
                        {stats.totalBrands}
                    </div>
                    <div class="text-sm manage-store-text-muted">Total Brand</div>
                </div>
            </div>
            
            <!-- Action Section -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div class="flex items-center gap-4">
                    <a href="/create-shop" class="group">
                        <button class="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 {currentTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <svg class="w-5 h-5 mr-2 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            สร้างร้านค้าใหม่
                        </button>
                    </a>
                    
                    <!-- WhatsApp Group Button (inspired by the original design) -->
                    <button class="inline-flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 {currentTheme === 'dark' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'} shadow-lg hover:shadow-xl">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63z"/>
                        </svg>
                        Join Group WhatsApp
                    </button>
                </div>
                
                <!-- Store Count Badge -->
                <div class="flex items-center gap-3 {currentTheme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border {currentTheme === 'dark' ? 'border-gray-700' : 'border-white/20'}">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="{currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm">
                        {data.userStore.length} / 1 ร้านค้าที่ใช้งานอยู่
                    </span>
                </div>
            </div>
            
            <!-- Info Section (inspired by the original WhatsApp group description) -->
            <div class="manage-store-card rounded-2xl p-6 mb-8 border">
                <div class="flex items-start gap-4">
                    <div class="flex items-center justify-center w-10 h-10 bg-blue-100 {currentTheme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} rounded-lg">
                        <svg class="w-5 h-5 {currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="{currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed">
                            สำหรับผู้ที่ต้องการจัดการร้านค้าคอสเพลย์ คุณสามารถเข้าร่วมกลุ่ม WhatsApp เพื่อรับข้อมูลเกี่ยวกับเครื่องแต่งกาย การขาย และข้อมูลสำคัญอื่นๆ
                        </p>
                        <p class="{currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs mt-2">
                            <strong>เงื่อนไขการเข้าร่วม:</strong> <em>ต้องอัพโหลดแค็ตตาล็อกอย่างน้อย 20 ชุด</em>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- Store Grid -->
        {#if isLoading}
            <!-- Skeleton Loading State -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {#each Array(3) as _, index}
                    <div class="manage-store-card rounded-2xl overflow-hidden shadow-lg border animate-pulse">
                        <!-- Skeleton Banner -->
                        <div class="w-full h-48 {currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} loading-shimmer"></div>
                        
                        <!-- Skeleton Content -->
                        <div class="p-6">
                            <div class="h-6 {currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg mb-4 loading-shimmer"></div>
                            <div class="space-y-3 mb-6">
                                <div class="flex gap-2">
                                    <div class="w-4 h-4 {currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mt-1"></div>
                                    <div class="flex-1">
                                        <div class="h-3 {currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2"></div>
                                        <div class="h-3 {currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4"></div>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <div class="w-4 h-4 {currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded"></div>
                                    <div class="flex-1">
                                        <div class="h-3 {currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2"></div>
                                        <div class="h-3 {currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="h-12 {currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl loading-shimmer"></div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else if data.userStore && data.userStore.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {#each data.userStore as shop, index}
                    <div 
                        class="group relative manage-store-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border"
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
                        <div class="p-6">
                            <!-- Store Name -->
                            <h2 class="text-xl font-bold {currentTheme === 'dark' ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'} mb-3 transition-colors duration-300 line-clamp-2">
                                {shop.Name}
                            </h2>
                            
                            <!-- Store Details -->
                            <div class="space-y-3 mb-6">
                                <div class="flex items-start gap-3">
                                    <svg class="w-4 h-4 {currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                    </svg>
                                    <div class="min-w-0 flex-1">
                                        <p class="text-sm manage-store-text-muted mb-1">รายละเอียด</p>
                                        <a href={shop.Details} class="{currentTheme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium text-sm break-all transition-colors duration-200" target="_blank">
                                            {shop.Details}
                                        </a>
                                    </div>
                                </div>
                                
                                <div class="flex items-center gap-3">
                                    <svg class="w-4 h-4 {currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <div>
                                        <p class="text-sm manage-store-text-muted">สร้างเมื่อ</p>
                                        <p class="text-sm font-medium {currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}">
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
                                <button class="w-full {currentTheme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'} text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
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
                            <div class="absolute inset-0 {currentTheme === 'dark' ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-100 to-purple-100'} rounded-full animate-pulse"></div>
                            <div class="absolute inset-4 {currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-full flex items-center justify-center">
                                <svg class="w-12 h-12 {currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Empty State Content -->
                    <h3 class="text-2xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4">
                        ยังไม่มีร้านค้า
                    </h3>
                    <p class="{currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8 leading-relaxed">
                        เริ่มต้นการขายด้วยการสร้างร้านค้าแรกของคุณ<br>
                        ง่ายๆ เพียงไม่กี่ขั้นตอน
                    </p>
                    
                    <!-- Call to Action -->
                    <a href="/create-shop" class="group inline-block">
                        <button class="inline-flex items-center gap-3 text-lg px-8 py-4 {currentTheme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'} text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <svg class="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            สร้างร้านค้าแรกของคุณ
                        </button>
                    </a>
                    
                    <!-- Features Preview -->
                    <div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div class="text-center">
                            <div class="w-12 h-12 {currentTheme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} rounded-xl flex items-center justify-center mx-auto mb-3">
                                <svg class="w-6 h-6 {currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">อัปโหลดสินค้า</h4>
                            <p class="text-sm manage-store-text-muted">เพิ่มรูปภาพและรายละเอียดสินค้า</p>
                        </div>
                        
                        <div class="text-center">
                            <div class="w-12 h-12 {currentTheme === 'dark' ? 'bg-green-900' : 'bg-green-100'} rounded-xl flex items-center justify-center mx-auto mb-3">
                                <svg class="w-6 h-6 {currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">จัดการราคา</h4>
                            <p class="text-sm manage-store-text-muted">ตั้งราคาและโปรโมชั่น</p>
                        </div>
                        
                        <div class="text-center">
                            <div class="w-12 h-12 {currentTheme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'} rounded-xl flex items-center justify-center mx-auto mb-3">
                                <svg class="w-6 h-6 {currentTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">ติดตามยอดขาย</h4>
                            <p class="text-sm manage-store-text-muted">ดูสถิติและรายงาน</p>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>


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