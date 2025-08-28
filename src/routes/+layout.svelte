<script lang="ts">
	import '../app.css';
	import "tailwindcss/tailwind.css";
	import { onMount } from 'svelte';
	import { SIDEBAR } from './data/sidebar'; // Adjust the import path as necessary

	let { children, data } = $props();
	
	// Mobile menu state
	let isMobileMenuOpen = false;

	let currentTheme = 'light';
	let themeToggle: HTMLInputElement;

	// Function to save theme preference
	function saveThemePreference(theme: string) {
		if (typeof window !== 'undefined') {
			localStorage.setItem('theme', theme);
		}
	}

	// Function to get current theme
	function getCurrentTheme(): string {
		if (typeof window !== 'undefined') {
			return document.documentElement.getAttribute('data-theme') || 'light';
		}
		return 'light';
	}

	// Function to apply theme
	function applyTheme(theme: string) {
		if (typeof window !== 'undefined') {
			document.documentElement.setAttribute('data-theme', theme);
			currentTheme = theme;
			
			// Update toggle state without triggering event
			if (themeToggle) {
				themeToggle.checked = theme === 'dark';
			}
		}
	}

	// Initialize theme on mount
	onMount(() => {
		// Get the theme that was already set by the script in app.html
		currentTheme = getCurrentTheme();
		
		// Update toggle state
		if (themeToggle) {
			themeToggle.checked = currentTheme === 'dark';
		}

		// Listen for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		function handleSystemThemeChange(e: MediaQueryListEvent) {
			// Only update if user hasn't set a preference
			const savedTheme = localStorage.getItem('theme');
			if (!savedTheme) {
				const newTheme = e.matches ? 'dark' : 'light';
				applyTheme(newTheme);
			}
		}
		
		mediaQuery.addEventListener('change', handleSystemThemeChange);
		
		return () => {
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
		};
	});

	function toggleTheme(event: Event) {
		const isChecked = (event.target as HTMLInputElement).checked;
		const theme = isChecked ? 'dark' : 'light';
		applyTheme(theme);
		saveThemePreference(theme);
	}
	
	// Mobile menu functions
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
	
	function closeMobileMenu() {
		isMobileMenuOpen = false;
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


<!-- Modern Navigation -->
<div class="max-w-[120rem] mx-auto">
	<nav class="bg-glass border-b border-primary sticky top-0 z-50 shadow-soft">
		<div class="mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Logo -->
				<div class="flex items-center">
					<a href="/" class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						MaCosplay
					</a>
				</div>

				<!-- Desktop Navigation -->
				<div class="hidden lg:flex items-center gap-6 xl:gap-8">
					<a href="/shop" class="text-primary hover:text-blue-500 font-medium transition-colors duration-200">
						ค้นหาชุดเช่า
					</a>
					<a href="/gallery" class="text-primary hover:text-purple-500 font-medium transition-colors duration-200">
						🎭 Gallery
					</a>
					<a href="/brainstorm" class="text-primary hover:text-green-500 font-medium transition-colors duration-200">
						🧠 Brainstorm
					</a>
					<a href="/pricing" class="text-primary hover:text-blue-500 font-medium transition-colors duration-200">
						อัพเกรด
					</a>
					<a href="/upscaler" class="text-primary hover:text-blue-500 font-medium transition-colors duration-200">
						AI Upscale
					</a>
					
					<!-- Theme Toggle -->
					<label class="flex cursor-pointer items-center gap-2">
						<svg class="w-5 h-5 text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<circle cx="12" cy="12" r="5" />
							<path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
						</svg>
						<input 
							bind:this={themeToggle}
							type="checkbox" 
							class="toggle toggle-sm bg-primary border-primary" 
							on:change={toggleTheme} 
						/>
						<svg class="w-5 h-5 text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
						</svg>
					</label>
				</div>

				<!-- Mobile Navigation -->
				<div class="lg:hidden">
					{#if isMobileMenuOpen}
						<div class="fixed inset-0 top-16 bg-black/50 z-40" on:click={closeMobileMenu}>
							<div class="bg-primary border-b border-primary shadow-lg">
								<div class="mx-auto px-4 sm:px-6 lg:px-8 py-6">
									<div class="flex flex-col space-y-6">
										<a href="/shop" class="text-primary hover:text-blue-500 font-medium transition-colors duration-200 py-3 text-lg" on:click={closeMobileMenu}>
											ค้นหาชุดเช่า
										</a>
										<a href="/gallery" class="text-primary hover:text-purple-500 font-medium transition-colors duration-200 py-3 text-lg" on:click={closeMobileMenu}>
											🎭 Gallery
										</a>
										<a href="/brainstorm" class="text-primary hover:text-green-500 font-medium transition-colors duration-200 py-3 text-lg" on:click={closeMobileMenu}>
											🧠 Brainstorm
										</a>
										<a href="/pricing" class="text-primary hover:text-blue-500 font-medium transition-colors duration-200 py-3 text-lg" on:click={closeMobileMenu}>
											อัพเกรด
										</a>
										<a href="/upscaler" class="text-primary hover:text-blue-500 font-medium transition-colors duration-200 py-3 text-lg" on:click={closeMobileMenu}>
											AI Upscale
										</a>
										
										<!-- Mobile Theme Toggle -->
										<div class="flex items-center justify-between py-3 border-t border-primary/20 mt-4 pt-6">
											<span class="text-primary font-medium text-lg">ธีม</span>
											<label class="flex cursor-pointer items-center gap-3">
												<svg class="w-6 h-6 text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<circle cx="12" cy="12" r="5" />
													<path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
												</svg>
												<input 
													type="checkbox" 
													class="toggle toggle-md bg-primary border-primary" 
													checked={currentTheme === 'dark'}
													on:change={toggleTheme} 
												/>
												<svg class="w-6 h-6 text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
												</svg>
											</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- User Menu -->
				<div class="flex items-center space-x-2 sm:space-x-4">
					{#if data.user}
						<div class="relative group">
							<button class="flex items-center space-x-2 bg-secondary hover:bg-tertiary rounded-xl px-3 sm:px-4 py-2 transition-colors duration-200">
								<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
									{data.user.name?.charAt(0) || 'U'}
								</div>
								<span class="hidden sm:block font-medium text-primary">{data.user.name}</span>
								<svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
								</svg>
							</button>
							
							<!-- Dropdown Menu -->
							<div class="absolute right-0 mt-2 w-56 bg-primary rounded-2xl shadow-large border border-primary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
								<div class="p-2">
									<a href="#" on:click|preventDefault={() => document.getElementById('profile_modal').showModal()} 
									   class="flex items-center px-4 py-3 text-primary hover:bg-secondary rounded-xl transition-colors duration-200">
										<svg class="w-5 h-5 mr-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
										</svg>
										โปรไฟล์
									</a>
									<a href="/manage-access" class="flex items-center px-4 py-3 text-primary hover:bg-secondary rounded-xl transition-colors duration-200">
										<svg class="w-5 h-5 mr-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
										</svg>
										จัดการสิทธิ์
									</a>
									<hr class="my-2 border-primary">
									<form action="/logout" method="POST" class="w-full">
										<button class="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200">
											<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
											</svg>
											ออกจากระบบ
										</button>
									</form>
								</div>
							</div>
						</div>
					{:else}
						<div class="flex items-center space-x-2 sm:space-x-3">
							<a href="/login" class="btn-secondary-modern text-sm sm:text-base px-3 sm:px-4">
								เข้าสู่ระบบ
							</a>
							<a href="/register" class="btn-primary-modern text-sm sm:text-base px-3 sm:px-4">
								สมัครสมาชิก
							</a>
						</div>
					{/if}

					<!-- Mobile Menu Button -->
					<button class="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors duration-200" on:click={toggleMobileMenu}>
						{#if isMobileMenuOpen}
							<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						{:else}
							<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</nav>
	  {@render children()}
</div>

<div class="drawer-side z-50 md:border-r md:border-base-content/10">
  <label
    for="my-drawer-2"
    aria-label="close sidebar"
    class="drawer-overlay"
  ></label>

  <div class="menu bg-secondary min-h-full w-80 p-0">
    <div class="mx-7 mt-10">
      <ul class="menu bg-secondary gap-4">
        {#each SIDEBAR as data, index}
          <li>
            {#if !data.shop}
              <a href={data.href} class="block">
                {#if data.title}
                  <span class="text-lg font-semibold text-primary">
                    {data.title}
                  </span>
                {/if}
              </a>
            {/if}

            {#if data.shop}
              <details open>
                <summary class="font-semibold text-lg text-primary cursor-pointer">
                  Shop
                </summary>
                <ul>
                  {#each data.shop as item, subIndex}
                    <li>
                      <a
                        href={item.href}
                        class="text-sm font-semibold text-primary hover:text-secondary block py-3 transition-colors duration-200"
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



  