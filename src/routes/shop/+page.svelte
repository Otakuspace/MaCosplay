<script lang="ts">
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
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

<section id="filter" class="pt-12 sm:pt-12 md:pt-14">
	<div class="container mx-auto flex flex-col gap-4 p-4 sm:flex-row sm:p-6">
		<label class="input input-bordered flex w-full items-center gap-2 sm:w-auto">
			<input type="text" class="grow" placeholder="ค้นหา" bind:value={searchQuery} />
		</label>

		<!-- ตัวกรองจังหวัดใหม่ -->
		<label class="input input-bordered flex w-full items-center gap-2 sm:w-auto">
			<select class="grow" bind:value={selectedProvince}>
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
		</label>

		<!-- ตัวกรองขนาดใหม่ -->
		<label class="input input-bordered flex w-full items-center gap-2 sm:w-auto">
			<select class="grow" bind:value={selectedSize}>
				<option value="">เลือกขนาด</option>
				<option value="S">S</option>
				<option value="M">M</option>
				<option value="L">L</option>
				<option value="XL">XL</option>
				<option value="XXL">XXL</option>
				<!-- เพิ่มขนาดเพิ่มเติมตามต้องการ -->
			</select>
		</label>
		<label class="input input-bordered flex w-full items-center gap-2 sm:w-auto">
			<select class="grow" bind:value={selectedStatus}>
				<option value="">เลือกสถานะ</option>
				<option value="พร้อมให้เช่า">พร้อมให้เช่า</option>
				<option value="กำลังถูกเช่า">กำลังถูกเช่า</option>
				<option value="ยังไม่พร้อม">ยังไม่พร้อม</option>
			</select>
		</label>
		<button class="btn btn-outline" on:click={debouncedHandleSearch}>ค้นหาทั้งหมด</button>
		<button class="btn btn-outline btn-primary" on:click={resetFilters}>Reset</button>
	</div>
</section>

<section id="features" class="pt-12 sm:pt-12 md:pt-14">
	<div class="container mx-auto p-4 sm:p-6">
		<!-- Pocketbase Rental Card -->
		<section class="mb-6">
			<h2 class="mb-2 text-2xl font-semibold">ตามหาชุด/วิกเช่าได้ที่นี่เลย</h2>
		</section>
		<div class="grid max-h-[48rem] grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-2 lg:grid-cols-5">
			<!-- Limit to 4 rows -->
			{#if filteredItems().length > 0}
				{#each filteredItems() as item}
					<div class="card bg-base-100 shadow-xl border border-gray-200">
						<figure class="p-2">
							{#if item.Image}
							<img
								src={getOptimizedImageUrl(item.id, item.Image)}
								alt="{item.Name} Thumbnail"
								class="w-full h-full object-cover aspect-square cursor-pointer"
								loading="lazy"
								on:click={() => fullImage = `https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`}
							/>
							{:else}
							<img
								src="/images/Example/Macosplay.png?w=400&format=webp"
								alt="{item.Name} Thumbnail"
								class="w-full h-full object-cover aspect-square cursor-pointer"
								loading="lazy"
							/>
							{/if}
						</figure>
						<div class="card-body p-2 flex flex-col justify-between">
							<div>
								<p class="text-xs font-bold">{limitText(item.Name, 33)}</p>
								<p class="text-xs text-gray-500">{limitText(item.expand?.userStore?.Name || '', 20)}</p>
								<div class="flex flex-wrap gap-1 mt-1">
									<div class="badge text-xs bg-gray-200">{item.Size}</div>
									
									<div class="badge text-xs bg-blue-200">{item.Status}</div>
								</div>
							</div>
							<div class="flex justify-between items-center mt-2">
								<p class="text-lg font-bold">
									{item.price == 0 ? `฿${item.price_pri.toLocaleString()} / ${item.price_test.toLocaleString()}` : `฿${item.price.toLocaleString()}`}

								</p>
								<button class="btn btn-neutral btn-active" on:click={() => openDetailModal(item)}>
									ดูเพิ่มเติม
								</button>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="card w-full bg-base-100 shadow-xl sm:w-96">
					<div class="card-body">
						<h2 class="card-title">ไม่เจอร้านค้า</h2>
						<p>ไม่พบข้อมูลชุดเช่าในขณะนี้</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<div class="join">
	<button
		class="btn join-item"
		on:click={() => changePage(data.itemList.currentPage - 1)}
		disabled={data.itemList.currentPage === 1}>«</button
	>
	<span class="btn join-item">Page {data.itemList.currentPage} of {data.itemList.totalPages}</span>
	<button
		class="btn join-item"
		on:click={() => changePage(data.itemList.currentPage + 1)}
		disabled={data.itemList.currentPage === data.itemList.totalPages}>»</button
	>
</div>

<!-- Full Image Modal -->
{#if fullImage}
	<div class="modal modal-open">
		<div class="modal-box">
			<div class="modal-action mb-3">
				<button class="btn" on:click={() => (fullImage = null)}>X ปิด</button>
			</div>
			<img 
				src={`${fullImage}?w=800&format=webp&quality=85`} 
				alt="Full Image" 
				class="h-auto w-full object-cover" 
			/>
		</div>
	</div>
{/if}

<!-- Detail Modal -->
{#if detailItem}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">รายละเอียดสินค้า</h3>
			<p style="white-space: pre-wrap;">{detailItem.Desc}</p>
			<div class="modal-action">
				<button class="btn" on:click={() => detailItem = null}>ปิด</button>
				<a href={`/store/${detailItem.expand?.userStore?.slug}`} target="_blank">
				<button class="btn btn-outline btn-neutral">ไปที่ร้านค้า</button>
			</a>
			</div>
		</div>
	</div>

{/if}

<style>
	.btn-facebook {
        background-color: #3b5998;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .btn-facebook:hover {
        background-color: #2d4373;
    }

    .btn-facebook:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 89, 152, 0.5);
    }


	.join {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }
	
	/* Glassmorphism enhancements for /shop */
	#filter .container {
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 16px;
	}
	#features .card {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.18);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
	}
	#features .card:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
		border-color: rgba(255, 255, 255, 0.35);
	}
	#features .card figure {
		overflow: hidden;
		border-radius: 0.75rem;
	}
	#features .card figure img {
		transition: transform .3s ease;
	}
	#features .card:hover figure img {
		transform: scale(1.02);
	}
	#features .badge {
		font-size: 10px;
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		padding: 2px 8px;
	}
	.modal .modal-box {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.18);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}
	#filter .btn.btn-outline {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.2);
	}
	
	
</style>