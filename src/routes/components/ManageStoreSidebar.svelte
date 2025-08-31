<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { InspirationManager, showToast } from '$lib/inspiration';
    
    export let currentTheme = 'light';
    export let storeData = null;
    export let inspirationItems = [];
    
    // Make inspiration items reactive to external changes
    $: if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('cosplay_inspiration');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (JSON.stringify(parsed) !== JSON.stringify(inspirationItems)) {
                    inspirationItems = parsed;
                }
            } catch (e) {
                console.error('Error loading inspiration items in sidebar:', e);
            }
        }
    }
    
    let sidebarOpen = false;
    let activeTab = 'navigation';
    
    // Navigation items
    const navigationItems = [
        {
            id: 'overview',
            label: 'ภาพรวม',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            href: '/manage-store'
        },
        {
            id: 'products',
            label: 'จัดการสินค้า',
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
            href: storeData ? `/manage-store/${storeData.id}` : '/manage-store'
        },
        {
            id: 'analytics',
            label: 'สถิติการขาย',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            href: '/manage-store/analytics'
        },
        {
            id: 'orders',
            label: 'คำสั่งซื้อ',
            icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
            href: '/manage-store/orders'
        },
        {
            id: 'inspiration',
            label: 'แรงบันดาลใจ',
            icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
            href: '/manage-store/inspiration'
        }
    ];
    
    // Get current route
    $: currentRoute = $page.url.pathname;
    $: isActive = (href) => currentRoute === href || currentRoute.startsWith(href + '/');
    
    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }
    
    function removeFromInspiration(inspirationId) {
        if (InspirationManager.remove(inspirationId)) {
            inspirationItems = InspirationManager.getAll();
            showToast('ลบจากแรงบันดาลใจแล้ว!', 'success', currentTheme);
        }
    }
    
    onMount(() => {
        // Load inspiration items using utility
        inspirationItems = InspirationManager.getAll();
    });
</script>

<!-- Mobile Sidebar Toggle -->
<button 
    class="fixed top-4 left-4 z-50 lg:hidden {currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105"
    on:click={toggleSidebar}
>
    <svg class="w-6 h-6 {currentTheme === 'dark' ? 'text-white' : 'text-gray-800'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
</button>

<!-- Sidebar Overlay for Mobile -->
{#if sidebarOpen}
    <div 
        class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
        on:click={toggleSidebar}
    ></div>
{/if}

<!-- Sidebar -->
<div class="fixed left-0 top-0 h-full w-80 {currentTheme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r shadow-xl z-40 transform transition-transform duration-300 lg:translate-x-0 {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col">
    <!-- Sidebar Header -->
    <div class="p-6 border-b {currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 {currentTheme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-purple-700' : 'bg-gradient-to-r from-blue-500 to-purple-600'} rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                </div>
                <div>
                    <h2 class="text-lg font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}">จัดการร้านค้า</h2>
                    <p class="text-xs {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}">{storeData?.Name || 'ร้านค้าของคุณ'}</p>
                </div>
            </div>
            <button 
                class="lg:hidden {currentTheme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors"
                on:click={toggleSidebar}
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    </div>
    
    <!-- Tab Navigation -->
    <div class="flex border-b {currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}">
        <button 
            class="flex-1 py-3 px-4 text-sm font-medium transition-colors {activeTab === 'navigation' ? (currentTheme === 'dark' ? 'bg-blue-900 text-blue-300 border-b-2 border-blue-500' : 'bg-blue-50 text-blue-600 border-b-2 border-blue-500') : (currentTheme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}"
            on:click={() => activeTab = 'navigation'}
        >
            <svg class="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            เมนู
        </button>
        <button 
            class="flex-1 py-3 px-4 text-sm font-medium transition-colors {activeTab === 'inspiration' ? (currentTheme === 'dark' ? 'bg-pink-900 text-pink-300 border-b-2 border-pink-500' : 'bg-pink-50 text-pink-600 border-b-2 border-pink-500') : (currentTheme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}"
            on:click={() => activeTab = 'inspiration'}
        >
            <svg class="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            แรงบันดาลใจ
        </button>
    </div>
    
    <!-- Sidebar Content -->
    <div class="flex-1 overflow-y-auto">
        {#if activeTab === 'navigation'}
            <!-- Navigation Tab -->
            <div class="p-4">
                <div class="space-y-2">
                    {#each navigationItems as item}
                        <a 
                            href={item.href}
                            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {isActive(item.href) ? (currentTheme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600') : (currentTheme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')}"
                            on:click={() => sidebarOpen = false}
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}></path>
                            </svg>
                            <span class="font-medium">{item.label}</span>
                            {#if isActive(item.href)}
                                <div class="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                            {/if}
                        </a>
                    {/each}
                </div>
                
                <!-- Quick Actions -->
                <div class="mt-6 pt-6 border-t {currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}">
                    <h3 class="text-sm font-semibold {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3 uppercase tracking-wide">การดำเนินการด่วน</h3>
                    <div class="space-y-2">
                        <a 
                            href="/create-shop"
                            class="flex items-center gap-3 px-4 py-3 rounded-xl {currentTheme === 'dark' ? 'bg-green-900 text-green-300 hover:bg-green-800' : 'bg-green-50 text-green-600 hover:bg-green-100'} transition-all duration-200"
                            on:click={() => sidebarOpen = false}
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            <span class="font-medium">สร้างร้านใหม่</span>
                        </a>
                        
                        {#if storeData}
                            <button 
                                class="flex items-center gap-3 px-4 py-3 rounded-xl {currentTheme === 'dark' ? 'bg-purple-900 text-purple-300 hover:bg-purple-800' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'} transition-all duration-200 w-full text-left"
                                on:click={() => document.getElementById('my_modal_5')?.showModal()}
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                <span class="font-medium">เพิ่มสินค้า</span>
                            </button>
                        {/if}
                    </div>
                </div>
                
                <!-- Store Info -->
                {#if storeData}
                    <div class="mt-6 pt-6 border-t {currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}">
                        <h3 class="text-sm font-semibold {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3 uppercase tracking-wide">ข้อมูลร้าน</h3>
                        <div class="{currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-10 h-10 {currentTheme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-purple-700' : 'bg-gradient-to-r from-blue-500 to-purple-600'} rounded-lg flex items-center justify-center">
                                    <span class="text-white font-bold text-sm">{storeData.Name?.charAt(0) || 'S'}</span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-sm font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} truncate">{storeData.Name}</h4>
                                    <p class="text-xs {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} truncate">สร้างเมื่อ {new Date(storeData.created).toLocaleDateString('th-TH')}</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-2 text-xs">
                                <div class="text-center">
                                    <div class="font-bold {currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}">{storeData.visitor || 0}</div>
                                    <div class="{currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}">ผู้เข้าชม</div>
                                </div>
                                <div class="text-center">
                                    <div class="font-bold {currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'}">{storeData.itemCount || 0}</div>
                                    <div class="{currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}">สินค้า</div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {:else if activeTab === 'inspiration'}
            <!-- Inspiration Tab -->
            <div class="p-4">
                <div class="mb-4">
                    <h3 class="text-lg font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2">แรงบันดาลใจ</h3>
                    <p class="text-sm {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}">เก็บไอเดียชุดคอสเพลย์ที่คุณชื่นชอบ</p>
                </div>
                
                {#if inspirationItems.length > 0}
                    <div class="space-y-3">
                        {#each inspirationItems as item}
                            <div class="group {currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-3 border shadow-sm hover:shadow-md transition-all duration-200">
                                <div class="flex gap-3">
                                    <!-- Thumbnail -->
                                    <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                        {#if item.Image}
                                            <img 
                                                src={`https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`}
                                                alt={item.Name}
                                                class="w-full h-full object-cover"
                                            />
                                        {:else}
                                            <div class="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                        {/if}
                                    </div>
                                    
                                    <!-- Content -->
                                    <div class="flex-1 min-w-0">
                                        <h4 class="text-sm font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} line-clamp-1">{item.Name}</h4>
                                        <p class="text-xs {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} line-clamp-2 mt-1">{item.Details || item.Desc || 'ไม่มีรายละเอียด'}</p>
                                        <div class="flex items-center justify-between mt-2">
                                            <span class="text-xs font-bold {currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'}">
                                                ฿{item.price?.toLocaleString() || '0'}
                                            </span>
                                            <button 
                                                class="opacity-0 group-hover:opacity-100 {currentTheme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'} transition-all duration-200"
                                                on:click={() => removeFromInspiration(item.inspirationId)}
                                                title="ลบจากแรงบันดาลใจ"
                                            >
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <!-- Empty State -->
                    <div class="text-center py-12">
                        <div class="w-16 h-16 mx-auto {currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl flex items-center justify-center mb-4">
                            <svg class="w-8 h-8 {currentTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </div>
                        <h4 class="text-sm font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2">ยังไม่มีแรงบันดาลใจ</h4>
                        <p class="text-xs {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4">เก็บไอเดียชุดคอสเพลย์ที่คุณชื่นชอบไว้ที่นี่</p>
                        <p class="text-xs {currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}">💡 เคล็ดลับ: คลิกปุ่ม "เพิ่มเป็นแรงบันดาลใจ" ในสินค้าที่คุณชอบ</p>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
    
    <!-- Sidebar Footer -->
    <div class="p-4 border-t {currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}">
        <div class="text-center">
            <p class="text-xs {currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}">© 2024 MaCosplay</p>
            <p class="text-xs {currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}">จัดการร้านค้าคอสเพลย์</p>
        </div>
    </div>
</div>

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