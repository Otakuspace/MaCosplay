<script lang="ts">
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	export let data: { itemList: { items: any[]; totalPages: number; currentPage: number } };
	
	let selectedProvince = '';
	let selectedCity = '';
	let selectedSize = '';
	let selectedGender = '';
	let searchQuery = '';
	let items = data.itemList.items;
	let detailItem: any = null;
	let selectedSeries = 'Genshin Impact';
	let setBundle = false;
	let comingSoon = false;
	let weekdayRental = false;
	let sendOutsideIsland = false;
	let isDarkTheme = false;
	let sidebarOpen = false;

	const pb = new PocketBase('https://macosplay.saas.in.th');

	// Series/categories data matching the image
	const series = [
		'Genshin Impact',
		'Honkai: Star Rail',
		'Hololive',
		'Jujutsu Kaisen',
		'Demon Slayer - Kimetsu no Yaiba',
		'Zenless Zone Zero',
		'Wuthering Waves',
		'Chainsaw Man',
		'Spy x Family',
		'Mobile Legends: Bang Bang'
	];

	// Provinces data
	const provinces = [
		'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร',
		'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท',
		'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง',
		'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม',
		'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส',
		'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์',
		'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พังงา', 'พัทลุง',
		'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่',
		'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร',
		'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี',
		'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ',
		'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ', 'สมุทรสงคราม',
		'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย',
		'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู',
		'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี'
	];

	const cities = ['เลือกเมือง', 'กรุงเทพมหานคร', 'เชียงใหม่', 'ภูเก็ต', 'พัทยา', 'หาดใหญ่', 'นครราชสีมา', 'ขอนแก่น', 'อุบลราชธานี', 'สุราษฎร์ธานี']; // Popular cities
	const sizes = ['เลือกขนาด', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
	const genders = ['เลือกเพศ', 'ชาย', 'หญิง', 'ไม่ระบุ'];

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		searchQuery = params.get('search') || '';
		selectedProvince = params.get('province') || '';
		selectedCity = params.get('city') || '';
		selectedSize = params.get('size') || '';
		selectedGender = params.get('gender') || '';
		selectedSeries = params.get('series') || 'Genshin Impact';
		
		// Check current theme
		checkTheme();
		
		// Liszten for theme changes
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		
		return () => observer.disconnect();
	});

	function checkTheme() {
		const currentTheme = document.documentElement.getAttribute('data-theme');
		isDarkTheme = currentTheme === 'dark';
	}

	function toggleTheme() {
		const newTheme = isDarkTheme ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
		isDarkTheme = newTheme === 'dark';
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function handleSearch() {
		const params = new URLSearchParams(window.location.search);
		params.set('search', searchQuery);
		params.set('province', selectedProvince);
		params.set('city', selectedCity);
		params.set('size', selectedSize);
		params.set('gender', selectedGender);
		params.set('series', selectedSeries);
		params.set('page', '1');
		window.location.search = params.toString();
	}

	function resetFilters() {
		selectedProvince = '';
		selectedCity = '';
		selectedSize = '';
		selectedGender = '';
		searchQuery = '';
		selectedSeries = 'Genshin Impact';
		setBundle = false;
		comingSoon = false;
		weekdayRental = false;
		sendOutsideIsland = false;
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
			const matchesSearch =
				!searchQuery || item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.expand?.userStore?.Name.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesProvince && matchesSize && matchesSearch;
		});
	};

	// Helper function to limit text length
	const limitText = (text: string, maxLength: number) => {
		return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
	};

	function openDetailModal(item: any) {
		detailItem = item;
	}

	function navigateToStore(item: any) {
		const storeSlug = item.expand.userStore.slug;
		goto(`/store/${storeSlug}`);
	}

	function navigateToOutfitDetail(item: any) {
		const storeSlug = item.expand.userStore.slug;
		goto(`/store/${storeSlug}/${item.id}`);
	}

	// Debounce function to limit the rate of handleSearch calls
	function debounce(func: any, wait: number) {
		let timeout: any;
		return function(...args: any[]) {
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

<div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
	<!-- Mobile Header with Theme Toggle -->
	<div class="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
		<div class="flex items-center justify-between">
			<button
				on:click={toggleSidebar}
				class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
				</svg>
			</button>
			
			<h1 class="text-xl font-bold text-gray-900 dark:text-white">ค้นหาชุดเช่า</h1>
			
			<button
				on:click={toggleTheme}
				class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
			>
				{#if isDarkTheme}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
					</svg>
				{:else}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- Main Layout Container -->
	<div class="flex">
		<!-- Left Sidebar -->
		<aside class="fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-800 min-h-screen p-6 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out {sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}">
			<!-- Desktop Header -->
			<div class="hidden lg:block mb-8">
				<div class="flex items-center justify-between mb-4">
					<h1 class="text-2xl font-bold text-gray-900 dark:text-white">ค้นหาชุดเช่า</h1>
					<button
						on:click={toggleTheme}
						class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
					>
						{#if isDarkTheme}
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
							</svg>
						{:else}
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
							</svg>
						{/if}
					</button>
				</div>
				
			</div>

			<!-- Series Section -->
			<div class="mb-8">
				<h2 class="text-blue-600 dark:text-blue-400 font-bold text-lg mb-4">ซีรีส์</h2>
				<div class="space-y-2">
					{#each series as seriesItem}
						<button
							class="w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 {selectedSeries === seriesItem ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}"
							on:click={() => { selectedSeries = seriesItem; handleSearch(); sidebarOpen = false; }}
						>
							{seriesItem}
						</button>
					{/each}
				</div>
			</div>
		</aside>

		<!-- Mobile Sidebar Overlay -->
		{#if sidebarOpen}
			<div class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" on:click={toggleSidebar}></div>
		{/if}

		<!-- Main Content Area -->
		<main class="flex-1 bg-white dark:bg-gray-900">
			<!-- Top Search and Filter Bar -->
			<div class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 lg:p-6">
				<!-- Search Input -->
				<div class="mb-6">
					<div class="relative">
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="ค้นหาตัวละคร อนิเมะ หรือเกม"
							class="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<button class="absolute right-2 top-2 p-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md transition-colors duration-200">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
						</button>
					</div>
				</div>

				<!-- Filter Dropdowns -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					<div class="relative">
						<select bind:value={selectedProvince} class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10">
							<option value="">เลือกจังหวัด</option>
							{#each provinces as province}
								<option value={province}>{province}</option>
							{/each}
						</select>
						<svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</div>

					<div class="relative">
						<select bind:value={selectedCity} class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10">
							<option value="">เลือกเมือง</option>
							{#each cities.slice(1) as city}
								<option value={city}>{city}</option>
							{/each}
						</select>
						<svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</div>

					<div class="relative">
						<select bind:value={selectedSize} class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10">
							<option value="">เลือกขนาด</option>
							{#each sizes.slice(1) as size}
								<option value={size}>{size}</option>
							{/each}
						</select>
						<svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</div>

					<div class="relative">
						<select bind:value={selectedGender} class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10">
							<option value="">เลือกเพศ</option>
							{#each genders.slice(1) as gender}
								<option value={gender}>{gender}</option>
							{/each}
						</select>
						<svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</div>
				</div>

				<!-- Toggle Switches -->
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
					<label class="flex items-center space-x-3 cursor-pointer">
						<input type="checkbox" bind:checked={setBundle} class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2">
						<span class="text-gray-700 dark:text-gray-300 text-sm">เซ็ตชุด</span>
					</label>

					<label class="flex items-center space-x-3 cursor-pointer">
						<input type="checkbox" bind:checked={comingSoon} class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2">
						<span class="text-gray-700 dark:text-gray-300 text-sm">เร็วๆ นี้</span>
					</label>

					<label class="flex items-center space-x-3 cursor-pointer">
						<input type="checkbox" bind:checked={weekdayRental} class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2">
						<span class="text-gray-700 dark:text-gray-300 text-sm">เช่าวันธรรมดา</span>
					</label>

					<label class="flex items-center space-x-3 cursor-pointer">
						<input type="checkbox" bind:checked={sendOutsideIsland} class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2">
						<span class="text-gray-700 dark:text-gray-300 text-sm">ส่งนอกเกาะ</span>
					</label>
				</div>
			</div>

			<!-- Product Grid Section -->
			<div class="p-4 lg:p-6">
				<!-- Results Count -->
				<div class="mb-6">
					<p class="text-gray-600 dark:text-gray-400">พบ {filteredItems().length} รายการ</p>
				</div>

				<!-- Product Grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
					{#if filteredItems().length > 0}
						{#each filteredItems() as item}
							<div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-gray-700" on:click={() => navigateToOutfitDetail(item)}>
								<!-- Product Image -->
								<div class="relative">
									{#if item.Image}
										<img
											src={getOptimizedImageUrl(item.id, item.Image)}
											alt="{item.Name}"
											class="w-full h-48 sm:h-64 object-cover"
											loading="lazy"
										/>
									{:else}
										<img
											src="/images/Example/Macosplay.png?w=400&format=webp"
											alt="{item.Name}"
											class="w-full h-48 sm:h-64 object-cover"
											loading="lazy"
										/>
									{/if}
									
									<!-- Rating Badge -->
									<div class="absolute top-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-semibold">
										⭐ 3.5
									</div>
								</div>

								<!-- Product Info -->
								<div class="p-3 sm:p-4">
									<!-- Seller Info -->
									<div class="flex items-center space-x-2 mb-3">
										<div class="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
										<div>
											<p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{limitText(item.expand?.userStore?.Name || '', 20)}</p>
											<p class="text-xs text-gray-500 dark:text-gray-400">@{item.expand?.userStore?.Name?.toLowerCase().replace(/\s+/g, '') || 'store'}</p>
										</div>
									</div>

									<!-- Product Title -->
									<h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm sm:text-base">
										{item.Name}
									</h3>

									<!-- Price -->
									<div class="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 mb-3">
										{#if item.price == 0}
											฿{item.price_pri?.toLocaleString() || '0'}
										{:else}
											฿{item.price?.toLocaleString() || '0'}
										{/if}
										<span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">/ 3 วัน</span>
									</div>

									<!-- Tags -->
									<div class="flex flex-wrap gap-2 mb-3">
										<span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">{item.Size || 'M'}</span>
										<span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">หญิง</span>
									</div>

									<!-- Location -->
									<p class="text-xs text-gray-500 dark:text-gray-400">{item.Province || 'ไม่ระบุตำแหน่ง'}</p>
								</div>
							</div>
						{/each}
					{:else}
						<div class="col-span-full">
							<div class="text-center py-12 lg:py-16">
								<div class="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 lg:mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
									<svg class="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
									</svg>
								</div>
								<h3 class="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-2">ไม่พบสินค้า</h3>
								<p class="text-gray-600 dark:text-gray-400 mb-4 lg:mb-6 text-sm lg:text-base">ลองเปลี่ยนเงื่อนไขการค้นหาหรือรีเซ็ตตัวกรอง</p>
								<button class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 lg:px-6 py-2 lg:py-3 rounded-lg transition-colors duration-200 text-sm lg:text-base" on:click={resetFilters}>
									รีเซ็ตตัวกรอง
								</button>
							</div>
						</div>
					{/if}
				</div>

				<!-- Pagination -->
				{#if data.itemList.totalPages > 1}
					<div class="mt-8 lg:mt-12 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
						<button
							class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
							on:click={() => changePage(data.itemList.currentPage - 1)}
							disabled={data.itemList.currentPage === 1}
						>
							ก่อนหน้า
						</button>
						
						<span class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 text-sm lg:text-base">
							หน้า {data.itemList.currentPage} จาก {data.itemList.totalPages}
						</span>
						
						<button
							class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
							on:click={() => changePage(data.itemList.currentPage + 1)}
							disabled={data.itemList.currentPage === data.itemList.totalPages}
						>
							ถัดไป
						</button>
					</div>
				{/if}
			</div>
		</main>
	</div>
</div>

<!-- Detail Modal -->
{#if detailItem}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl mx-4 max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">รายละเอียดสินค้า</h3>
				<button 
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
					on:click={() => detailItem = null}
				>
					<svg class="w-5 h-5 lg:w-6 lg:h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<!-- Modal Content -->
			<div class="p-4 lg:p-6 overflow-y-auto max-h-[60vh]">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
					<!-- Product Image -->
					<div class="relative">
						{#if detailItem.Image}
							<img
								src={`https://file.macosplay.com/mxj3660ce5olheb/${detailItem.id}/${detailItem.Image}?w=600&format=webp&quality=85`}
								alt="{detailItem.Name}"
								class="w-full aspect-square object-cover rounded-xl"
							/>
						{:else}
							<img
								src="/images/Example/Macosplay.png?w=600&format=webp"
								alt="{detailItem.Name}"
								class="w-full aspect-square object-cover rounded-xl"
							/>
						{/if}
					</div>

					<!-- Product Details -->
					<div class="space-y-4">
						<div>
							<h4 class="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2">{detailItem.Name}</h4>
							<p class="text-gray-600 dark:text-gray-400">{detailItem.expand?.userStore?.Name || ''}</p>
						</div>

						<div class="flex flex-wrap gap-2">
							<span class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">ขนาด {detailItem.Size}</span>
							<span class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">{detailItem.Status}</span>
						</div>

						<div class="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
							<h5 class="font-semibold text-gray-900 dark:text-white mb-2">รายละเอียด</h5>
							<p class="text-gray-600 dark:text-gray-400">{detailItem.Desc || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
						</div>

						<div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
							<h5 class="font-semibold text-gray-900 dark:text-white mb-2">ราคาเช่า</h5>
							<div class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
								{#if detailItem.price == 0}
									<div class="space-y-1">
										<div class="text-base lg:text-lg text-gray-600 dark:text-gray-400">ไพรเวท: ฿{detailItem.price_pri?.toLocaleString() || '0'}</div>
										<div class="text-base lg:text-lg text-gray-600 dark:text-gray-400">ทดสอบ: ฿{detailItem.price_test?.toLocaleString() || '0'}</div>
									</div>
								{:else}
									฿{detailItem.price?.toLocaleString() || '0'}
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
				<div class="flex flex-col sm:flex-row gap-3 justify-end">
					<button class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 lg:px-6 py-2 lg:py-3 rounded-lg transition-colors duration-200 text-sm lg:text-base" on:click={() => detailItem = null}>
						ปิด
					</button>
					<a href={`/store/${detailItem.expand?.userStore?.slug}`} target="_blank">
						<button class="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg transition-colors duration-200 text-sm lg:text-base">
							ไปที่ร้านค้า
						</button>
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Custom scrollbar for the sidebar */
	:global(aside::-webkit-scrollbar) {
		width: 6px;
	}

	:global(aside::-webkit-scrollbar-track) {
		background: #f3f4f6;
	}

	:global(.dark aside::-webkit-scrollbar-track) {
		background: #374151;
	}

	:global(aside::-webkit-scrollbar-thumb) {
		background: #d1d5db;
		border-radius: 3px;
	}

	:global(.dark aside::-webkit-scrollbar-thumb) {
		background: #6b7280;
	}

	:global(aside::-webkit-scrollbar-thumb:hover) {
		background: #9ca3af;
	}

	:global(.dark aside::-webkit-scrollbar-thumb:hover) {
		background: #9ca3af;
	}
</style>