<script lang="ts">
    import { goto } from '$app/navigation'; // Updated import path
	let username = ''; // Variable to hold the username
	let Name = ''; // Variable to hold the Name
	let Details = ''; // Variable to hold the Details
	let version = ''; // Variable to hold the version
	let errorMessage = ''; // Variable to hold the error message
	let showAlert = false; // Variable to control alert visibility
	let clothingSize = ''; // New variable for clothing size
	let selectedRegion = ''; // Variable to hold the selected province
	let searchQuery = ''; // Variable to hold the search input
    let editingItem = null;
    let fullImage = null;
    let pricingOption = 'price_only'; // Initialize with a default value
    let isPublic = true; // Default value for the public switch
    let detailItem = null;

    function openEditModal(item) {
        editingItem = { ...item }; // Create a copy of the item
        editImagePreview = ''; // Reset preview when opening modal
        isPublic = item.public; // Set the public status for editing
        console.log('Edit modal opened, public status:', editingItem.public); // Debugging: Check initial state
    }

    function handleCheckboxChange() {
        console.log('Checkbox changed, new public status:', editingItem.public); // Debugging: Track changes
    }

    async function handleEditSubmit(event) {
        const formData = new FormData(event.target);
        console.log('Before submit:', editingItem.public); // Debugging: Check value before submission

        // Set isPriTest based on pricingOption
        formData.append('isPriTest', pricingOption);
        console.log('pricingOption:', pricingOption); // Debugging: Log the pricingOption value
        // Add price_pri and price_test if pricingOption is 'price_pri_test'
        if (pricingOption === 'price_pri_test') {
            formData.append('price_pri', event.target.price_pri.value);
            formData.append('price_test', event.target.price_test.value);
        }

        try {
            const response = await fetch('/api/update-item', {
                method: 'PUT',
                body: formData
            });
            if (response.ok) {
				location.reload();
			} else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update item');
            }


            editingItem = null;
            // Optionally refresh the item list
        } catch (error) {
            console.error('Error updating item:', error);
            errorMessage = error.message;
            showAlert = true;
        }
    }
	const provinces = [
		"กรุงเทพมหานคร",
		"เชียงใหม่",
		"ภูเก็ต",
		"ชลบุรี",
		"นครราชสีมา",
		"พระนครศรีอยุธยา",
		"เชียงราย",
		"ขอนแก่น",
		"สงขลา",
		"นครปฐม",
		"อุดรธานี",
		// Add more provinces as needed
	];

	async function createInstance(event) {
		const formData = new FormData(event.target);

        formData.append('userStore', data.StoreDetails.id);

        // Set isPriTest based on pricingOption
        formData.append('isPriTest', pricingOption === 'price_pri_test');
        console.log('pricingOption:', pricingOption); // Debugging: Log the pricingOption value

        // Add price_pri and price_test if pricingOption is 'price_pri_test'
        if (pricingOption === 'price_pri_test') {
            formData.append('price_pri', event.target.price_pri.value);
            formData.append('price_test', event.target.price_test.value);
        }

		try {
			const response = await fetch('/api/create-item', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				location.reload();
			} else {
				const errorData = await response.json();
				errorMessage = errorData.error;
				showAlert = true;
			}
		} catch (error) {
			console.error('Error creating instance:', error);
			errorMessage = error.message;
			showAlert = true;
		}
	}
    export let data: {
        StoreDetails: any[];
        itemList: {
            items: any[];
            totalPages: number;
            currentPage: number;
        };
    };
    let items = data.itemList.items;
    let selectedProvince = ''; // State to hold the selected province
    let selectedSize = ''; // State to hold the selected size
    let selectedStatus = '';

    // Function to filter items based on the selected province, size, status, and search query
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
    
    console.log(data?.StoreDetails);

    // Helper function to limit text length
    const limitText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };
    console.log(data?.StoreDetails)

    let createImagePreview = '';
    let editImagePreview = '';

    function previewImage(event, type) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (type === 'create') {
                    createImagePreview = e.target.result;
                } else {
                    editImagePreview = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        } else {
            if (type === 'create') {
                createImagePreview = '';
            } else {
                editImagePreview = '';
            }
        }
    }

    $: console.log('Current pricingOption:', pricingOption);

    function openDetailModal(item) {
        detailItem = item;
    }

    
</script>

	


<!-- Modern Store Header -->
<section class="relative">
	<!-- Store Banner -->
	<div class="relative h-64 md:h-80 overflow-hidden">
		<img 
			src={`https://file.macosplay.com/nrxs44dis9q1tgb/${data?.StoreDetails.id}/${data?.StoreDetails.banner}`}  
			alt="{data?.StoreDetails.Name} Banner" 
			class="w-full h-full object-cover"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
	</div>

	<!-- Store Info Card -->
	<div class="relative -mt-20 mx-4 md:mx-8">
		<div class="bg-white rounded-3xl shadow-large p-8 border border-gray-100">
			<div class="flex flex-col md:flex-row items-center md:items-start gap-6">
				<!-- Store Avatar -->
				<div class="relative">
					<div class="w-24 h-24 rounded-2xl overflow-hidden shadow-medium border-4 border-white">
						{#if data?.StoreDetails.expand?.user}
							<img
								src={`https://file.macosplay.com/_pb_users_auth_/${data?.StoreDetails.expand?.user?.id}/${data?.StoreDetails.expand?.user?.avatar}`}
								alt="{data?.StoreDetails?.expand?.user?.name} Avatar"
								class="w-full h-full object-cover"
							/>
						{:else}
							<img
								src="/images/Example/Macosplay.png"
								alt="Store Avatar"
								class="w-full h-full object-cover"
							/>
						{/if}
					</div>
					<div class="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
				</div>

				<!-- Store Details -->
				<div class="flex-1 text-center md:text-left">
					<h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
						{data?.StoreDetails.Name}
					</h1>
					<p class="text-gray-600 mb-4 leading-relaxed">
						{data?.StoreDetails.Details}
					</p>
					
					<div class="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
						<div class="flex items-center text-sm text-gray-500">
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
							</svg>
							โดย {data?.StoreDetails?.expand?.user?.name || 'ผู้ขาย'}
						</div>
						
						<div class="flex items-center text-sm text-gray-500">
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
							</svg>
							{data?.StoreDetails.slug}
						</div>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex flex-col gap-3 min-w-[200px]">
					<a href={data?.StoreDetails.fbPage} target="_blank" class="w-full">
						<button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
								<path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
							</svg>
							เพจร้านค้า
						</button>
					</a>
					
					<a href={data?.StoreDetails.expand?.user?.fbProfile} target="_blank" class="w-full">
						<button class="w-full btn-secondary-modern flex items-center justify-center">
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
							</svg>
							ติดต่อผู้ขาย
						</button>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- 
<section id="stats" class="flex w-full items-center justify-center">
    <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="stat-title">ผู้ชมร้านค้า</div>
          <div class="stat-value">0</div>
          <div class="stat-desc">Jan 1st - Feb 1st</div>
        </div>
      
        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
          </div>
          <div class="stat-title">ผู้ติดตามร้านค้า</div>
          <div class="stat-value">0</div>
          <div class="stat-desc">↗︎ 400 (22%)</div>
        </div>
      
        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
            </svg>
          </div>
          <div class="stat-title">จำนวนผู้ซื้อสินค้า</div>
          <div class="stat-value">0</div>
          <div class="stat-desc">0</div>
        </div>
      </div>

</section> -->





<section id="features" class="pt-12 sm:pt-12 md:pt-14">
    <div class="container mx-auto p-4 sm:p-6">
        <section class="mb-6">
            <h2 class="mb-2 text-2xl font-semibold">จัดการสินค้า</h2>
        </section>
        <!-- Modern Filter Section -->
        <div class="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">กรองสินค้า</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="relative">
                    <input 
                        type="text" 
                        placeholder="ค้นหาสินค้า..." 
                        bind:value={searchQuery} 
                        class="input-modern w-full"
                    />
                    <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>

                <select bind:value={selectedProvince} class="select-modern">
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
                <!-- Add more provinces as needed -->
            </select>

                <select bind:value={selectedSize} class="select-modern">
                    <option value="">เลือกขนาด</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                </select>

                <select bind:value={selectedStatus} class="select-modern">
                    <option value="">สถานะ</option>
                    <option value="พร้อมให้เช่า">พร้อมให้เช่า</option>
                    <option value="กำลังถูกเช่า">กำลังถูกเช่า</option>
                    <option value="ยังไม่พร้อม">ยังไม่พร้อม</option>
                </select>
            </div>
        </div>

        <!-- Modern Product Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {#if filteredItems().length > 0}
                {#each filteredItems() as item}
                    <div class="product-card card-hover group animate-scale-in">
                        <div class="relative overflow-hidden">
                            <button
                                class="block w-full"
                                on:click={() => fullImage = `https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`}
                                aria-label="View full size image of {item.Name}"
                            >
                                <img 
                                    src={`https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}?w=400&format=avif&quality=70`} 
                                    alt="{item.Name}" 
                                    class="product-image" 
                                    loading="lazy"
                                />
                            </button>
                            
                            <!-- Status overlay -->
                            <div class="absolute top-4 left-4">
                                <span class="badge-modern {item.Status === 'พร้อมให้เช่า' ? 'badge-available' : item.Status === 'กำลังถูกเช่า' ? 'badge-rented' : 'badge-unavailable'}">
                                    {item.Status}
                                </span>
                            </div>

                            <!-- Size and Province badges -->
                            <div class="absolute top-4 right-4 flex flex-col gap-2">
                                <span class="badge-modern badge-size">
                                    {item.Size}
                                </span>
                                <span class="badge-modern bg-blue-100 text-blue-800">
                                    {item.Province}
                                </span>
                            </div>
                        </div>

                        <div class="p-6">
                            <h3 class="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                                {item.Name}
                            </h3>
                            
                            {#if item.Details}
                                <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {item.Details}
                                </p>
                            {/if}

                            <div class="flex items-center justify-between mb-4">
                                <div class="text-xl font-bold text-gray-900">
                                    {#if item.isPriTest}
                                        <div class="flex flex-col">
                                            <span class="text-sm text-gray-500">ไพรเวท/ทดสอบ</span>
                                            <span>฿{item.price_pri.toLocaleString()} / ฿{item.price_test.toLocaleString()}</span>
                                        </div>
                                    {:else}
                                        ฿{item.price.toLocaleString()}
                                    {/if}
                                </div>
                            </div>

                            <div class="flex gap-2">
                                <button 
                                    class="flex-1 btn-primary-modern text-sm group-hover:shadow-xl"
                                    on:click={() => openDetailModal(item)}
                                >
                                    ดูรายละเอียด
                                </button>
                                <a href={data.StoreDetails.fbPage} target="_blank" class="flex-1">
                                    <button class="w-full btn-secondary-modern text-sm">
                                        ติดต่อ
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                {/each}
            {:else}
                <div class="col-span-full">
                    <div class="text-center py-16">
                        <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                            </svg>
                        </div>
                        <h3 class="text-2xl font-semibold text-gray-900 mb-2">ไม่มีสินค้า</h3>
                        <p class="text-gray-600">ร้านค้านี้ยังไม่มีสินค้าให้เช่าในขณะนี้</p>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</section>

<!-- Edit Modal -->
{#if editingItem}
    <div class="modal modal-open">
        <div class="modal-box">
            <h3 class="font-bold text-lg">แก้ไขรายการ</h3>
            <form on:submit|preventDefault={handleEditSubmit} enctype="multipart/form-data">
                <input type="hidden" name="id" bind:value={editingItem.id} />
                <!-- Public Switch -->
                <div class="form-control mb-4">
                    <label class="label" for="isPublic">
                        <span class="label-text">เปิดให้ผู้อื่นมองเห็นสินค้า</span>
                    </label>
                    <input
                        type="checkbox"
                        id="isPublic"
                        name="isPublic"
                        class="toggle"
                        bind:checked={editingItem.public}
                        on:change={handleCheckboxChange}
                    />
                </div>
                <!-- Name -->
                <div class="form-control mb-4">
                    <label class="label" for="name">
                        <span class="label-text">ชื่อสินค้า</span>
                    </label>
                    <input type="text" id="name" name="name" bind:value={editingItem.Name} class="input input-bordered" required />
                </div>

                <!-- Details -->
                <div class="form-control mb-4">
                    <label class="label" for="details">
                        <span class="label-text">รายละเอียดสินค้า</span>
                    </label>
                    <textarea 
                        id="details"
                        name="details" 
                        bind:value={editingItem.Desc} 
                        class="textarea textarea-bordered" 
                        rows="6"
                    ></textarea>
                </div>

                <!-- Size -->
                <div class="form-control mb-4">
                    <label class="label" for="size">
                        <span class="label-text">ขนาดเสื้อผ้า</span>
                    </label>
                    <select id="size" name="size" bind:value={editingItem.Size} class="select select-bordered w-full" required>
                        <option value="">เลือกขนาด</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                </div>

                <!-- Province -->
                <div class="form-control mb-4">
                    <label class="label" for="province">
                        <span class="label-text">จังหวัด</span>
                    </label>
                    <select id="province" name="province" bind:value={editingItem.Province} class="select select-bordered w-full" required>
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

                <!-- Pricing Option Selection -->
                <div class="form-control mb-4">
                    <fieldset>
                        <legend class="label-text">เลือกตัวเลือกการตั้งราคา</legend>
                    <div class="flex items-center space-x-4">
                        <label class="flex items-center">
                            <input
                                type="radio"
                                name="pricing_option"
                                value="price_only"
                                bind:group={pricingOption}
                                class="radio radio-primary"
                            />
                            <span class="ml-2">ใช้ราคาเท่านั้น</span>
                        </label>
                        <label class="flex items-center">
                            <input
                                type="radio"
                                name="pricing_option"
                                value="price_pri_test"
                                bind:group={pricingOption}
                                class="radio radio-primary"
                            />
                            <span class="ml-2">ใช้ราคาไพร และ เทส</span>
                        </label>
                    </fieldset>
                </div>

                <!-- Price -->
                {#if pricingOption === 'price_only'}
                <div class="form-control mb-4">
                    <label class="label" for="price">
                        <span class="label-text">ราคา</span>
                    </label>
                    <input type="number" id="price" name="price" bind:value={editingItem.price} class="input input-bordered" required />
                </div>
                {/if}

                <!-- Price Pri and Price Test -->
                {#if pricingOption === 'price_pri_test'}
                <div class="form-control mb-4">
                    <label class="label" for="price_pri">
                        <span class="label-text">ราคาไพร</span>
                    </label>
                    <input type="number" id="price_pri" name="price_pri" bind:value={editingItem.price_pri} class="input input-bordered" required />
                </div>

                <div class="form-control mb-4">
                    <label class="label" for="price_test">
                        <span class="label-text">ราคาเทส</span>
                    </label>
                    <input type="number" id="price_test" name="price_test" bind:value={editingItem.price_test} class="input input-bordered" required />
                </div>
                {/if}

                <!-- Status -->
                <div class="form-control mb-4">
                    <label class="label" for="status-select">
                        <span class="label-text">สถานะ</span>
                    </label>
                    <select id="status-select" name="status" bind:value={editingItem.Status} class="select select-bordered w-full" required>
                        <option value="">เลือกสถานะ</option>
                        <option value="พร้อมให้เช่า">พร้อมให้เช่า</option>
                        <option value="กำลังถูกเช่า">กำลังถูกเช่า</option>
                        <option value="ยังไม่พร้อม">ยังไม่พร้อม</option>
                    </select>
                </div>

                <!-- Image -->
                <div class="form-control mb-4">
                    <label class="label" for="image-upload">
                        <span class="label-text">รูปภาพ</span>
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        name="image"
                        accept="image/*"
                        class="file-input file-input-bordered w-full"
                        on:change={(e) => previewImage(e, 'edit')}
                    />
                    <div class="mt-4">
                        {#if editImagePreview}
                            <img src={editImagePreview} alt="ตัวอย่างรูปที่กำลังแก้ไข" class="w-48 h-48 object-cover rounded-lg" />
                        {:else if editingItem.Image}
                            <img src={`https://file.macosplay.com/mxj3660ce5olheb/${editingItem.id}/${editingItem.Image}`} 
                                 alt="รูปปัจจุบันของสินค้า" 
                                 class="w-48 h-48 object-cover rounded-lg" />
                        {/if}
                    </div>
                </div>

                

                <div class="modal-action">
                    <button type="button" class="btn" on:click={() => editingItem = null}>ยกเลิก</button>
                    <button type="submit" class="btn btn-primary">บันทึก</button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Full Image Modal -->
{#if fullImage}
    <div class="modal modal-open">
        <div class="modal-box">
            <div class="modal-action">
                <button class="btn" on:click={() => fullImage = null}>X ปิดภาพ</button>
            </div>
            <img src={fullImage} alt="ภาพขยายแบบเต็ม" class="w-full h-auto object-cover" />
            
        </div>
    </div>
{/if}


<!-- Modern Detail Modal -->
{#if detailItem}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
		<div class="bg-white rounded-3xl shadow-large max-w-4xl mx-4 max-h-[90vh] overflow-hidden animate-scale-in">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-100">
				<h3 class="text-2xl font-bold text-gray-900">รายละเอียดสินค้า</h3>
				<button 
					class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
					on:click={() => detailItem = null}
					aria-label="ปิดรายละเอียดสินค้า"
				>
					<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<!-- Modal Content -->
			<div class="p-6 overflow-y-auto max-h-[70vh]">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<!-- Product Image -->
					<div class="relative">
						{#if detailItem.Image}
							<img
								src={`https://file.macosplay.com/mxj3660ce5olheb/${detailItem.id}/${detailItem.Image}?w=800&format=webp&quality=90`}
								alt="{detailItem.Name}"
								class="w-full aspect-square object-cover rounded-2xl shadow-medium"
							/>
						{:else}
							<img
								src="/images/Example/Macosplay.png?w=800&format=webp"
								alt="{detailItem.Name}"
								class="w-full aspect-square object-cover rounded-2xl shadow-medium"
							/>
						{/if}
						
						<!-- Status Badge -->
						<div class="absolute top-4 left-4">
							<span class="badge-modern {detailItem.Status === 'พร้อมให้เช่า' ? 'badge-available' : detailItem.Status === 'กำลังถูกเช่า' ? 'badge-rented' : 'badge-unavailable'}">
								{detailItem.Status}
							</span>
						</div>
					</div>

					<!-- Product Details -->
					<div class="space-y-6">
						<div>
							<h4 class="text-3xl font-bold text-gray-900 mb-3">{detailItem.Name}</h4>
							<div class="flex items-center gap-2 mb-4">
								<span class="badge-modern badge-size">ขนาด {detailItem.Size}</span>
								<span class="badge-modern bg-blue-100 text-blue-800">{detailItem.Province}</span>
							</div>
						</div>

						<div class="bg-gray-50 rounded-2xl p-6">
							<h5 class="font-semibold text-gray-900 mb-3 flex items-center">
								<svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
								</svg>
								รายละเอียด
							</h5>
							<p class="text-gray-700 whitespace-pre-wrap leading-relaxed">
								{detailItem.Desc || 'ไม่มีรายละเอียดเพิ่มเติม'}
							</p>
						</div>

						<div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
							<h5 class="font-semibold text-gray-900 mb-3 flex items-center">
								<svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
								</svg>
								ราคาเช่า
							</h5>
							<div class="text-3xl font-bold text-gray-900">
								{#if detailItem.isPriTest}
									<div class="space-y-2">
										<div class="flex items-center justify-between">
											<span class="text-lg text-gray-600">ไพรเวท:</span>
											<span>฿{detailItem.price_pri.toLocaleString()}</span>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-lg text-gray-600">ทดสอบ:</span>
											<span>฿{detailItem.price_test.toLocaleString()}</span>
										</div>
									</div>
								{:else}
									฿{detailItem.price.toLocaleString()}
								{/if}
							</div>
						</div>

						<!-- Contact Information -->
						<div class="bg-white border border-gray-200 rounded-2xl p-6">
							<h5 class="font-semibold text-gray-900 mb-3 flex items-center">
								<svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
								</svg>
								ข้อมูลร้านค้า
							</h5>
							<p class="text-gray-700 mb-4">{data?.StoreDetails?.Name}</p>
							<div class="flex gap-3">
								<a href={data?.StoreDetails?.fbPage} target="_blank" class="flex-1">
									<button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center">
										<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
											<path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
										</svg>
										เพจร้านค้า
									</button>
								</a>
								<a href={data?.StoreDetails?.expand?.user?.fbProfile} target="_blank" class="flex-1">
									<button class="w-full btn-secondary-modern flex items-center justify-center">
										<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
										</svg>
										ติดต่อผู้ขาย
									</button>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="p-6 border-t border-gray-100 bg-gray-50">
				<div class="flex justify-end">
					<button class="btn-secondary-modern" on:click={() => detailItem = null}>
						ปิด
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
    .file-input {
        margin-top: 1rem;
    }


    .w-6 {
        width: 24px;
        height: 24px;
    }

    .mr-2 {
        margin-right: 8px;
    }

	.modal .modal-box {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.18);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}
</style>