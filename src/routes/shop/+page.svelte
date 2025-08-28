<script lang="ts">
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	export let data: { itemList: { items: any[]; totalPages: number; currentPage: number } };
	let selectedProvince = '';
	let selectedSize = '';
	let selectedStatus = '';
	let fullImage = null;
	let searchQuery = '';
	let items = data.itemList.items;
	let detailItem = null;

	const pb = new PocketBase('https://macosplay.saas.in.th');

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		searchQuery = params.get('search') || '';
		selectedStatus = params.get('status') || '';
		selectedProvince = params.get('province') || '';
		selectedSize = params.get('size') || '';
	});

	function handleSearch() {
		const params = new URLSearchParams(window.location.search);
		params.set('search', searchQuery);
		params.set('status', selectedStatus);
		params.set('province', selectedProvince);
		params.set('size', selectedSize);
		params.set('page', '1');
		window.location.search = params.toString();
	}

	function resetFilters() {
		selectedProvince = '';
		selectedSize = '';
		selectedStatus = '';
		searchQuery = '';
		handleSearch();
	}

	function changePage(newPage: number) {
		const params = new URLSearchParams(window.location.search);
		params.set('page', newPage.toString());
		window.location.search = params.toString();
	}

	const filteredItems = () => {
		return items.filter((item) => {
			const matchesProvince = !selectedProvince || item.Province === selectedProvince;
			const matchesSize = !selectedSize || item.Size === selectedSize;
			const matchesStatus = !selectedStatus || item.Status === selectedStatus;
			const matchesSearch =
				!searchQuery || item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.expand?.userStore?.Name.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesProvince && matchesSize && matchesStatus && matchesSearch;
		});
	};

	console.log(data?.itemList);

	// Helper function to limit text length
	const limitText = (text: string, maxLength: number) => {
		return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
	};

	function openDetailModal(item) {
		detailItem = item;
	}

	function navigateToStore(item) {
        const storeSlug = item.expand.userStore.slug;
        goto(`/store/${storeSlug}`);
    }

	// Debounce function to limit the rate of handleSearch calls
	function debounce(func, wait) {
		let timeout;
		return function(...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	// Create a debounced version of handleSearch
	const debouncedHandleSearch = debounce(handleSearch, 300);

	// Add type for the image URL function
	function getOptimizedImageUrl(itemId: string, imageName: string): string {
		return `https://file.macosplay.com/mxj3660ce5olheb/${itemId}/${imageName}?w=400&format=avif&quality=60`;
	}
</script>

<!-- Hero Section -->
<section class="hero-gradient min-h-[60vh] flex items-center justify-center relative overflow-hidden">
	<div class="absolute inset-0 bg-black opacity-20"></div>
	<div class="container mx-auto px-6 relative z-10 text-center text-white">
		<h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
			ค้นหาชุดเช่า
		</h1>
		<p class="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up">
			เช่าชุดคอสเพลย์คุณภาพสูงจากร้านค้าชั้นนำทั่วประเทศ
		</p>
		<div class="max-w-2xl mx-auto mb-8">
			<div class="relative">
				<input 
					type="text" 
					class="w-full px-6 py-4 rounded-2xl text-gray-800 text-lg placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-large"
					placeholder="ค้นหาชุดที่คุณต้องการ..."
					bind:value={searchQuery}
				/>
				<button 
					class="absolute right-2 top-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
					on:click={debouncedHandleSearch}
				>
					ค้นหา
				</button>
			</div>
		</div>
	</div>
	
	<!-- Floating elements for visual interest -->
	<div class="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
	<div class="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
	<div class="absolute top-1/2 left-1/4 w-16 h-16 bg-white/15 rounded-full blur-lg animate-pulse delay-500"></div>
</section>

<!-- Enhanced Filter Section -->
<section class="bg-white shadow-soft border-b border-gray-100 sticky top-16 z-40">
	<div class="container mx-auto px-4 md:px-6 py-4 md:py-6">
		<div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
			<div class="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 flex-1 w-full md:w-auto">
				<div class="relative w-full sm:w-auto">
					<select class="select-modern w-full sm:min-w-[180px] md:min-w-[200px]" bind:value={selectedProvince}>
						<option value="">เลือกจังหวัด</option>
						<option value="กระบี่">กระบี่</option>
							<option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
							<option value="กาญจนบุรี">กาญจนบุรี</option>
							<option value="กาฬสินธุ์">กาฬสินธุ์</option>
							<option value="กำแพงเพชร">กำแพงเพชร</option>
							<option value="ขอนแก่น">ขอนแก่น</option>
							<option value="จันทบุรี">จันทบุรี</option>
							<option value="ฉะเชิงเทรา">ฉะเชิงเทรา</option>
							<option value="ชลบุรี">ชลบุรี</option>
							<option value="ชัยนาท">ชัยนาท</option>
							<option value="ชัยภูมิ">ชัยภูมิ</option>
							<option value="ชุมพร">ชุมพร</option>
							<option value="เชียงราย">เชียงราย</option>
							<option value="เชียงใหม่">เชียงใหม่</option>
							<option value="ตรัง">ตรัง</option>
							<option value="ตราด">ตราด</option>
							<option value="ตาก">ตาก</option>
							<option value="นครนายก">นครนายก</option>
							<option value="นครปฐม">นครปฐม</option>
							<option value="นครพนม">นครพนม</option>
							<option value="นครราชสีมา">นครราชสีมา</option>
							<option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
							<option value="นครสวรรค์">นครสวรรค์</option>
							<option value="นนทบุรี">นนทบุรี</option>
							<option value="นราธิวาส">นราธิวาส</option>
							<option value="น่าน">น่าน</option>
							<option value="บึงกาฬ">บึงกาฬ</option>
							<option value="บุรีรัมย์">บุรีรัมย์</option>
							<option value="ปทุมธานี">ปทุมธานี</option>
							<option value="ประจวบคีรีขันธ์">ประจวบคีรีขันธ์</option>
							<option value="ปราจีนบุรี">ปราจีนบุรี</option>
							<option value="ปัตตานี">ปัตตานี</option>
							<option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
							<option value="พังงา">พังงา</option>
							<option value="พัทลุง">พัทลุง</option>
							<option value="พิจิตร">พิจิตร</option>
							<option value="พิษณุโลก">พิษณุโลก</option>
							<option value="เพชรบุรี">เพชรบุรี</option>
							<option value="เพชรบูรณ์">เพชรบูรณ์</option>
							<option value="แพร่">แพร่</option>
							<option value="ภูเก็ต">ภูเก็ต</option>
							<option value="มหาสารคาม">มหาสารคาม</option>
							<option value="มุกดาหาร">มุกดาหาร</option>
							<option value="แม่ฮ่องสอน">แม่ฮ่องสอน</option>
							<option value="ยโสธร">ยโสธร</option>
							<option value="ยะลา">ยะลา</option>
							<option value="ร้อยเอ็ด">ร้อยเอ็ด</option>
							<option value="ระนอง">ระนอง</option>
							<option value="ระยอง">ระยอง</option>
							<option value="ราชบุรี">ราชบุรี</option>
							<option value="ลพบุรี">ลพบุรี</option>
							<option value="ลำปาง">ลำปาง</option>
							<option value="ลำพูน">ลำพูน</option>
							<option value="เลย">เลย</option>
							<option value="ศรีสะเกษ">ศรีสะเกษ</option>
							<option value="สกลนคร">สกลนคร</option>
							<option value="สงขลา">สงขลา</option>
							<option value="สตูล">สตูล</option>
							<option value="สมุทรปราการ">สมุทรปราการ</option>
							<option value="สมุทรสงคราม">สมุทรสงคราม</option>
							<option value="สมุทรสาคร">สมุทรสาคร</option>
							<option value="สระแก้ว">สระแก้ว</option>
							<option value="สระบุรี">สระบุรี</option>
							<option value="สิงห์บุรี">สิงห์บุรี</option>
							<option value="สุโขทัย">สุโขทัย</option>
							<option value="สุพรรณบุรี">สุพรรณบุรี</option>
							<option value="สุราษฎร์ธานี">สุราษฎร์ธานี</option>
							<option value="สุรินทร์">สุรินทร์</option>
							<option value="หนองคาย">หนองคาย</option>
							<option value="หนองบัวลำภู">หนองบัวลำภู</option>
							<option value="อ่างทอง">อ่างทอง</option>
							<option value="อำนาจเจริญ">อำนาจเจริญ</option>
							<option value="อุดรธานี">อุดรธานี</option>
							<option value="อุตรดิตถ์">อุตรดิตถ์</option>
							<option value="อุทัยธานี">อุทัยธานี</option>
							<option value="อุบลราชธานี">อุบลราชธานี</option>
					</select>
				</div>

				<div class="relative w-full sm:w-auto">
					<select class="select-modern w-full sm:min-w-[120px] md:min-w-[150px]" bind:value={selectedSize}>
						<option value="">เลือกขนาด</option>
						<option value="S">S</option>
						<option value="M">M</option>
						<option value="L">L</option>
						<option value="XL">XL</option>
						<option value="XXL">XXL</option>
					</select>
				</div>

				<div class="relative w-full sm:w-auto">
					<select class="select-modern w-full sm:min-w-[150px] md:min-w-[180px]" bind:value={selectedStatus}>
						<option value="">เลือกสถานะ</option>
						<option value="พร้อมให้เช่า">พร้อมให้เช่า</option>
						<option value="กำลังถูกเช่า">กำลังถูกเช่า</option>
						<option value="ยังไม่พร้อม">ยังไม่พร้อม</option>
					</select>
				</div>
			</div>

			<div class="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
				<button class="btn-secondary-modern" on:click={resetFilters}>
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
					</svg>
					รีเซ็ต
				</button>
				<button class="btn-primary-modern" on:click={debouncedHandleSearch}>
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
					ค้นหา
				</button>
			</div>
		</div>
	</div>
</section>

<!-- Modern Product Showcase -->
<section class="py-8 md:py-16 bg-gray-50">
	<div class="container mx-auto px-4 md:px-6">
		<div class="text-center mb-8 md:mb-12">
			<h2 class="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
				ชุดเช่าคุณภาพสูง
			</h2>
			<p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
				เลือกจากคอลเลกชันชุดคอสเพลย์และวิกผมคุณภาพพรีเมียมจากร้านค้าที่ได้รับการรับรอง
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-h-none">
			{#if filteredItems().length > 0}
				{#each filteredItems() as item}
					<div class="product-card card-hover group animate-scale-in">
						<div class="relative overflow-hidden">
							{#if item.Image}
								<button
									class="block w-full"
									on:click={() => fullImage = `https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`}
									aria-label="View full size image of {item.Name}"
								>
									<img
										src={getOptimizedImageUrl(item.id, item.Image)}
										alt="{item.Name}"
										class="product-image"
										loading="lazy"
									/>
								</button>
							{:else}
								<img
									src="/images/Example/Macosplay.png?w=400&format=webp"
									alt="{item.Name}"
									class="product-image cursor-pointer"
									loading="lazy"
								/>
							{/if}
							
							<!-- Status overlay -->
							<div class="absolute top-4 left-4">
								<span class="badge-modern {item.Status === 'พร้อมให้เช่า' ? 'badge-available' : item.Status === 'กำลังถูกเช่า' ? 'badge-rented' : 'badge-unavailable'}">
									{item.Status}
								</span>
							</div>

							<!-- Size badge -->
							<div class="absolute top-4 right-4">
								<span class="badge-modern badge-size">
									{item.Size}
								</span>
							</div>
						</div>

						<div class="p-4 md:p-6">
							<h3 class="font-semibold text-base md:text-lg text-gray-900 mb-2 line-clamp-2">
								{item.Name}
							</h3>
							
							<p class="text-xs md:text-sm text-gray-500 mb-3">
								{limitText(item.expand?.userStore?.Name || '', 25)}
							</p>

							<div class="flex items-center justify-between mb-4">
								<div class="text-xl md:text-2xl font-bold text-gray-900">
									{#if item.price == 0}
										<div class="flex flex-col">
											<span class="text-base md:text-lg">฿{item.price_pri.toLocaleString()}</span>
											<span class="text-xs md:text-sm text-gray-500">/ ฿{item.price_test.toLocaleString()}</span>
										</div>
									{:else}
										฿{item.price.toLocaleString()}
									{/if}
								</div>
							</div>

							<button 
								class="w-full btn-primary-modern group-hover:shadow-xl text-sm md:text-base"
								on:click={() => openDetailModal(item)}
							>
								ดูรายละเอียด
								<svg class="w-3 h-3 md:w-4 md:h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</button>
						</div>
					</div>
				{/each}
			{:else}
				<div class="col-span-full">
					<div class="text-center py-16">
						<div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
							<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
						</div>
						<h3 class="text-2xl font-semibold text-gray-900 mb-2">ไม่พบสินค้า</h3>
						<p class="text-gray-600 mb-6">ลองเปลี่ยนเงื่อนไขการค้นหาหรือรีเซ็ตตัวกรอง</p>
						<button class="btn-secondary-modern" on:click={resetFilters}>
							รีเซ็ตตัวกรอง
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- Modern Pagination -->
<section class="py-12 bg-white">
	<div class="container mx-auto px-6">
		<div class="flex items-center justify-center space-x-4">
			<button
				class="btn-secondary-modern disabled:opacity-50 disabled:cursor-not-allowed"
				on:click={() => changePage(data.itemList.currentPage - 1)}
				disabled={data.itemList.currentPage === 1}
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
				</svg>
				ก่อนหน้า
			</button>
			
			<div class="flex items-center space-x-2">
				<span class="px-4 py-2 bg-gray-100 rounded-lg font-medium text-gray-700">
					หน้า {data.itemList.currentPage} จาก {data.itemList.totalPages}
				</span>
			</div>
			
			<button
				class="btn-secondary-modern disabled:opacity-50 disabled:cursor-not-allowed"
				on:click={() => changePage(data.itemList.currentPage + 1)}
				disabled={data.itemList.currentPage === data.itemList.totalPages}
			>
				ถัดไป
				<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
				</svg>
			</button>
		</div>
	</div>
</section>

<!-- Modern Full Image Modal -->
{#if fullImage}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
		<div class="relative max-w-4xl max-h-[90vh] mx-4">
			<button 
				class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
				on:click={() => (fullImage = null)}
				aria-label="Close full image view"
			>
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>
			<img 
				src={`${fullImage}?w=1200&format=webp&quality=90`} 
				alt="Full size product image" 
				class="w-full h-auto max-h-[90vh] object-contain rounded-2xl shadow-large animate-scale-in" 
			/>
		</div>
	</div>
{/if}

<!-- Modern Detail Modal -->
{#if detailItem}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
		<div class="bg-white rounded-3xl shadow-large max-w-2xl mx-4 max-h-[90vh] overflow-hidden animate-scale-in">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-100">
				<h3 class="text-2xl font-bold text-gray-900">รายละเอียดสินค้า</h3>
				<button 
					class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
					on:click={() => detailItem = null}
					aria-label="Close product details"
				>
					<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<!-- Modal Content -->
			<div class="p-6 overflow-y-auto max-h-[60vh]">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Product Image -->
					<div class="relative">
						{#if detailItem.Image}
							<img
								src={`https://file.macosplay.com/mxj3660ce5olheb/${detailItem.id}/${detailItem.Image}?w=600&format=webp&quality=85`}
								alt="{detailItem.Name}"
								class="w-full aspect-square object-cover rounded-2xl shadow-medium"
							/>
						{:else}
							<img
								src="/images/Example/Macosplay.png?w=600&format=webp"
								alt="{detailItem.Name}"
								class="w-full aspect-square object-cover rounded-2xl shadow-medium"
							/>
						{/if}
					</div>

					<!-- Product Details -->
					<div class="space-y-4">
						<div>
							<h4 class="text-xl font-bold text-gray-900 mb-2">{detailItem.Name}</h4>
							<p class="text-gray-600">{detailItem.expand?.userStore?.Name || ''}</p>
						</div>

						<div class="flex flex-wrap gap-2">
							<span class="badge-modern badge-size">ขนาด {detailItem.Size}</span>
							<span class="badge-modern {detailItem.Status === 'พร้อมให้เช่า' ? 'badge-available' : detailItem.Status === 'กำลังถูกเช่า' ? 'badge-rented' : 'badge-unavailable'}">
								{detailItem.Status}
							</span>
						</div>

						<div class="bg-gray-50 rounded-xl p-4">
							<h5 class="font-semibold text-gray-900 mb-2">รายละเอียด</h5>
							<p class="text-gray-700 whitespace-pre-wrap leading-relaxed">{detailItem.Desc || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
						</div>

						<div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
							<h5 class="font-semibold text-gray-900 mb-2">ราคาเช่า</h5>
							<div class="text-3xl font-bold text-gray-900">
								{#if detailItem.price == 0}
									<div class="space-y-1">
										<div class="text-lg text-gray-600">ไพรเวท: ฿{detailItem.price_pri.toLocaleString()}</div>
										<div class="text-lg text-gray-600">ทดสอบ: ฿{detailItem.price_test.toLocaleString()}</div>
									</div>
								{:else}
									฿{detailItem.price.toLocaleString()}
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="p-6 border-t border-gray-100 bg-gray-50">
				<div class="flex gap-3 justify-end">
					<button class="btn-secondary-modern" on:click={() => detailItem = null}>
						ปิด
					</button>
					<a href={`/store/${detailItem.expand?.userStore?.slug}`} target="_blank">
						<button class="btn-primary-modern">
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
							</svg>
							ไปที่ร้านค้า
						</button>
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}


<style>
	/* Additional custom styles for shop page */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Enhanced animations */
	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-10px); }
	}



	/* Staggered animation delays for product cards */
	.product-card:nth-child(1) { animation-delay: 0.1s; }
	.product-card:nth-child(2) { animation-delay: 0.2s; }
	.product-card:nth-child(3) { animation-delay: 0.3s; }
	.product-card:nth-child(4) { animation-delay: 0.4s; }
	.product-card:nth-child(5) { animation-delay: 0.5s; }
	.product-card:nth-child(6) { animation-delay: 0.6s; }
	.product-card:nth-child(7) { animation-delay: 0.7s; }
	.product-card:nth-child(8) { animation-delay: 0.8s; }
</style>