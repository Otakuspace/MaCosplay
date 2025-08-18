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

	


<section id="home" class="flex items-center justify-center">
	<div class="container mx-auto w-full p-4 sm:p-6 flex flex-col items-center">
        <div class="flex flex-col sm:flex-row sm:space-x-2 w-full items-center justify-center">
           
            <img src={`https://file.macosplay.com/nrxs44dis9q1tgb/${data?.StoreDetails.id}/${data?.StoreDetails.banner}`}  alt="cosshop" class="w-full h-auto object-cover">

    </div>
    <div class="avatar mb-2 flex items-center">
        <div class="h-8 w-8 overflow-hidden rounded-full mt-4">
            {#if data?.StoreDetails.expand?.user}
                <img
                    src={`https://file.macosplay.com/_pb_users_auth_/${data?.StoreDetails.expand?.user?.id}/${data?.StoreDetails.expand?.user?.avatar}`}
                    alt="Avatar"
                    class="h-full w-full object-cover"
                />

            {:else}
                <img
                    src="/images/Example/Macosplay.png"
                    alt="Fallback Avatar"
                    class="h-full w-full object-cover"
                />
            {/if}
        </div>
        <span class="ml-2">{limitText((data?.StoreDetails?.expand?.user?.name || ''), 10)}</span>
    </div>
        <h2 class="text-center mt-4 text-lg sm:text-xl">{data?.StoreDetails.Name}</h2>
        <p class="text-center text-sm sm:text-base">{data?.StoreDetails.Details}</p>
        <label class="label">
            <p class="text-center">ลิงค์ร้านค้า</p>
        </label>

        
        <a href={`https://macosplay.com/store/${data?.StoreDetails.slug}`} class="link">{`https://macosplay.com/store/${data?.StoreDetails.slug}`} </a>
        <a href={data?.StoreDetails.fbPage} class="link mt-4">
            <button type="submit" class="btn btn-facebook mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-2">
                    <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
                </svg>
                ไปที่เพจร้านค้า Facebook
            </button>

        </a>
        <a href={data?.StoreDetails.expand?.user?.fbProfile} class="link mt-4">
            <button type="submit" class="btn btn-facebook mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-2">
                    <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
                </svg>
                ติดต่อผู้ขาย
            </button>

        </a>
        
    
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
        <div class="search-filter-container flex flex-wrap gap-4 mb-4">
            <input 
                type="text" 
                placeholder="Search..." 
                bind:value={searchQuery} 
                class="input input-bordered flex-grow"
            />

            <select bind:value={selectedProvince} class="select select-bordered flex-grow">
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

            <select bind:value={selectedSize} class="select select-bordered flex-grow">
                <option value="">เลือกขนาด</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
            </select>

            <select bind:value={selectedStatus} class="select select-bordered flex-grow">
                <option value="">สถานะ</option>
                <option value="พร้อมให้เช่า">พร้อมให้เช่า</option>
                <option value="กำลังถูกเช่า">กำลังถูกเช่า</option>
                <option value="ยังไม่พร้อม">ยังไม่พร้อม</option>
            </select>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[48rem] overflow-y-auto">
            {#if filteredItems().length > 0}
                {#each filteredItems() as item}
                    <div class="card bg-base-100 shadow-xl">
                        <figure>
                            <img 
                                src={`https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`} 
                                alt="{item.Name} Thumbnail" 
                                class="w-full h-auto max-h-48 object-cover cursor-pointer" 
                                on:click={() => fullImage = `https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`}
                            />
                        </figure>
                        <div class="card-body">
                            <h2 class="card-title">{limitText(item.Name, 33)}</h2>
                            <div class="badge badge-neutral">{item.Province}</div>
                            <div class="badge badge-outline">Size: {item.Size}</div>
                            <div class="badge {item.Status === 'พร้อมให้เช่า' ? 'badge-success' : item.Status === 'กำลังถูกเช่า' ? 'badge-warning' : item.Status === 'อยู่ระหว่างการซ่อมบำรุง' ? 'badge-error' : ''} gap-2">
                                {item.Status}
                            </div>
                            <p>{item.Details}</p>
                            <p class="font-bold">
                                {#if item.isPriTest}
                                ราคา: {item.price_pri.toLocaleString()} (ไพร) / {item.price_test.toLocaleString()} (เทส) บาท
                                {:else}
                                ราคา: {item.price.toLocaleString()} บาท
                                {/if}
                            </p>
                            <div class="card-actions justify-end flex space-x-2">
                                
                             
                                <button class="w-auto btn btn-neutral btn-active" on:click={() => openDetailModal(item)}>
                                    ดูรายละเอียด
                                </button>
                                <a href={data.StoreDetails.fbPage} target="_blank" class="w-auto btn btn-neutral btn-active">
                                    <button class="w-auto btn btn-neutral btn-active">
                                        ติดต่อร้านค้า
                                    </button>
                                </a>
                               
                            </div>
                        </div>
                    </div>
                {/each}
            {:else}
                <div class="card w-full sm:w-96 bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">ไม่เจอร้านค้า</h2>
                        <p>ไม่พบข้อมูลชุดเช่าในขณะนี้</p>
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
                    <label class="label">
                        <span class="label-text">เปิดให้ผู้อื่นมองเห็นสินค้า</span>
                    </label>
                    <input
                        type="checkbox"
                        name="isPublic"
                        class="toggle"
                        bind:checked={editingItem.public}
                        on:change={handleCheckboxChange}
                    />
                </div>
                <!-- Name -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">ชื่อสินค้า</span>
                    </label>
                    <input type="text" name="name" bind:value={editingItem.Name} class="input input-bordered" required />
                </div>

                <!-- Details -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">รายละเอียดสินค้า</span>
                    </label>
                    <textarea 
                        name="details" 
                        bind:value={editingItem.Desc} 
                        class="textarea textarea-bordered" 
                        rows="6"
                    ></textarea>
                </div>

                <!-- Size -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">ขนาดเสื้อผ้า</span>
                    </label>
                    <select name="size" bind:value={editingItem.Size} class="select select-bordered w-full" required>
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
                    <label class="label">
                        <span class="label-text">จังหวัด</span>
                    </label>
                    <select name="province" bind:value={editingItem.Province} class="select select-bordered w-full" required>
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
                    <label class="label">
                        <span class="label-text">เลือกตัวเลือกการตั้งราคา</span>
                    </label>
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
                    </div>
                </div>

                <!-- Price -->
                {#if pricingOption === 'price_only'}
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">ราคา</span>
                    </label>
                    <input type="number" name="price" bind:value={editingItem.price} class="input input-bordered" required />
                </div>
                {/if}

                <!-- Price Pri and Price Test -->
                {#if pricingOption === 'price_pri_test'}
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">ราคาไพร</span>
                    </label>
                    <input type="number" name="price_pri" bind:value={editingItem.price_pri} class="input input-bordered" required />
                </div>

                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">ราคาเทส</span>
                    </label>
                    <input type="number" name="price_test" bind:value={editingItem.price_test} class="input input-bordered" required />
                </div>
                {/if}

                <!-- Status -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">สถานะ</span>
                    </label>
                    <select name="status" bind:value={editingItem.Status} class="select select-bordered w-full" required>
                        <option value="">เลือกสถานะ</option>
                        <option value="พร้อมให้เช่า">พร้อมให้เช่า</option>
                        <option value="กำลังถูกเช่า">กำลังถูกเช่า</option>
                        <option value="ยังไม่พร้อม">ยังไม่พร้อม</option>
                    </select>
                </div>

                <!-- Image -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">รูปภาพ</span>
                    </label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        class="file-input file-input-bordered w-full"
                        on:change={(e) => previewImage(e, 'edit')}
                    />
                    <div class="mt-4">
                        {#if editImagePreview}
                            <img src={editImagePreview} alt="Image Preview" class="w-48 h-48 object-cover rounded-lg" />
                        {:else if editingItem.Image}
                            <img src={`https://file.macosplay.com/mxj3660ce5olheb/${editingItem.id}/${editingItem.Image}`} 
                                 alt="Current Image" 
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
            <img src={fullImage} alt="Full Image" class="w-full h-auto object-cover" />
            
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
			</div>
		</div>
	</div>
{/if}

<style>
    .file-input {
        margin-top: 1rem;
    }
    .search-filter-container {
        margin-bottom: 1rem;
    }
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

    .w-6 {
        width: 24px;
        height: 24px;
    }

    .mr-2 {
        margin-right: 8px;
    }
</style>

/* Glassmorphism enhancements */
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
</style>