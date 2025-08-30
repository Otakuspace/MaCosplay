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
    let tagsString = ''; // String representation of tags for input binding

    // Reactive statement to sync tagsString with editingItem.tags
    $: if (editingItem && editingItem.tags) {
        tagsString = editingItem.tags.join(', ');
    } else if (editingItem) {
        tagsString = '';
    }

    // Reactive statement to sync editingItem.tags with tagsString
    $: if (editingItem && tagsString !== undefined) {
        editingItem.tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    }

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

	


<!-- Enhanced Hero Section with Store Banner -->
<section class="relative min-h-[70vh] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
	<!-- Animated Background Elements -->
	<div class="absolute inset-0">
		<div class="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute bottom-20 right-10 w-48 h-48 bg-purple-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
		<div class="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-400/25 rounded-full blur-2xl animate-pulse delay-500"></div>
		<div class="absolute bottom-1/3 left-1/2 w-16 h-16 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-700"></div>
	</div>
	
	<!-- Overlay -->
	<div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
	
	<div class="container mx-auto px-6 py-16 relative z-10">
		<!-- Store Banner with Enhanced Design -->
		<div class="relative mb-12 group">
			<div class="aspect-[16/9] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/10 transition-all duration-500 group-hover:ring-white/20">
				<img 
					src={data?.StoreDetails.banner 
						? `https://file.macosplay.com/nrxs44dis9q1tgb/${data.StoreDetails.id}/${data.StoreDetails.banner}` 
						: '/images/Example/Cosshop.png'} 
					alt="Store Banner" 
					class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
				>
			</div>
			
			<!-- Enhanced Banner Upload Overlay -->
			<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl flex items-center justify-center">
				<div class="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
					<div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
						<svg class="w-16 h-16 mx-auto mb-4 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
						</svg>
						<p class="text-xl font-bold mb-2">เปลี่ยนรูปภาพหน้าร้าน</p>
						<p class="text-sm opacity-90">คลิกเพื่ออัปโหลดภาพใหม่</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Enhanced File Input -->
		<div class="text-center mb-12">
			<label class="inline-block">
				<input type="file" class="hidden" on:change={handleBannerUpload} accept="image/*" />
				<div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-4 text-white font-semibold hover:bg-white/20 transition-all duration-300 cursor-pointer inline-flex items-center space-x-3 shadow-lg hover:shadow-xl">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
					</svg>
					<span>อัปโหลดรูปภาพใหม่</span>
				</div>
			</label>
		</div>

		<!-- Enhanced Store Information -->
		<div class="text-center text-white mb-16">
			<div class="bg-white/5 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto border border-white/10">
				<h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-2xl">
					{data?.StoreDetails.Name}
				</h1>
				<p class="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed font-light">
					{data?.StoreDetails.Details}
				</p>
			</div>
		</div>

		<!-- Enhanced Store Links -->
		<div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
			<!-- Store URL Card -->
			<div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
				<div class="flex items-center mb-6">
					<div class="bg-blue-500/20 p-4 rounded-2xl mr-4 group-hover:bg-blue-500/30 transition-colors duration-300">
						<svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
						</svg>
					</div>
					<h3 class="text-white font-bold text-xl">ลิงค์ร้านค้า</h3>
				</div>
				<a href={`https://macosplay.com/store/${data?.StoreDetails.slug}`} 
				   class="text-blue-200 hover:text-blue-100 transition-colors duration-200 break-all text-lg font-medium hover:underline">
					{`https://macosplay.com/store/${data?.StoreDetails.slug}`}
				</a>
			</div>

			<!-- Facebook Page Card -->
			<div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
				<div class="flex items-center mb-6">
					<div class="bg-blue-600/20 p-4 rounded-2xl mr-4 group-hover:bg-blue-600/30 transition-colors duration-300">
						<svg class="w-8 h-8 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
						</svg>
					</div>
					<h3 class="text-white font-bold text-xl">ลิงค์เพจ Facebook</h3>
				</div>
				{#if data?.StoreDetails.fbPage}
					<a href={data?.StoreDetails.fbPage} 
					   class="text-blue-200 hover:text-blue-100 transition-colors duration-200 block mb-6 break-all text-lg font-medium hover:underline">
						{data?.StoreDetails.fbPage}
					</a>
				{/if}
				<div class="flex gap-3">
					<input 
						type="url" 
						name="fbProfile" 
						bind:value={fbPageUrl} 
						class="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:bg-white/25 focus:border-white/50 focus:outline-none transition-all duration-200" 
						placeholder={data?.StoreDetails.fbPage || "กรอกลิงค์เพจ Facebook"}
					/>
					<button class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl" 
							on:click={updateFbPage}>
						อัพเดท
					</button>
				</div>
			</div>
		</div>
	</div>
</section>


<!-- Enhanced Stats Section -->
<section class="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-40">
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        <div class="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_70%)]"></div>
    </div>
    
    <div class="container mx-auto px-6 relative z-10">
        <div class="text-center mb-16">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
            </div>
            <h2 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                สถิติร้านค้า
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                ภาพรวมประสิทธิภาพร้านค้าของคุณพร้อมข้อมูลเชิงลึก
            </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <!-- Visitors Card -->
            <div class="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50 hover:border-blue-200/50 relative overflow-hidden">
                <!-- Background Gradient -->
                <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div class="relative z-10">
                    <div class="flex items-center justify-between mb-8">
                        <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </div>
                        <div class="text-right">
                            <div class="text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                {data?.StoreDetails.visitor || 0}
                            </div>
                            <div class="text-sm text-gray-500 font-medium">ผู้เข้าชม</div>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <h3 class="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                            ผู้เข้าชมร้าน
                        </h3>
                        <p class="text-gray-600 leading-relaxed">
                            จำนวนผู้ที่เข้าชมหน้าร้านค้าของคุณ
                        </p>
                        <div class="pt-4">
                            <div class="flex items-center text-green-600">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                                <span class="text-sm font-semibold">+12% จากเดือนที่แล้ว</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Products Card -->
            <div class="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50 hover:border-purple-200/50 relative overflow-hidden">
                <!-- Background Gradient -->
                <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div class="relative z-10">
                    <div class="flex items-center justify-between mb-8">
                        <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                        </div>
                        <div class="text-right">
                            <div class="text-3xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                                {data?.itemList?.length || 0}
                            </div>
                            <div class="text-sm text-gray-500 font-medium">สินค้า</div>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <h3 class="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                            สินค้าทั้งหมด
                        </h3>
                        <p class="text-gray-600 leading-relaxed">
                            จำนวนสินค้าที่มีในร้านค้าของคุณ
                        </p>
                        <div class="pt-4">
                            <div class="flex items-center text-blue-600">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span class="text-sm font-semibold">พร้อมขาย {data?.itemList?.filter(item => item.Status === 'พร้อมให้เช่า').length || 0} รายการ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Revenue Card -->
            <div class="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50 hover:border-green-200/50 relative overflow-hidden">
                <!-- Background Gradient -->
                <div class="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div class="relative z-10">
                    <div class="flex items-center justify-between mb-8">
                        <div class="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div class="text-right">
                            <div class="text-3xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                                ฿{(data?.itemList?.reduce((sum, item) => sum + (item.price || 0), 0) || 0).toLocaleString()}
                            </div>
                            <div class="text-sm text-gray-500 font-medium">มูลค่ารวม</div>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <h3 class="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                            มูลค่าสินค้า
                        </h3>
                        <p class="text-gray-600 leading-relaxed">
                            มูลค่ารวมของสินค้าทั้งหมดในร้าน
                        </p>
                        <div class="pt-4">
                            <div class="flex items-center text-orange-600">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                                <span class="text-sm font-semibold">ราคาเฉลี่ย ฿{Math.round((data?.itemList?.reduce((sum, item) => sum + (item.price || 0), 0) || 0) / Math.max(data?.itemList?.length || 1, 1)).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Followers Card -->
            <div class="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50 hover:border-purple-200/50 relative overflow-hidden">
                <!-- Background Gradient -->
                <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div class="relative z-10">
                    <div class="flex items-center justify-between mb-8">
                        <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </div>
                        <div class="text-right">
                            <div class="text-4xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-1">0</div>
                            <div class="text-sm text-gray-500 font-medium">ผู้ติดตามร้านค้า</div>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <h3 class="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                            ผู้ติดตาม
                        </h3>
                        <p class="text-gray-600 leading-relaxed">
                            จำนวนผู้ติดตามร้านค้าของคุณ
                        </p>
                        <div class="pt-4">
                            <div class="flex items-center text-green-600">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7"></path>
                                </svg>
                                <span class="text-sm font-semibold">0% เพิ่มขึ้น</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Orders Card -->
            <div class="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50 hover:border-green-200/50 relative overflow-hidden">
                <!-- Background Gradient -->
                <div class="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div class="relative z-10">
                    <div class="flex items-center justify-between mb-8">
                        <div class="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>
                        </div>
                        <div class="text-right">
                            <div class="text-4xl font-bold bg-gradient-to-r from-gray-800 to-green-600 bg-clip-text text-transparent mb-1">0</div>
                            <div class="text-sm text-gray-500 font-medium">จำนวนผู้ซื้อสินค้า</div>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <h3 class="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                            คำสั่งซื้อ
                        </h3>
                        <p class="text-gray-600 leading-relaxed">
                            จำนวนคำสั่งซื้อที่ได้รับ
                        </p>
                        <div class="pt-4">
                            <div class="flex items-center text-gray-400">
                                <span class="text-sm font-semibold">0 คำสั่งซื้อ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>



<!-- Enhanced Product Management Section -->
<section class="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-30">
        <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-transparent rounded-full blur-3xl"></div>
    </div>
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Enhanced Section Header -->
        <div class="text-center mb-12 sm:mb-16">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl mb-8 shadow-2xl">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
            </div>
            <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                จัดการสินค้า
            </h2>
            <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12 px-4">
                เพิ่ม แก้ไข และจัดการสินค้าในร้านของคุณด้วยเครื่องมือที่ทันสมัยและใช้งานง่าย
            </p>
            <button class="group relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 rounded-3xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden" 
                    on:click={() => my_modal_5.showModal()}>
                <!-- Button Background Animation -->
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <!-- Button Content -->
                <div class="relative flex items-center space-x-3">
                    <div class="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </div>
                    <span>เพิ่มสินค้าใหม่</span>
                </div>
                
                <!-- Shine Effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
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
    
        <!-- Enhanced Search and Filter Section -->
        <div class="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 mb-12 sm:mb-16 shadow-xl border border-white/20 relative overflow-hidden">
            <!-- Background Decoration -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full blur-2xl"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/50 to-transparent rounded-full blur-xl"></div>
            
            <!-- Filter Header -->
            <div class="text-center mb-8 relative z-10">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                    </svg>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">ค้นหาและกรองสินค้า</h3>
                <p class="text-sm sm:text-base text-gray-600 px-4">ใช้ตัวกรองเพื่อค้นหาสินค้าที่ต้องการได้อย่างรวดเร็ว</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <!-- Enhanced Search Input -->
                <div class="md:col-span-2 lg:col-span-2 relative group">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="relative">
                        <div class="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                            <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="ค้นหาสินค้า..." 
                            bind:value={searchQuery} 
                            class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400 font-medium shadow-sm hover:shadow-md"
                        />
                    </div>
                </div>

                <!-- Enhanced Province Filter -->
                <div class="relative group">
                    <div class="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="relative">
                        <select bind:value={selectedProvince} class="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:border-green-500 focus:ring-4 focus:ring-green-500/20 focus:bg-white transition-all duration-300 text-gray-700 font-medium shadow-sm hover:shadow-md appearance-none cursor-pointer">
                            <option value="">🏛️ เลือกจังหวัด</option>
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

                <!-- Enhanced Size Filter -->
                <div class="relative group">
                    <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="relative">
                        <select bind:value={selectedSize} class="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:bg-white transition-all duration-300 text-gray-700 font-medium shadow-sm hover:shadow-md appearance-none cursor-pointer">
                            <option value="">👕 เลือกขนาด</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </select>
                        <!-- Custom Dropdown Arrow -->
                        <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Status Filter -->
                <div class="relative group">
                    <div class="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="relative">
                        <select bind:value={selectedStatus} class="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:bg-white transition-all duration-300 text-gray-700 font-medium shadow-sm hover:shadow-md appearance-none cursor-pointer">
                            <option value="">⚡ เลือกสถานะ</option>
                            <option value="พร้อมให้เช่า">✅ พร้อมให้เช่า</option>
                            <option value="กำลังถูกเช่า">🔄 กำลังถูกเช่า</option>
                            <option value="อยู่ระหว่างการซ่อมบำรุง">🔧 อยู่ระหว่างการซ่อมบำรุง</option>
                        </select>
                        <!-- Custom Dropdown Arrow -->
                        <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Filter Summary -->
            <div class="mt-6 flex flex-wrap gap-2 justify-center sm:justify-start relative z-10">
                {#if searchQuery}
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        🔍 "{searchQuery}"
                        <button on:click={() => searchQuery = ''} class="ml-2 hover:text-blue-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </span>
                {/if}
                {#if selectedProvince}
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        🏛️ {selectedProvince}
                        <button on:click={() => selectedProvince = ''} class="ml-2 hover:text-green-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </span>
                {/if}
                {#if selectedSize}
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        👕 Size {selectedSize}
                        <button on:click={() => selectedSize = ''} class="ml-2 hover:text-purple-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </span>
                {/if}
                {#if selectedStatus}
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        ⚡ {selectedStatus}
                        <button on:click={() => selectedStatus = ''} class="ml-2 hover:text-orange-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </span>
                {/if}
            </div>
        </div>

        <!-- Enhanced Product Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {#if filteredItems().length > 0}
                {#each filteredItems() as item}
                    <!-- Ultra Modern Product Card -->
                    <div class="group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-gray-100/50 relative">
                        <!-- Card Glow Effect -->
                        <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div class="relative">
                            <!-- Product Image -->
                            <div class="relative overflow-hidden">
                                <div class="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                    <img 
                                        src={`https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`} 
                                        alt="{item.Name} Thumbnail" 
                                        class="w-full h-full object-cover cursor-pointer transition-all duration-700 group-hover:scale-110 group-hover:rotate-2" 
                                        on:click={() => fullImage = `https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`}
                                    />
                                </div>
                                
                                <!-- Image Overlay -->
                                <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <!-- Enhanced Status Badge -->
                                <div class="absolute top-4 right-4 z-10">
                                    <div class="px-4 py-2 rounded-2xl text-sm font-bold shadow-lg backdrop-blur-sm border border-white/20 {item.Status === 'พร้อมให้เช่า' ? 'bg-green-500/90 text-white' : item.Status === 'กำลังถูกเช่า' ? 'bg-yellow-500/90 text-white' : 'bg-red-500/90 text-white'} transform group-hover:scale-110 transition-transform duration-300">
                                        {#if item.Status === 'พร้อมให้เช่า'}
                                            ✅ พร้อม
                                        {:else if item.Status === 'กำลังถูกเช่า'}
                                            🔄 เช่าแล้ว
                                        {:else}
                                            ❌ ไม่พร้อม
                                        {/if}
                                    </div>
                                </div>

                                <!-- Enhanced Visibility Indicator -->
                                <div class="absolute top-4 left-4 z-10">
                                    {#if item.public}
                                        <div class="bg-blue-500/90 text-white px-3 py-2 rounded-2xl text-sm font-bold flex items-center shadow-lg backdrop-blur-sm border border-white/20 transform group-hover:scale-110 transition-transform duration-300">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                            สาธารณะ
                                        </div>
                                    {:else}
                                        <div class="bg-gray-500/90 text-white px-3 py-2 rounded-2xl text-sm font-bold flex items-center shadow-lg backdrop-blur-sm border border-white/20 transform group-hover:scale-110 transition-transform duration-300">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                                            </svg>
                                            ส่วนตัว
                                        </div>
                                    {/if}
                                </div>

                                <!-- Quick View Button -->
                                <div class="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    <button class="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-2xl shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200"
                                            on:click={() => fullImage = `https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`}>
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Enhanced Card Content -->
                            <div class="p-8">
                                <!-- Product Title -->
                                <h3 class="text-2xl font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                                    {item.Name}
                                </h3>
                                
                                <!-- Product Details -->
                                <p class="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                                    {item.Details}
                                </p>

                                <!-- Enhanced Tags -->
                                <div class="flex flex-wrap gap-3 mb-6">
                                    <span class="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-2xl text-sm font-semibold flex items-center">
                                        🏛️ {item.Province}
                                    </span>
                                    <span class="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-2xl text-sm font-semibold flex items-center">
                                        👕 Size {item.Size}
                                    </span>
                                </div>

                                <!-- Enhanced Price Display -->
                                <div class="mb-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
                                    <div class="text-center">
                                        {#if item.isPriTest}
                                            <div class="space-y-2">
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm font-medium text-gray-600">ไพร:</span>
                                                    <span class="text-xl font-bold text-green-600">฿{item.price_pri.toLocaleString()}</span>
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm font-medium text-gray-600">เทส:</span>
                                                    <span class="text-xl font-bold text-blue-600">฿{item.price_test.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        {:else}
                                            <div class="flex items-center justify-center space-x-2">
                                                <span class="text-sm font-medium text-gray-600">ราคา:</span>
                                                <span class="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                                    ฿{item.price.toLocaleString()}
                                                </span>
                                            </div>
                                        {/if}
                                    </div>
                                </div>

                                <!-- Enhanced Action Buttons -->
                                <div class="space-y-4">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button class="group/btn relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden" 
                                                on:click={() => openEditModal(item)}>
                                            <div class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                                            <div class="relative flex items-center justify-center">
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                                แก้ไข
                                            </div>
                                        </button>
                                        <button class="group/btn relative px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden" 
                                                on:click={() => confirmDeleteItem(item.id)}>
                                            <div class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                                            <div class="relative flex items-center justify-center">
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                ลบ
                                            </div>
                                        </button>
                                    </div>
                                    
                                    <!-- Enhanced Facebook Share Button -->
                                    <button class="group/btn relative w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden" 
                                            on:click={() => shareToFacebook(item)}>
                                        <div class="absolute inset-0 bg-white/10 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                                        <div class="relative flex items-center justify-center space-x-3">
                                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
                                            </svg>
                                            <span>แชร์ไปยัง Facebook</span>
                                            <svg class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            {:else}
                <!-- Enhanced Empty State -->
                <div class="col-span-full text-center py-20">
                    <div class="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-3xl p-16 shadow-xl border border-gray-100/50 relative overflow-hidden">
                        <!-- Background Pattern -->
                        <div class="absolute inset-0 opacity-40">
                            <div class="absolute top-0 left-0 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>
                            <div class="absolute bottom-0 right-0 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl"></div>
                        </div>
                        
                        <div class="relative z-10">
                            <!-- Animated Icon -->
                            <div class="relative mb-8">
                                <div class="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                                    <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                    </svg>
                                </div>
                                <!-- Floating Elements -->
                                <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                                <div class="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-300"></div>
                            </div>
                            
                            <h3 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-4">
                                ยังไม่มีสินค้าในร้าน
                            </h3>
                            <p class="text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                                เริ่มต้นการเดินทางในโลกของการขายออนไลน์ด้วยการเพิ่มสินค้าแรกของคุณ
                            </p>
                            
                            <!-- Enhanced CTA Button -->
                            <button class="group relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-10 py-4 rounded-3xl font-bold text-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden" 
                                    on:click={() => my_modal_5.showModal()}>
                                <!-- Button Background Animation -->
                                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <!-- Button Content -->
                                <div class="relative flex items-center space-x-3">
                                    <div class="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                        </svg>
                                    </div>
                                    <span>เพิ่มสินค้าแรก</span>
                                    <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </div>
                                
                                <!-- Shine Effect -->
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                            </button>
                            
                            <!-- Additional Tips -->
                            <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                <div class="text-center">
                                    <div class="w-12 h-12 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-3">
                                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <h4 class="font-semibold text-gray-800 mb-1">อัปโหลดรูปภาพ</h4>
                                    <p class="text-sm text-gray-600">เพิ่มรูปภาพสินค้าที่สวยงาม</p>
                                </div>
                                <div class="text-center">
                                    <div class="w-12 h-12 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center mb-3">
                                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                        </svg>
                                    </div>
                                    <h4 class="font-semibold text-gray-800 mb-1">เพิ่มรายละเอียด</h4>
                                    <p class="text-sm text-gray-600">ใส่ข้อมูลสินค้าให้ครบถ้วน</p>
                                </div>
                                <div class="text-center">
                                    <div class="w-12 h-12 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-3">
                                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <h4 class="font-semibold text-gray-800 mb-1">กำหนดราคา</h4>
                                    <p class="text-sm text-gray-600">ตั้งราคาที่เหมาะสมกับสินค้า</p>
                                </div>
                            </div>
                        </div>
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
                        bind:value={tagsString}
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
    /* Enhanced Styling for Modern Store Management */
    :global(html) {
        scroll-behavior: smooth;
    }
    
    :global(body) {
        font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    }

    /* Custom Scrollbar */
    :global(::-webkit-scrollbar) {
        width: 8px;
    }

    :global(::-webkit-scrollbar-track) {
        background: #f1f5f9;
        border-radius: 10px;
    }

    :global(::-webkit-scrollbar-thumb) {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border-radius: 10px;
    }

    :global(::-webkit-scrollbar-thumb:hover) {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
    }

    /* Enhanced Animations */
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }

    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }

    @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.5); }
    }

    .float-animation {
        animation: float 3s ease-in-out infinite;
    }

    .shimmer {
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
    }

    .glow-effect {
        animation: glow 2s ease-in-out infinite alternate;
    }

    /* Glass Morphism Effects */
    .glass {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .glass-dark {
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Enhanced Shadow Effects */
    .shadow-3xl {
        box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
    }

    .shadow-glow {
        box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
    }

    .shadow-glow-purple {
        box-shadow: 0 0 40px rgba(139, 92, 246, 0.3);
    }

    /* Text Gradient Effects */
    .text-gradient {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .text-gradient-blue {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    /* Button Hover Effects */
    .btn-modern {
        position: relative;
        overflow: hidden;
        transform-style: preserve-3d;
    }

    .btn-modern::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }

    .btn-modern:hover::before {
        left: 100%;
    }

    /* Card Hover Effects */
    .card-modern {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .card-modern:hover {
        transform: translateY(-8px) scale(1.02);
    }

    /* Loading Skeleton */
    .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    }

    /* Form Enhancements */
    .input-modern {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .input-modern:focus {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    /* Legacy styles for compatibility */
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