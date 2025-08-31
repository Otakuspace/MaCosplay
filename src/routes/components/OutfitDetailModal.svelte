<script lang="ts">
    export let outfit = null;
    export let currentTheme = 'light';
    export let onClose = () => {};
    export let onAddToInspiration = () => {};
    export let isInInspiration = false;
    
    let currentImageIndex = 0;
    
    $: productImages = outfit?.Images ? 
        (outfit.Images.filter((img) => img && img.trim() !== '')) : 
        (outfit?.Image ? [outfit.Image] : []);
    
    function getImageUrl(image) {
        if (image.startsWith('http')) {
            return image;
        }
        
        if (image.startsWith('/images/')) {
            return image;
        }
        
        return `https://file.macosplay.com/mxj3660ce5olheb/${outfit.id}/${image}`;
    }
    
    function nextImage() {
        if (productImages.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % productImages.length;
        }
    }
    
    function prevImage() {
        if (productImages.length > 1) {
            currentImageIndex = currentImageIndex === 0 ? productImages.length - 1 : currentImageIndex - 1;
        }
    }
    
    function selectImage(index) {
        currentImageIndex = index;
    }
    
    function handleAddToInspiration() {
        onAddToInspiration(outfit);
    }
</script>

{#if outfit}
    <!-- Modal Backdrop -->
    <div 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        on:click={onClose}
        on:keydown={(e) => e.key === 'Escape' && onClose()}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <!-- Modal Content -->
        <div 
            class="relative w-full max-w-6xl max-h-[95vh] {currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300"
            on:click|stopPropagation
        >
            <!-- Modal Header -->
            <div class="sticky top-0 z-10 {currentTheme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm border-b {currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 {currentTheme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-purple-700' : 'bg-gradient-to-r from-blue-500 to-purple-600'} rounded-xl flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}">{outfit.Name}</h2>
                            <p class="text-sm {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}">รายละเอียดสินค้า</p>
                        </div>
                    </div>
                    <button 
                        class="w-10 h-10 {currentTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                        on:click={onClose}
                        aria-label="ปิด"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Modal Body -->
            <div class="overflow-y-auto max-h-[calc(95vh-140px)]">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                    <!-- Image Gallery -->
                    <div class="space-y-4">
                        <!-- Main Image -->
                        <div class="relative aspect-square rounded-2xl overflow-hidden {currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}">
                            {#if productImages.length > 0}
                                <img 
                                    src={getImageUrl(productImages[currentImageIndex])}
                                    alt={outfit.Name}
                                    class="w-full h-full object-cover"
                                />
                                
                                <!-- Navigation Arrows -->
                                {#if productImages.length > 1}
                                    <button 
                                        class="absolute left-4 top-1/2 transform -translate-y-1/2 {currentTheme === 'dark' ? 'bg-gray-800/80 hover:bg-gray-700' : 'bg-white/80 hover:bg-white'} text-gray-700 rounded-full p-3 shadow-lg transition-all duration-200"
                                        on:click={prevImage}
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                    </button>
                                    
                                    <button 
                                        class="absolute right-4 top-1/2 transform -translate-y-1/2 {currentTheme === 'dark' ? 'bg-gray-800/80 hover:bg-gray-700' : 'bg-white/80 hover:bg-white'} text-gray-700 rounded-full p-3 shadow-lg transition-all duration-200"
                                        on:click={nextImage}
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                {/if}
                                
                                <!-- Image Counter -->
                                {#if productImages.length > 1}
                                    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 {currentTheme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                        {currentImageIndex + 1} / {productImages.length}
                                    </div>
                                {/if}
                            {:else}
                                <div class="w-full h-full flex items-center justify-center">
                                    <div class="text-center {currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}">
                                        <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
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
                                        class="aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 {index === currentImageIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}"
                                        on:click={() => selectImage(index)}
                                    >
                                        <img
                                            src={getImageUrl(image)}
                                            alt={`${outfit.Name} - Image ${index + 1}`}
                                            class="w-full h-full object-cover"
                                        />
                                    </button>
                                {/each}
                            </div>
                        {/if}
                    </div>
                    
                    <!-- Product Details -->
                    <div class="space-y-6">
                        <!-- Status Badge -->
                        {#if outfit.Status}
                            <div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium {outfit.Status === 'พร้อมให้เช่า' ? (currentTheme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') : outfit.Status === 'กำลังถูกเช่า' ? (currentTheme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800') : (currentTheme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')}">
                                {#if outfit.Status === 'พร้อมให้เช่า'}
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                {:else if outfit.Status === 'กำลังถูกเช่า'}
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                {:else}
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                {/if}
                                {outfit.Status}
                            </div>
                        {/if}
                        
                        <!-- Price -->
                        <div class="space-y-2">
                            <h3 class="text-lg font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}">ราคา</h3>
                            <div class="text-3xl font-bold text-blue-600">
                                {#if outfit.isPriTest}
                                    <div class="space-y-2">
                                        <div class="flex items-center justify-between {currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3">
                                            <span class="text-lg {currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}">ไพรเวท:</span>
                                            <span class="text-2xl font-bold text-green-600">฿{outfit.price_pri ? outfit.price_pri.toLocaleString() : '0'}</span>
                                        </div>
                                        <div class="flex items-center justify-between {currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3">
                                            <span class="text-lg {currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}">ทดสอบ:</span>
                                            <span class="text-2xl font-bold text-blue-600">฿{outfit.price_test ? outfit.price_test.toLocaleString() : '0'}</span>
                                        </div>
                                    </div>
                                {:else}
                                    ฿{outfit.price ? outfit.price.toLocaleString() : '0'}
                                {/if}
                            </div>
                        </div>
                        
                        <!-- Description -->
                        <div class="space-y-2">
                            <h3 class="text-lg font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}">รายละเอียด</h3>
                            <p class="text-base {currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed">
                                {outfit.Details || outfit.Desc || 'ไม่มีรายละเอียด'}
                            </p>
                        </div>
                        
                        <!-- Specifications -->
                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}">ข้อมูลสินค้า</h3>
                            <div class="grid grid-cols-2 gap-4">
                                {#if outfit.Size}
                                    <div class="{currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3">
                                        <div class="text-sm {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1">ขนาด</div>
                                        <div class="font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}">{outfit.Size}</div>
                                    </div>
                                {/if}
                                
                                {#if outfit.Province}
                                    <div class="{currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3">
                                        <div class="text-sm {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1">จังหวัด</div>
                                        <div class="font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}">{outfit.Province}</div>
                                    </div>
                                {/if}
                                
                                {#if outfit.brand}
                                    <div class="{currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3">
                                        <div class="text-sm {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1">แบรนด์</div>
                                        <div class="font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}">{outfit.brand}</div>
                                    </div>
                                {/if}
                                
                                {#if outfit.series}
                                    <div class="{currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3">
                                        <div class="text-sm {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1">ซีรีส์</div>
                                        <div class="font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}">{outfit.series}</div>
                                    </div>
                                {/if}
                                
                                {#if outfit.gender}
                                    <div class="{currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3">
                                        <div class="text-sm {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1">เพศ</div>
                                        <div class="font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}">{outfit.gender}</div>
                                    </div>
                                {/if}
                                
                                {#if outfit.created}
                                    <div class="{currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3">
                                        <div class="text-sm {currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1">วันที่สร้าง</div>
                                        <div class="font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}">
                                            {new Date(outfit.created).toLocaleDateString('th-TH', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                        
                        <!-- Tags -->
                        {#if outfit.tags && outfit.tags.length > 0}
                            <div class="space-y-2">
                                <h3 class="text-lg font-semibold {currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}">แท็ก</h3>
                                <div class="flex flex-wrap gap-2">
                                    {#each outfit.tags as tag}
                                        <span class="px-3 py-1 {currentTheme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'} rounded-full text-sm font-medium">
                                            #{tag}
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                        
                        <!-- Action Buttons -->
                        <div class="space-y-3 pt-4">
                            <!-- Add to Inspiration Button -->
                            <button 
                                class="w-full flex items-center justify-center gap-3 px-6 py-4 {isInInspiration ? (currentTheme === 'dark' ? 'bg-pink-900 text-pink-300' : 'bg-pink-100 text-pink-800') : (currentTheme === 'dark' ? 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white' : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white')} rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl {isInInspiration ? 'opacity-75 cursor-not-allowed' : ''}"
                                on:click={handleAddToInspiration}
                                disabled={isInInspiration}
                            >
                                <svg class="w-5 h-5" fill={isInInspiration ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                                <span>{isInInspiration ? 'อยู่ในแรงบันดาลใจแล้ว' : 'เพิ่มเป็นแรงบันดาลใจ'}</span>
                            </button>
                            
                            <!-- Share Button -->
                            <button 
                                class="w-full flex items-center justify-center gap-3 px-6 py-3 {currentTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                                on:click={() => {
                                    const shareUrl = `${window.location.origin}/store/${outfit.userStore}/${outfit.id}`;
                                    navigator.clipboard.writeText(shareUrl);
                                    // Show copied message
                                    const toast = document.createElement('div');
                                    toast.className = `fixed top-20 right-4 z-50 ${currentTheme === 'dark' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'} px-4 py-2 rounded-lg shadow-lg`;
                                    toast.textContent = 'คัดลอกลิงค์แล้ว!';
                                    document.body.appendChild(toast);
                                    setTimeout(() => document.body.removeChild(toast), 2000);
                                }}
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                </svg>
                                <span>แชร์สินค้า</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}