<script lang="ts">
	import '../app.css';
	import "tailwindcss/tailwind.css";
	import { onMount } from 'svelte';
	import { SIDEBAR } from './data/sidebar'; // Adjust the import path as necessary

	let { children, data } = $props();

	// Function to save theme preference
	function saveThemePreference(theme: string) {
		if (typeof window !== 'undefined') {
			localStorage.setItem('theme', theme);
		}
	}

	// Function to load theme preference
	function loadThemePreference() {
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem('theme');
			if (savedTheme) {
				document.documentElement.setAttribute('data-theme', savedTheme);
			}
		}
	}

	// Call loadThemePreference on component mount
	if (typeof window !== 'undefined') {
		loadThemePreference();
	}

	onMount(() => {
		// Register service worker for image caching and offline support
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js')
				.then((registration) => {
					console.log('Service Worker registered successfully:', registration);
				})
				.catch((error) => {
					console.error('Service Worker registration failed:', error);
				});
		}
	});

	function toggleTheme(event: Event) {
		const isChecked = (event.target as HTMLInputElement).checked;
		const theme = isChecked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		saveThemePreference(theme);
	}

	let profileName = '';
	let profileAvatar = null;
	let profileSize = '';
	let fbProfileUrl = '';
	let profileImagePreview = '';
	let errorMessage = '';
	let showAlert = false;

	let editingItem = null;
	let editImagePreview = '';

	let currentName = data?.user?.name;
	let currentFbProfile = data?.user?.fbProfile;
	
	// Parse existing body details or set defaults
	let bodyMeasurements = {
		height: '',
		weight: '',
		chest: '',
		waist: '',
		hips: '',
		shoulders: '',
		neck: '',
		bicep: '',
		thigh: '',
		inseam: ''
	};
	
	// Initialize from existing data
	if (data?.user?.bodyDetails) {
		const existing = data.user.bodyDetails;
		bodyMeasurements = {
			height: existing.height || '',
			weight: existing.weight || '',
			chest: existing.chest || '',
			waist: existing.waist || '',
			hips: existing.hips || '',
			shoulders: existing.shoulders || '',
			neck: existing.neck || '',
			bicep: existing.bicep || '',
			thigh: existing.thigh || '',
			inseam: existing.inseam || ''
		};
	}



	function previewProfileImage(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				profileImagePreview = e.target.result;
			};
			reader.readAsDataURL(file);
		} else {
			profileImagePreview = '';
		}
	}

	function validateMeasurements() {
		const errors = [];
		
		// Check if height and weight are reasonable if provided
		if (bodyMeasurements.height && (bodyMeasurements.height < 100 || bodyMeasurements.height > 250)) {
			errors.push('ส่วนสูงควรอยู่ระหว่าง 100-250 ซม.');
		}
		
		if (bodyMeasurements.weight && (bodyMeasurements.weight < 30 || bodyMeasurements.weight > 200)) {
			errors.push('น้ำหนักควรอยู่ระหว่าง 30-200 กก.');
		}
		
		// Check if waist is smaller than chest and hips (if all are provided)
		if (bodyMeasurements.chest && bodyMeasurements.waist && bodyMeasurements.hips) {
			if (parseFloat(bodyMeasurements.waist) > parseFloat(bodyMeasurements.chest)) {
				errors.push('รอบเอวควรน้อยกว่ารอบอก');
			}
			if (parseFloat(bodyMeasurements.waist) > parseFloat(bodyMeasurements.hips)) {
				errors.push('รอบเอวควรน้อยกว่ารอบสะโพก');
			}
		}
		
		return errors;
	}

	async function handleProfileSubmit(event) {
		event.preventDefault();
		
		// Validate measurements
		const validationErrors = validateMeasurements();
		if (validationErrors.length > 0) {
			errorMessage = validationErrors.join(' ');
			showAlert = true;
			return;
		}
		
		const formData = new FormData(event.target);
		
		// Filter out empty measurements and convert to JSON string
		const filteredMeasurements = {};
		Object.keys(bodyMeasurements).forEach(key => {
			if (bodyMeasurements[key] && bodyMeasurements[key].toString().trim() !== '') {
				filteredMeasurements[key] = bodyMeasurements[key];
			}
		});
		
		const bodyDetailsJson = JSON.stringify(filteredMeasurements);
		formData.set('bodyDetails', bodyDetailsJson);
		
		try {
			const response = await fetch('/api/update-profile', {
				method: 'PUT',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to update profile');
			}

			console.log('Profile updated successfully');
			showAlert = false;
			document.getElementById('profile_modal').close();
			// Refresh the page to show updated data
			window.location.reload();
		} catch (error) {
			console.error('Error updating profile:', error);
			errorMessage = error.message;
			showAlert = true;
		}
	}

	function previewImage(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				editImagePreview = e.target.result;
			};
			reader.readAsDataURL(file);
		} else {
			editImagePreview = '';
		}
	}

	async function handleEditSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		try {
			const response = await fetch('/api/update-item', {
				method: 'PUT',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to update item');
			}

			editingItem = null;
			document.getElementById('edit_modal').close();
		} catch (error) {
			console.error('Error updating item:', error);
		}
	}
</script>

<!-- Profile Modal -->
<dialog id="profile_modal" class="modal modal-bottom sm:modal-middle">
	{#if data.user}
	<div class="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<div class="flex items-center mb-6">
			<div class="avatar mr-4">
				<div class="w-12 h-12 rounded-full">
					{#if data.user.avatar}
						<img src={`${data.user.avatar}`} alt="Profile" />
					{:else}
						<div class="bg-primary text-primary-content flex items-center justify-center w-full h-full">
							{data.user.name?.charAt(0)?.toUpperCase() || 'U'}
						</div>
					{/if}
				</div>
			</div>
			<div>
				<h3 class="font-bold text-xl">ตั้งค่าโปรไฟล์</h3>
				<p class="text-base-content/70">จัดการข้อมูลส่วนตัวและสัดส่วนร่างกายของคุณ</p>
			</div>
		</div>
		<form on:submit|preventDefault={handleProfileSubmit} enctype="multipart/form-data">
			<!-- Basic Information Section -->
			<div class="mb-8">
				<h4 class="font-semibold text-lg mb-4 flex items-center">
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					ข้อมูลพื้นฐาน
				</h4>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Name -->
					<div class="form-control">
						<label class="label">
							<span class="label-text">ชื่อ</span>
							<span class="label-text-alt text-error">*</span>
						</label>
						<input type="text" name="name" bind:value={currentName} class="input input-bordered" required />
					</div>

					<!-- Facebook Profile URL -->
					<div class="form-control">
						<label class="label">
							<span class="label-text">Facebook Profile URL</span>
							<span class="label-text-alt">ไม่บังคับ</span>
						</label>
						<input type="url" name="fbProfile" bind:value={currentFbProfile} class="input input-bordered" placeholder="https://www.facebook.com/yourprofile" />
					</div>
				</div>

				<!-- Avatar -->
				<div class="form-control mt-4">
					<label class="label">
						<span class="label-text">อวาตาร์</span>
						<span class="label-text-alt">ไฟล์ภาพ JPG, PNG หรือ GIF</span>
					</label>
					<input type="file" name="avatar" accept="image/*" class="file-input file-input-bordered w-full" on:change={previewProfileImage} />
					{#if profileImagePreview}
					<div class="mt-4 flex justify-center">
						<img src={profileImagePreview} alt="Avatar Preview" class="w-32 h-32 object-cover rounded-full border-4 border-base-200" />
					</div>
					{/if}
				</div>
			</div>

			<!-- Body Measurements -->
			<div class="mb-6">
				<h4 class="font-semibold text-lg mb-4 flex items-center">
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
					</svg>
					ข้อมูลสัดส่วนร่างกาย
				</h4>
				
				<!-- Basic Measurements -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div class="form-control">
						<label class="label">
							<span class="label-text flex items-center">
								<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-1 16h12L17 4M10 8v8M14 8v8"></path>
								</svg>
								ส่วนสูง
							</span>
						</label>
						<div class="input-group">
							<input 
								type="number" 
								bind:value={bodyMeasurements.height}
								class="input input-bordered flex-1" 
								placeholder="165"
								min="100"
								max="250"
							/>
							<span class="bg-base-200 px-3 py-2 text-sm">cm</span>
						</div>
					</div>
					
					<div class="form-control">
						<label class="label">
							<span class="label-text flex items-center">
								<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
								</svg>
								น้ำหนัก
							</span>
						</label>
						<div class="input-group">
							<input 
								type="number" 
								bind:value={bodyMeasurements.weight}
								class="input input-bordered flex-1" 
								placeholder="50"
								min="30"
								max="200"
								step="0.1"
							/>
							<span class="bg-base-200 px-3 py-2 text-sm">kg</span>
						</div>
					</div>
				</div>
				
				<!-- Upper Body Measurements -->
				<div class="divider">
					<span class="text-sm text-base-content/70">ส่วนบน</span>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
					<div class="form-control">
						<label class="label">
							<span class="label-text">รอบอก</span>
						</label>
						<div class="input-group">
							<input 
								type="number" 
								bind:value={bodyMeasurements.chest}
								class="input input-bordered flex-1" 
								placeholder="85"
								min="60"
								max="150"
								step="0.1"
							/>
							<span class="bg-base-200 px-3 py-2 text-sm">cm</span>
						</div>
					</div>
					
					<div class="form-control">
						<label class="label">
							<span class="label-text">รอบเอว</span>
						</label>
						<div class="input-group">
							<input 
								type="number" 
								bind:value={bodyMeasurements.waist}
								class="input input-bordered flex-1" 
								placeholder="65"
								min="50"
								max="120"
								step="0.1"
							/>
							<span class="bg-base-200 px-3 py-2 text-sm">cm</span>
						</div>
					</div>
					
					<div class="form-control">
						<label class="label">
							<span class="label-text">รอบไหล่</span>
						</label>
						<div class="input-group">
							<input 
								type="number" 
								bind:value={bodyMeasurements.shoulders}
								class="input input-bordered flex-1" 
								placeholder="38"
								min="30"
								max="60"
								step="0.1"
							/>
							<span class="bg-base-200 px-3 py-2 text-sm">cm</span>
						</div>
					</div>
				</div>
				
				<!-- Lower Body Measurements -->
				<div class="divider">
					<span class="text-sm text-base-content/70">ส่วนล่าง</span>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div class="form-control">
						<label class="label">
							<span class="label-text">รอบสะโพก</span>
						</label>
						<div class="input-group">
							<input 
								type="number" 
								bind:value={bodyMeasurements.hips}
								class="input input-bordered flex-1" 
								placeholder="90"
								min="60"
								max="140"
								step="0.1"
							/>
							<span class="bg-base-200 px-3 py-2 text-sm">cm</span>
						</div>
					</div>
					
					<div class="form-control">
						<label class="label">
							<span class="label-text">รอบต้นขา</span>
						</label>
						<div class="input-group">
							<input 
								type="number" 
								bind:value={bodyMeasurements.thigh}
								class="input input-bordered flex-1" 
								placeholder="55"
								min="40"
								max="80"
								step="0.1"
							/>
							<span class="bg-base-200 px-3 py-2 text-sm">cm</span>
						</div>
					</div>
				</div>
				
				<!-- Additional Measurements -->
				<div class="divider">
					<span class="text-sm text-base-content/70">รายละเอียดเพิ่มเติม</span>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="form-control">
						<label class="label">
							<span class="label-text">รอบคอ</span>
						</label>
						<div class="input-group">
							<input 
								type="number" 
								bind:value={bodyMeasurements.neck}
								class="input input-bordered flex-1" 
								placeholder="35"
								min="25"
								max="50"
								step="0.1"
							/>
							<span class="bg-base-200 px-3 py-2 text-sm">cm</span>
						</div>
					</div>
					
					<div class="form-control">
						<label class="label">
							<span class="label-text">รอบแขน</span>
						</label>
						<div class="input-group">
							<input 
								type="number" 
								bind:value={bodyMeasurements.bicep}
								class="input input-bordered flex-1" 
								placeholder="28"
								min="20"
								max="50"
								step="0.1"
							/>
							<span class="bg-base-200 px-3 py-2 text-sm">cm</span>
						</div>
					</div>
					
					<div class="form-control">
						<label class="label">
							<span class="label-text">ความยาวขา</span>
						</label>
						<div class="input-group">
							<input 
								type="number" 
								bind:value={bodyMeasurements.inseam}
								class="input input-bordered flex-1" 
								placeholder="75"
								min="60"
								max="100"
								step="0.1"
							/>
							<span class="bg-base-200 px-3 py-2 text-sm">cm</span>
						</div>
					</div>
				</div>
				
				<div class="alert alert-info mt-4">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>กรอกเฉพาะข้อมูลที่ต้องการเท่านั้น ข้อมูลนี้จะช่วยในการแนะนำเสื้อผ้าที่เหมาะสม</span>
				</div>
			</div>

			<div class="modal-action pt-6 border-t border-base-200">
				<button type="button" class="btn btn-outline" on:click={() => document.getElementById('profile_modal').close()}>
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
					ยกเลิก
				</button>
				<button type="submit" class="btn btn-primary">
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
					</svg>
					บันทึกข้อมูล
				</button>
			</div>
		</form>
	</div>
	{/if}
</dialog>


<div class="max-w-[120rem] mx-auto">
	<div class="navbar bg-base-100 bg-opacity-90 backdrop-blur-sm sticky top-0 z-10">
		<div class="navbar-start">
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
					</svg>
				</div>
				<ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow">
					<li><a href="/courses">บทความ</a></li>
					<li>
						<details>
							<summary>บริการ</summary>
							<ul class="p-2">
								<li><a href="/Host">รับจ้าง</a></li>
								<li><a href="/shops">หาชุดเช่าคอสเพลย์</a></li>
								<li><a href="/freelance">Freelance Services</a></li>
							</ul>
						</details>
					</li>
					<li>
						<a href="/cart" class="flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.39a2 2 0 001.92 2.61h9.56a2 2 0 001.92-2.61L17 13M9 19v.01M20 19v.01" />
							</svg>
							ตะกร้าสินค้า
						</a>
					</li>
					<li>
						<a href="/purchase-list" class="flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							รายการสั่งซื้อ
						</a>
					</li>
				</ul>
			</div>
			<h1 class="btn btn-ghost text-xl"><a href="/">MaCosplay</a></h1>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/courses">บทความ</a></li>
				<li class="dropdown dropdown-hover">
					<a tabindex="0" role="button">บริการ</a>
					<ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box z-50 mt-2 w-56">
						<li><a href="/Host">รับจ้าง</a></li>
						<li><a href="/shops">หาชุดเช่าคอสเพลย์</a></li>
						<li><a href="/freelance">Freelance Services</a></li>
					</ul>
				</li>
				<li>
					<a href="/cart" class="flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.39a2 2 0 001.92 2.61h9.56a2 2 0 001.92-2.61L17 13M9 19v.01M20 19v.01" />
						</svg>
						ตะกร้าสินค้า
					</a>
				</li>
				<li>
					<a href="/purchase-list" class="flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						รายการสั่งซื้อ
					</a>
				</li>
			</ul>
		</div>
		<div class="navbar-end">
			{#if data.user}
			<!-- Shopping Cart Button -->
			<a href="/cart" class="btn btn-ghost btn-circle mr-2">
				<div class="indicator">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.39a2 2 0 001.92 2.61h9.56a2 2 0 001.92-2.61L17 13M9 19v.01M20 19v.01" />
					</svg>
					<!-- Cart badge - can be dynamically updated -->
					<!-- <span class="badge badge-sm indicator-item">0</span> -->
				</div>
			</a>
			<!-- Purchase List Button -->
			<a href="/purchase-list" class="btn btn-ghost btn-circle mr-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
			</a>
			<div class="dropdown dropdown-end">
				<button tabindex="0" class="btn btn-ghost flex items-center">
					ตั้งค่า
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
					<li><a href="#" on:click|preventDefault={() => document.getElementById('profile_modal').showModal()}>โปรไฟล์</a></li>
					<li><a href="/manage-access">จัดการสิทธิการเข้าถึง</a></li>
					<li class="block lg:hidden">
						<label class="flex cursor-pointer gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="5" />
								<path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
							</svg>
							<input type="checkbox" value="dark" class="toggle theme-controller" on:change={toggleTheme} />
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
							</svg>
						</label>
					</li>
					<li>
						<form action="/logout" method="POST">
							<button class="btn w-full text-left">Logout</button>
						</form>
					</li>
				</ul>
			</div>
			{:else}
				<a href="/login" class="btn">Login</a>
			{/if}
			<!-- Hide the switch on larger screens -->
			<label class="hidden lg:flex cursor-pointer gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="5" />
					<path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
				</svg>
				<input type="checkbox" value="dark" class="toggle theme-controller" on:change={toggleTheme} />
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
				</svg>
			</label>
		</div>
	  </div>
	  {@render children()}
</div>

<div class="drawer-side z-50 md:border-r md:border-base-content/10">
  <label
    for="my-drawer-2"
    aria-label="close sidebar"
    class="drawer-overlay"
  ></label>

  <div class="menu bg-base-200 min-h-full w-80 p-0">
    <div class="mx-7 mt-10">
      <ul class="menu bg-base-200 gap-4">
        {#each SIDEBAR as data, index}
          <li>
            {#if !data.shop}
              <a href={data.href} class="block">
                {#if data.title}
                  <span class="text-lg font-semibold">
                    {data.title}
                  </span>
                {/if}
              </a>
            {/if}

            {#if data.shop}
              <details open>
                <summary class="font-semibold text-lg text-base-content cursor-pointer">
                  Shop
                </summary>
                <ul>
                  {#each data.shop as item, subIndex}
                    <li>
                      <a
                        href={item.href}
                        class="text-sm font-semibold text-base-content block py-3"
                      >
                        {item.title}
                      </a>
                    </li>
                  {/each}
                </ul>
              </details>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>



  