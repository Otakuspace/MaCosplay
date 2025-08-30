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
    let fbPageUrl = ''; // Variable to hold the Facebook page URL
    let editImageFile = null;
    let itemToDelete = null; // Track the item to be deleted
    let showDeleteConfirm = false; // Control the visibility of the delete confirmation modal

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
        event.preventDefault();
        const formData = new FormData(event.target);

        // Append the image file if it exists
        if (editImageFile) {
            console.log('Appending image file to FormData:', editImageFile); // Log the file being appended
            formData.append('image', editImageFile);
        } else {
            console.log('No image file to append'); // Log if no file is present
        }

        // Log all form data entries
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        // Set isPriTest based on pricingOption
        formData.append('isPriTest', pricingOption);

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
                console.log('Item updated successfully'); // Log success
                location.reload();
            } else {
                const errorData = await response.json();
                console.error('Error response from server:', errorData); // Log server error
                throw new Error(errorData.error || 'Failed to update item');
            }

            editingItem = null;
        } catch (error) {
            console.error('Error updating item:', error);
            errorMessage = error.message;
            showAlert = true;
        }
    }

    async function handleBannerUpload(event) {
        console.log('Banner upload triggered');
        const formData = new FormData();
        formData.append('banner', event.target.files[0]); // Append the file to formData
        formData.append('shopId', data.StoreDetails.id); // Append the shop ID to formData
        formData.append('fbPage', data.StoreDetails.fbPage); // Append the fbPage to formData

        try {
            const response = await fetch('/api/update-shop', {
                method: 'PUT',
                body: formData
            });
            if (response.ok) {
                location.reload();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update banner');
            }
        } catch (error) {
            console.error('Error updating banner:', error);
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
    export let data: { StoreDetails: any[], itemList: any[] }; // Define data type

    let selectedProvince = ''; // State to hold the selected province
    let selectedSize = ''; // State to hold the selected size
    let selectedStatus = '';

    // Function to filter items based on search and selected filters
    const filteredItems = () => {
        return data.itemList.filter(item => {
            const matchesSearch = item.Name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesProvince = !selectedProvince || item.Province === selectedProvince;
            const matchesSize = !selectedSize || item.Size === selectedSize;
            const matchesStatus = !selectedStatus || item.Status === selectedStatus;
            return matchesSearch && matchesProvince && matchesSize && matchesStatus;
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
    let detailItem = null;

    function previewImage(event, type) {
        const file = event.target.files[0];
        if (file) {
            console.log('Image file selected:', file); // Log the selected file
            const reader = new FileReader();
            reader.onload = (e) => {
                if (type === 'create') {
                    createImagePreview = e.target.result;
                } else {
                    editImagePreview = e.target.result;
                    editImageFile = file; // Store the file for later use
                }
            };
            reader.readAsDataURL(file);
        } else {
            if (type === 'create') {
                createImagePreview = '';
            } else {
                editImagePreview = '';
                editImageFile = null;
            }
        }
    }

    $: console.log('Current pricingOption:', pricingOption);

    function shareToFacebook(item) {
        const imageUrl = `https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`;
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
        window.open(shareUrl, '_blank');
    }

    function openDetailModal(item) {
		detailItem = item;
	}

    async function updateFbPage() {
        try {
            const formData = new FormData();
            formData.append('fbPage', fbPageUrl); // Append the Facebook page URL
            formData.append('shopId', data.StoreDetails.id); // Append the shop ID

            const response = await fetch('/api/update-shop', {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                // Optionally, update the local data to reflect the change
                data.StoreDetails.fbPage = fbPageUrl;
                console.log('Facebook page updated successfully');
                location.reload(); // Refresh the page
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update Facebook page');
            }
        } catch (error) {
            console.error('Error updating Facebook page:', error);
            errorMessage = error.message;
            showAlert = true;
        }
    }

    function confirmDeleteItem(itemId) {
        itemToDelete = itemId;
        showDeleteConfirm = true;
    }

    async function handleDeleteItem() {
        if (!itemToDelete) return;

        try {
            const formData = new FormData();
            formData.append('id', itemToDelete);

            const response = await fetch('/api/delete-item', {
                method: 'DELETE',
                body: formData
            });

            if (response.ok) {
                console.log('Item deleted successfully');
                location.reload(); // Reload the page or update the UI to reflect the deletion
            } else {
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                throw new Error(errorData.error || 'Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            errorMessage = error.message;
            showAlert = true;
        } finally {
            showDeleteConfirm = false;
            itemToDelete = null;
        }
    }
</script>

	


<!-- Hero Section with Store Banner -->
<section class="hero-gradient min-h-[60vh] relative overflow-hidden">
	<div class="absolute inset-0 bg-black opacity-20"></div>
	<div class="container mx-auto px-6 py-12 relative z-10">
		<!-- Store Banner -->
		<div class="relative mb-8">
			<div class="aspect-video w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-large">
				<img 
					src={data?.StoreDetails.banner 
						? `https://file.macosplay.com/nrxs44dis9q1tgb/${data.StoreDetails.id}/${data.StoreDetails.banner}` 
						: '/images/Example/Cosshop.png'} 
					alt="Store Banner" 
					class="w-full h-full object-cover"
				>
			</div>
			
			<!-- Banner Upload Overlay -->
			<div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 rounded-3xl flex items-center justify-center opacity-0 hover:opacity-100">
				<div class="text-center text-white">
					<svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
					</svg>
					<p class="font-semibold">เปลี่ยนรูปภาพหน้าร้าน</p>
				</div>
			</div>
		</div>

		<!-- File Input -->
		<div class="text-center mb-8">
			<input type="file" class="file-input file-input-bordered file-input-primary max-w-xs" on:change={handleBannerUpload} />
		</div>

		<!-- Store Information -->
		<div class="text-center text-white mb-8">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">{data?.StoreDetails.Name}</h1>
			<p class="text-xl opacity-90 max-w-2xl mx-auto">{data?.StoreDetails.Details}</p>
		</div>

		<!-- Store Links -->
		<div class="max-w-2xl mx-auto space-y-6">
			<!-- Store URL -->
			<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
				<h3 class="text-white font-semibold mb-3 flex items-center">
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
					</svg>
					ลิงค์ร้านค้า
				</h3>
				<a href={`https://macosplay.com/store/${data?.StoreDetails.slug}`} 
				   class="text-blue-200 hover:text-blue-100 transition-colors duration-200 break-all">
					{`https://macosplay.com/store/${data?.StoreDetails.slug}`}
				</a>
			</div>

			<!-- Facebook Page -->
			<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
				<h3 class="text-white font-semibold mb-3 flex items-center">
					<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
						<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
					</svg>
					ลิงค์เพจ Facebook
				</h3>
				{#if data?.StoreDetails.fbPage}
					<a href={data?.StoreDetails.fbPage} 
					   class="text-blue-200 hover:text-blue-100 transition-colors duration-200 block mb-3 break-all">
						{data?.StoreDetails.fbPage}
					</a>
				{/if}
				<div class="flex gap-3">
					<input 
						type="url" 
						name="fbProfile" 
						bind:value={fbPageUrl} 
						class="input input-bordered bg-white/20 border-white/30 text-white placeholder-white/60 flex-1" 
						placeholder={data?.StoreDetails.fbPage || "กรอกลิงค์เพจ Facebook"}
					/>
					<button class="btn btn-primary" on:click={updateFbPage}>อัพเดท</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Floating elements for visual interest -->
	<div class="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
	<div class="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
	<div class="absolute top-1/2 left-1/4 w-16 h-16 bg-white/15 rounded-full blur-lg animate-pulse delay-500"></div>
</section>


<!-- Enhanced Stats Section -->
<section class="py-16 bg-gray-50">
    <div class="container mx-auto px-6">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">สถิติร้านค้า</h2>
            <p class="text-gray-600">ภาพรวมประสิทธิภาพร้านค้าของคุณ</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Visitors Card -->
            <div class="bg-white rounded-3xl p-8 shadow-large hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="flex items-center justify-between mb-6">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold text-gray-800">0</div>
                        <div class="text-sm text-gray-500">ผู้ชมร้านค้า</div>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">เดือนนี้</span>
                    <span class="text-sm text-gray-400">0% เปลี่ยนแปลง</span>
                </div>
            </div>

            <!-- Followers Card -->
            <div class="bg-white rounded-3xl p-8 shadow-large hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="flex items-center justify-between mb-6">
                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-2xl">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold text-gray-800">0</div>
                        <div class="text-sm text-gray-500">ผู้ติดตามร้านค้า</div>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">เดือนนี้</span>
                    <span class="text-sm text-green-500 flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7"></path>
                        </svg>
                        0% เพิ่มขึ้น
                    </span>
                </div>
            </div>

            <!-- Orders Card -->
            <div class="bg-white rounded-3xl p-8 shadow-large hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="flex items-center justify-between mb-6">
                    <div class="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold text-gray-800">0</div>
                        <div class="text-sm text-gray-500">จำนวนผู้ซื้อสินค้า</div>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">เดือนนี้</span>
                    <span class="text-sm text-gray-400">0 คำสั่งซื้อ</span>
                </div>
            </div>
        </div>
    </div>
</section>



<!-- Product Management Section -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">จัดการสินค้า</h2>
            <p class="text-gray-600 mb-8">เพิ่ม แก้ไข และจัดการสินค้าในร้านของคุณ</p>
            <button class="btn-modern bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-large" 
                    on:click={() => my_modal_5.showModal()}>
                <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                เพิ่มสินค้าใหม่
            </button>
        </div>
        
        <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <div class="login-card rounded-lg p-8">
                <div class="container mx-auto p-6">
                    <article class="prose">
                        <h1>เพิ่มสินค้า</h1>
                    </article>
                    <form class="mt-6" on:submit|preventDefault={createInstance} enctype="multipart/form-data">
                        <!-- Product Name -->
                        <div class="mb-4">
                            <label for="name" class="mb-2 block text-sm font-bold">ชื่อสินค้า</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                class="input input-bordered w-full"
                                required
                            />
                        </div>

                        <!-- Product Details -->
                        <div class="mb-4">
                            <label for="details" class="mb-2 block text-sm font-bold">รายละเอียดสินค้า</label>
                            <input
                                type="text"
                                id="details"
                                name="details"
                                class="input input-bordered w-full"
                                required
                            />
                        </div>

                        <!-- Clothing Size -->
                        <div class="mb-4">
                            <label for="size" class="mb-2 block text-sm font-bold">ขนาดเสื้อผ้า</label>
                            <select
                                id="size"
                                name="size"
                                class="input input-bordered w-full"
                                required
                            >
                                <option value="">เลือกขนาด</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                        </div>

                        <!-- Tags -->
                        <div class="mb-4">
                            <label for="tags" class="mb-2 block text-sm font-bold">แท็ก (คั่นด้วยเครื่องหมายจุลภาค)</label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                class="input input-bordered w-full"
                                placeholder="เช่น: cosplay, genshin, anime"
                            />
                        </div>

                        <!-- Province -->
                        <div class="mb-4">
                            <label for="province" class="mb-2 block text-sm font-bold">จังหวัด</label>
                            <select
                                id="province"
                                name="province"
                                class="input input-bordered w-full"
                                required
                            >
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


                        <!-- Status -->
                        <div class="mb-4">
                            <label for="status" class="mb-2 block text-sm font-bold">สถานะ</label>
                            <select
                                id="status"
                                name="status"
                                class="input input-bordered w-full"
                                required
                            >
                                <option value="">เลือกสถานะ</option>
                                <option value="พร้อมให้เช่า">พร้อมให้เช่า</option>
                                <option value="กำลังถูกเช่า">กำลังถูกเช่า</option>
                                <option value="ยังไม่พร้อม">ยังไม่พร้อม</option>
                            </select>
                        </div>

                        <!-- Image -->
                        <div class="mb-4">
                            <label for="image" class="mb-2 block text-sm font-bold">รูปภาพ</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                class="file-input file-input-bordered w-full"
                                on:change={(e) => previewImage(e, 'create')}
                            />
                            {#if createImagePreview}
                                <div class="mt-4">
                                    <img src={createImagePreview} alt="ตัวอย่างรูปที่กำลังสร้าง" class="w-48 h-48 object-cover rounded-lg" />
                                </div>
                            {/if}
                        </div>

                        <!-- Pricing Option Selection -->
                        <div class="mb-4">
                            <label class="mb-2 block text-sm font-bold">เลือกตัวเลือกการตั้งราคา</label>
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
                        <div class="mb-4">
                            <label for="price" class="mb-2 block text-sm font-bold">ราคา</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                class="input input-bordered w-full"
                                required
                            />
                        </div>
                        {/if}

                        <!-- Price Pri and Price Test -->
                        {#if pricingOption === 'price_pri_test'}
                        <div class="mb-4">
                            <label for="price_pri" class="mb-2 block text-sm font-bold">ราคาไพร</label>
                            <input
                                type="number"
                                id="price_pri"
                                name="price_pri"
                                class="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div class="mb-4">
                            <label for="price_test" class="mb-2 block text-sm font-bold">ราคาเทส</label>
                            <input
                                type="number"
                                id="price_test"
                                name="price_test"
                                class="input input-bordered w-full"
                                required
                            />
                        </div>
                        {/if}

                        <!-- Public Switch -->
                        <div class="mb-4">
                            <label class="mb-2 block text-sm font-bold">เปิดให้ผู้อื่นมองเห็นสินค้า</label>
                            <input
                                type="checkbox"
                                name="isPublic"
                                class="toggle"
                                bind:checked={isPublic}
                            />
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-primary">เพิ่มสินค้า</button>
                    </form>
                </div>
            </div>
        </div>
        </dialog>
    
        <!-- Search and Filter Section -->
        <div class="bg-gray-50 rounded-3xl p-8 mb-12">
            <div class="flex flex-wrap gap-4 items-center justify-between">
                <!-- Search Input -->
                <div class="relative flex-1 min-w-[300px]">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input 
                        type="text" 
                        placeholder="ค้นหาสินค้า..." 
                        bind:value={searchQuery} 
                        class="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                    />
                </div>

                <!-- Province Filter -->
                <select bind:value={selectedProvince} class="select-modern min-w-[200px] px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200">
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

                <!-- Size Filter -->
                <select bind:value={selectedSize} class="select-modern min-w-[150px] px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200">
                    <option value="">เลือกขนาด</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                </select>

                <!-- Status Filter -->
                <select bind:value={selectedStatus} class="select-modern min-w-[180px] px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200">
                    <option value="">เลือกสถานะ</option>
                    <option value="พร้อมให้เช่า">พร้อมให้เช่า</option>
                    <option value="กำลังถูกเช่า">กำลังถูกเช่า</option>
                    <option value="อยู่ระหว่างการซ่อมบำรุง">อยู่ระหว่างการซ่อมบำรุง</option>
                </select>
            </div>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#if filteredItems().length > 0}
                {#each filteredItems() as item}
                    <!-- Modern Product Card -->
                    <div class="bg-white rounded-3xl overflow-hidden shadow-large hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <!-- Product Image -->
                        <div class="relative">
                            <div class="aspect-square overflow-hidden">
                                <img 
                                    src={`https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`} 
                                    alt="{item.Name} Thumbnail" 
                                    class="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-110" 
                                    on:click={() => fullImage = `https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`}
                                />
                            </div>
                            
                            <!-- Status Badge -->
                            <div class="absolute top-4 right-4">
                                <div class="px-3 py-1 rounded-full text-xs font-semibold {item.Status === 'พร้อมให้เช่า' ? 'bg-green-100 text-green-700' : item.Status === 'กำลังถูกเช่า' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}">
                                    {item.Status}
                                </div>
                            </div>

                            <!-- Public/Private Indicator -->
                            {#if item.public}
                                <div class="absolute top-4 left-4">
                                    <div class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                        เปิดเผย
                                    </div>
                                </div>
                            {:else}
                                <div class="absolute top-4 left-4">
                                    <div class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                                        </svg>
                                        ส่วนตัว
                                    </div>
                                </div>
                            {/if}
                        </div>

                        <!-- Card Content -->
                        <div class="p-6">
                            <!-- Product Title -->
                            <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{item.Name}</h3>
                            
                            <!-- Product Details -->
                            <p class="text-gray-600 mb-4 line-clamp-2">{item.Details}</p>

                            <!-- Tags -->
                            <div class="flex flex-wrap gap-2 mb-4">
                                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{item.Province}</span>
                                <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Size: {item.Size}</span>
                            </div>

                            <!-- Price -->
                            <div class="mb-6">
                                <div class="text-2xl font-bold text-gray-800">
                                    {#if item.isPriTest}
                                        <div class="flex flex-col gap-1">
                                            <span class="text-lg">ไพร: ฿{item.price_pri.toLocaleString()}</span>
                                            <span class="text-lg">เทส: ฿{item.price_test.toLocaleString()}</span>
                                        </div>
                                    {:else}
                                        ฿{item.price.toLocaleString()}
                                    {/if}
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="space-y-3">
                                <div class="grid grid-cols-2 gap-3">
                                    <button class="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm font-semibold" 
                                            on:click={() => openEditModal(item)}>
                                        แก้ไข
                                    </button>
                                    <button class="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 text-sm font-semibold" 
                                            on:click={() => confirmDeleteItem(item.id)}>
                                        ลบ
                                    </button>
                                </div>
                                
                                <!-- Facebook Share Button -->
                                <button class="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold flex items-center justify-center" 
                                        on:click={() => shareToFacebook(item)}>
                                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
                                    </svg>
                                    แชร์ไปยัง Facebook
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            {:else}
                <!-- Empty State -->
                <div class="col-span-full text-center py-16">
                    <div class="bg-gray-50 rounded-3xl p-12">
                        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                        <h3 class="text-xl font-semibold text-gray-700 mb-2">ยังไม่มีสินค้าในร้าน</h3>
                        <p class="text-gray-500 mb-6">เริ่มต้นโดยการเพิ่มสินค้าแรกของคุณ</p>
                        <button class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 font-semibold" 
                                on:click={() => my_modal_5.showModal()}>
                            เพิ่มสินค้าแรก
                        </button>
                    </div>
                </div>
            {/if}
        </div>

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

                <!-- Tags -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">แท็ก (คั่นด้วยเครื่องหมายจุลภาค)</span>
                    </label>
                    <input
                        type="text"
                        name="tags"
                        bind:value={editingItem.tags ? editingItem.tags.join(', ') : ''}
                        class="input input-bordered w-full"
                        placeholder="เช่น: cosplay, genshin, anime"
                    />
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

    </div>
</section>

<style>
    .file-input {
        margin-top: 1rem;
    }
    .search-filter-container {
        margin-bottom: 1rem;
    }
    .item-card {
        border: 1px solid #ccc;
        padding: 1rem;
        margin-bottom: 1rem;
    }
    .btn-facebook {
        background-color: #3b5998; /* Facebook blue */
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
        background-color: #2d4373; /* Darker blue on hover */
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

{#if showDeleteConfirm}
    <div class="modal modal-open">
        <div class="modal-box">
            <h3 class="font-bold text-lg">ยืนยันการลบสินค้า</h3>
            <p>คุณแน่ใจหรือว่าต้องการลบสินค้านี้?</p>
            <div class="modal-action">
                <button class="btn" on:click={() => { showDeleteConfirm = false; itemToDelete = null; }}>ยกเลิก</button>
                <button class="btn btn-error" on:click={handleDeleteItem}>ยืนยัน</button>
            </div>
        </div>
    </div>
{/if}