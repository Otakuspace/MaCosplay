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

	async function handleProfileSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
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
	<div class="modal-box">
		<h3 class="font-bold text-lg">ตั้งค่าโปรไฟล์</h3>
		<form on:submit|preventDefault={handleProfileSubmit} enctype="multipart/form-data">
			<!-- Name -->
			<div class="form-control mb-4">
				<label class="label">
					<span class="label-text">ชื่อ</span>
				</label>
				<input type="text" name="name" bind:value={currentName} class="input input-bordered" required />
			</div>

			<!-- Avatar -->
			<div class="form-control mb-4">
				<label class="label">
					<span class="label-text">อวาตาร์</span>
				</label>
				<input type="file" name="avatar" accept="image/*" class="file-input file-input-bordered w-full" on:change={previewProfileImage} />
				{#if profileImagePreview}
				<div class="mt-4">
					<img src={profileImagePreview} alt="Avatar Preview" class="w-48 h-48 object-cover rounded-lg" />
				</div>
				{/if}
			</div>

			<!-- Facebook Profile URL -->
			<div class="form-control mb-4">
				<label class="label">
					<span class="label-text">Facebook Profile URL</span>
				</label>
				<input type="url" name="fbProfile" bind:value={currentFbProfile} class="input input-bordered text-gray-500" placeholder="https://www.facebook.com/yourprofile" />
			</div>

			<div class="modal-action">
				<button type="button" class="btn" on:click={() => document.getElementById('profile_modal').close()}>ยกเลิก</button>
				<button type="submit" class="btn btn-primary">บันทึก</button>
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
				<ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
					<li><a>บทความ</a></li>
					<li>
						<details>
							<summary>เรียนรู้เพิ่มเติม</summary>
							<ul class="p-2">
								<li><a>Submenu 1</a></li>
								<li><a>Submenu 2</a></li>
							</ul>
						</details>
					</li>
					<li><a href="/pricing">อัพเกรด</a></li>
					<li><a href="/upscaler">AI Upscale</a></li>
				</ul>
			</div>
			<h1 class="btn btn-ghost text-xl"><a href="/">MaCosplay</a></h1>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><a>บทความ</a></li>
				<li>
					<details>
						<summary>เรียนรู้เพิ่มเติม</summary>
						<ul class="p-2">
							<li><a>Submenu 1</a></li>
							<li><a>Submenu 2</a></li>
						</ul>
					</details>
				</li>
				<li><a href="/pricing">อัพเกรด</a></li>
				<li><a href="/upscaler">AI Upscale</a></li>
			</ul>
		</div>
		<div class="navbar-end">
			{#if data.user}
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



  