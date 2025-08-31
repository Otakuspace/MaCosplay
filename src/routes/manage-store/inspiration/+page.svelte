<script lang="ts">
    import { onMount } from 'svelte';
    import OutfitDetailModal from '../../components/OutfitDetailModal.svelte';
    import { InspirationManager, showToast } from '$lib/inspiration';
    
    let currentTheme = 'light';
    let inspirationItems = [];
    let searchQuery = '';
    let selectedCategory = '';
    let showOutfitDetail = false;
    let selectedOutfit = null;
    
    // Function to check current theme
    function getCurrentTheme() {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            const documentTheme = document.documentElement.getAttribute('data-theme');
            return documentTheme || savedTheme || 'light';
        }
        return 'light';
    }
    
    onMount(() => {
        currentTheme = getCurrentTheme();
        
        // Load inspiration items using utility
        inspirationItems = InspirationManager.getAll();
        
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
    
    function removeFromInspiration(inspirationId) {
        if (InspirationManager.remove(inspirationId)) {
            inspirationItems = InspirationManager.getAll();
            showToast('ลบจากแรงบันดาลใจแล้ว!', 'success', currentTheme);
        } else {
            showToast('ไม่พบรายการที่ต้องการลบ', 'error', currentTheme);
        }
    }
    
    function openOutfitDetail(item) {
        selectedOutfit = item;
        showOutfitDetail = true;
    }
    
    function closeOutfitDetail() {
        showOutfitDetail = false;
        selectedOutfit = null;
    }
    
    function clearAllInspiration() {
        InspirationManager.clear();
        inspirationItems = [];
        showToast('ล้างแรงบันดาลใจทั้งหมดแล้ว!', 'success', currentTheme);
    }
    
    // Filter function using utility
    $: filteredItems = InspirationManager.search(searchQuery, selectedCategory);
    
    // Get unique categories using utility
    $: categories = InspirationManager.getCategories();
</script>

<svelte:head>
    <title>แรงบันดาลใจ - จัดการร้านค้า | MaCosplay</title>
</svelte:head>

<!-- Main Content -->
<div class="p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="mb-8">
            <div class="flex items-center gap-4 mb-6">
                <div class="flex items-center justify-center w-12 h-12 {currentTheme === 'dark' ? 'bg-gradient-to-r from-pink-600 to-purple-700' : 'bg-gradient-to-r from-pink-500 to-purple-600'} rounded-xl">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">
                        แรงบันดาลใจ
                    </h1>
                    <p class="{currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base">
                        เก็บไอเดียชุดคอสเพลย์ที่คุณชื่นชอบและใช้เป็นแรงบันดาลใจ
                    </p>
                </div>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="manage-store-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 border">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center justify-center w-12 h-12 bg-pink-500 rounded-xl">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="text-3xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">
                        {inspirationItems.length}
                    </div>
                    <div class="text-sm manage-store-text-muted">ไอเดียทั้งหมด</div>
                </div>
                
                <div class="manage-store-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 border">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="text-3xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">
                        {categories.length}
                    </div>
                    <div class="text-sm manage-store-text-muted">หมวดหมู่</div>
                </div>
                
                <div class="manage-store-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 border">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="text-3xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">
                        ฿{inspirationItems.reduce((sum, item) => sum + (item.price || 0), 0).toLocaleString()}
                    </div>
                    <div class="text-sm manage-store-text-muted">มูลค่ารวม</div>
                </div>
                
                <div class="manage-store-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 border">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="text-3xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1">
                        {inspirationItems.filter(item => {
                            const addedDate = new Date(item.addedAt);
                            const today = new Date();
                            return addedDate.toDateString() === today.toDateString();
                        }).length}
                    </div>
                    <div class="text-sm manage-store-text-muted">วันนี้</div>
                </div>
            </div>
        </div>
        
        <!-- Search and Filter Section -->
        {#if inspirationItems.length > 0}
            <div class="{currentTheme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-md rounded-3xl p-6 sm:p-8 mb-12 sm:mb-16 shadow-xl border {currentTheme === 'dark' ? 'border-gray-700/20' : 'border-white/20'}">
                <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <!-- Search Input -->
                    <div class="relative flex-1 max-w-md">
                        <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg class="w-5 h-5 {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="ค้นหาแรงบันดาลใจ..." 
                            bind:value={searchQuery} 
                            class="w-full pl-12 pr-4 py-3 rounded-xl border-2 {currentTheme === 'dark' ? 'border-gray-600 bg-gray-700/80 text-white placeholder-gray-400 focus:border-pink-500' : 'border-gray-200 bg-white/80 text-gray-700 placeholder-gray-400 focus:border-pink-500'} backdrop-blur-sm focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 font-medium"
                        />
                    </div>
                    
                    <!-- Category Filter -->
                    <div class="flex items-center gap-4">
                        <select 
                            bind:value={selectedCategory}
                            class="px-4 py-3 rounded-xl border-2 {currentTheme === 'dark' ? 'border-gray-600 bg-gray-700/80 text-white focus:border-purple-500' : 'border-gray-200 bg-white/80 text-gray-700 focus:border-purple-500'} backdrop-blur-sm focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 font-medium"
                        >
                            <option value="">ทุกหมวดหมู่</option>
                            {#each categories as category}
                                <option value={category}>{category}</option>
                            {/each}
                        </select>
                        
                        <!-- Clear All Button -->
                        {#if inspirationItems.length > 0}
                            <button 
                                class="px-4 py-3 {currentTheme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'} rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                on:click={clearAllInspiration}
                            >
                                <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                ล้างทั้งหมด
                            </button>
                        {/if}
                    </div>
                </div>
                
                <!-- Filter Tags -->
                <div class="mt-4 flex flex-wrap gap-2">
                    {#if searchQuery}
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {currentTheme === 'dark' ? 'bg-pink-900 text-pink-300' : 'bg-pink-100 text-pink-800'}">
                            🔍 "{searchQuery}"
                            <button on:click={() => searchQuery = ''} class="ml-2 {currentTheme === 'dark' ? 'hover:text-pink-200' : 'hover:text-pink-600'}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </span>
                    {/if}
                    {#if selectedCategory}
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {currentTheme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'}">
                            🏷️ {selectedCategory}
                            <button on:click={() => selectedCategory = ''} class="ml-2 {currentTheme === 'dark' ? 'hover:text-purple-200' : 'hover:text-purple-600'}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </span>
                    {/if}
                </div>
            </div>
        {/if}
        
        <!-- Inspiration Grid -->
        {#if filteredItems.length > 0}
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6">
                {#each filteredItems as item}
                    <div class="group {currentTheme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border {currentTheme === 'dark' ? 'border-gray-700/50' : 'border-gray-100/50'} relative flex flex-col h-full">
                        <!-- Card Glow Effect -->
                        <div class="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div class="relative flex flex-col h-full">
                            <!-- Product Image -->
                            <div class="relative overflow-hidden">
                                <div class="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                    <img 
                                        src={`https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`} 
                                        alt="{item.Name} Thumbnail" 
                                        class="w-full h-full object-cover cursor-pointer transition-all duration-500 group-hover:scale-105" 
                                        on:click={() => openOutfitDetail(item)}
                                    />
                                </div>
                                
                                <!-- Added Date Badge -->
                                <div class="absolute top-2 left-2 z-10">
                                    <div class="px-2 py-1 {currentTheme === 'dark' ? 'bg-pink-900 text-pink-300' : 'bg-pink-100 text-pink-800'} rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
                                        {new Date(item.addedAt).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                                
                                <!-- Remove Button -->
                                <div class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <button 
                                        class="bg-red-500/90 text-white p-2 rounded-lg shadow-lg hover:bg-red-600 transition-all duration-200"
                                        on:click={() => removeFromInspiration(item.inspirationId)}
                                        title="ลบจากแรงบันดาลใจ"
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Card Content -->
                            <div class="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                                <div class="space-y-2">
                                    <!-- Product Title -->
                                    <h3 class="text-sm sm:text-base font-bold {currentTheme === 'dark' ? 'text-white group-hover:text-pink-400' : 'text-gray-800 group-hover:text-pink-600'} line-clamp-2 transition-colors duration-300 min-h-[2.5rem]">
                                        {item.Name}
                                    </h3>
                                    
                                    <!-- Product Details -->
                                    <p class="text-xs {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} line-clamp-2 leading-relaxed min-h-[2rem]">
                                        {item.Details || item.Desc || 'ไม่มีรายละเอียด'}
                                    </p>

                                    <!-- Tags -->
                                    <div class="flex flex-wrap gap-1">
                                        {#if item.Province}
                                            <span class="px-2 py-1 {currentTheme === 'dark' ? 'bg-gradient-to-r from-blue-800 to-blue-700 text-blue-200' : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'} rounded-lg text-xs font-semibold">
                                                {item.Province}
                                            </span>
                                        {/if}
                                        {#if item.Size}
                                            <span class="px-2 py-1 {currentTheme === 'dark' ? 'bg-gradient-to-r from-purple-800 to-purple-700 text-purple-200' : 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800'} rounded-lg text-xs font-semibold">
                                                {item.Size}
                                            </span>
                                        {/if}
                                    </div>

                                    <!-- Price Display -->
                                    <div class="p-2 {currentTheme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-pink-900 border-gray-700' : 'bg-gradient-to-r from-gray-50 to-pink-50 border-gray-100'} rounded-lg border">
                                        <div class="text-center">
                                            {#if item.isPriTest}
                                                <div class="space-y-1">
                                                    <div class="flex items-center justify-between">
                                                        <span class="text-xs font-medium {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}">ไพร:</span>
                                                        <span class="text-sm font-bold {currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'}">฿{item.price_pri?.toLocaleString() || '0'}</span>
                                                    </div>
                                                    <div class="flex items-center justify-between">
                                                        <span class="text-xs font-medium {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}">เทส:</span>
                                                        <span class="text-sm font-bold {currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}">฿{item.price_test?.toLocaleString() || '0'}</span>
                                                    </div>
                                                </div>
                                            {:else}
                                                <div class="flex items-center justify-center space-x-1">
                                                    <span class="text-xs font-medium {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}">ราคา:</span>
                                                    <span class="text-sm font-bold {currentTheme === 'dark' ? 'bg-gradient-to-r from-green-400 to-pink-400' : 'bg-gradient-to-r from-green-600 to-pink-600'} bg-clip-text text-transparent">
                                                        ฿{item.price?.toLocaleString() || '0'}
                                                    </span>
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Button -->
                                <div class="mt-3">
                                    <button 
                                        class="w-full px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 text-xs font-bold shadow-sm hover:shadow-md transform hover:scale-105"
                                        on:click={() => openOutfitDetail(item)}
                                    >
                                        <svg class="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        ดูรายละเอียด
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <!-- Empty State -->
            <div class="text-center py-20">
                <div class="max-w-md mx-auto">
                    <!-- Empty State Illustration -->
                    <div class="mb-8">
                        <div class="relative mx-auto w-32 h-32 mb-6">
                            <div class="absolute inset-0 {currentTheme === 'dark' ? 'bg-gradient-to-r from-pink-900 to-purple-900' : 'bg-gradient-to-r from-pink-100 to-purple-100'} rounded-full animate-pulse"></div>
                            <div class="absolute inset-4 {currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-full flex items-center justify-center">
                                <svg class="w-12 h-12 {currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Empty State Content -->
                    <h3 class="text-2xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4">
                        ยังไม่มีแรงบันดาลใจ
                    </h3>
                    <p class="{currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8 leading-relaxed">
                        เริ่มต้นสะสมไอเดียชุดคอสเพลย์ที่คุณชื่นชอบ<br>
                        เพื่อใช้เป็นแรงบันดาลใจในการสร้างสรรค์
                    </p>
                    
                    <!-- Call to Action -->
                    <a href="/manage-store" class="group inline-block">
                        <button class="inline-flex items-center gap-3 text-lg px-8 py-4 {currentTheme === 'dark' ? 'bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'} text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            เริ่มค้นหาแรงบันดาลใจ
                        </button>
                    </a>
                    
                    <!-- Tips -->
                    <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <div class="text-center">
                            <div class="w-12 h-12 mx-auto {currentTheme === 'dark' ? 'bg-pink-900' : 'bg-pink-100'} rounded-2xl flex items-center justify-center mb-3">
                                <svg class="w-6 h-6 {currentTheme === 'dark' ? 'text-pink-400' : 'text-pink-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-800'} mb-1">เก็บไอเดีย</h4>
                            <p class="text-sm {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}">บันทึกชุดที่คุณชื่นชอบ</p>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 mx-auto {currentTheme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'} rounded-2xl flex items-center justify-center mb-3">
                                <svg class="w-6 h-6 {currentTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-800'} mb-1">สร้างสรรค์</h4>
                            <p class="text-sm {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}">ใช้เป็นแรงบันดาลใจ</p>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<!-- Outfit Detail Modal -->
{#if showOutfitDetail && selectedOutfit}
    <OutfitDetailModal 
        outfit={selectedOutfit}
        {currentTheme}
        onClose={closeOutfitDetail}
        onAddToInspiration={() => {}}
        isInInspiration={true}
    />
{/if}

<style>
    .line-clamp-1 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }
    
    .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
</style>