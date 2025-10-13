<script>
	import { createEventDispatcher } from 'svelte';
	import { thaiTranslations } from '$lib/i18n/thai';
	
	export let form;
	const dispatch = createEventDispatcher();
	const t = thaiTranslations;
	
	let loading = false;
	let errorMessage = '';
	let showAlert = false;
	let showEmailLogin = false;

	let email = '';
	let password = '';

	async function handleEmailLogin(event) {
		event.preventDefault();
		loading = true;
		errorMessage = '';
		showAlert = false;
		
		const formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);

		try {
			const response = await fetch('/login?/login', {
				method: 'POST',
				body: formData
			});

			if (response.redirected) {
				window.location.href = response.url;
			} else {
				const result = await response.text();
				if (result.includes('errorMessage')) {
					errorMessage = t.invalidCredentials;
					showAlert = true;
				}
			}
		} catch (error) {
			console.error('Error during login:', error);
			errorMessage = 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง';
			showAlert = true;
		} finally {
			loading = false;
		}
	}

	function toggleEmailLogin() {
		showEmailLogin = !showEmailLogin;
		if (!showEmailLogin) {
			email = '';
			password = '';
			errorMessage = '';
			showAlert = false;
		}
	}
</script>

<div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
	<div class="login-card rounded-lg shadow-xl p-8 bg-white">
		<h2 class="text-3xl font-bold text-center mb-8 text-gray-800">{t.login}</h2>
		
		{#if !showEmailLogin}
			<!-- Login Options -->
			<div class="space-y-4">
				<h3 class="text-lg font-medium text-center text-gray-600 mb-6">{t.chooseLoginMethod}</h3>
				
				<!-- Facebook Login -->
				<form method="post" action="?/OAuth" class="w-full">
					<button type="submit" class="btn btn-facebook w-full">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-3">
							<path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
						</svg>
						{t.loginWithFacebook}
					</button>
				</form>

				<!-- Divider -->
				<div class="flex items-center my-6">
					<div class="flex-grow border-t border-gray-300"></div>
					<span class="px-4 text-gray-500 text-sm">{t.orLoginWith}</span>
					<div class="flex-grow border-t border-gray-300"></div>
				</div>

				<!-- Email Login Button -->
				<button 
					type="button" 
					class="btn btn-outline w-full"
					on:click={toggleEmailLogin}
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-3">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
					</svg>
					{t.loginWithEmail}
				</button>
			</div>
		{:else}
			<!-- Email Login Form -->
			<form on:submit={handleEmailLogin} class="space-y-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-medium text-gray-700">{t.loginWithEmail}</h3>
					<button 
						type="button" 
						class="text-gray-500 hover:text-gray-700"
						on:click={toggleEmailLogin}
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div>
					<label class="block text-gray-700 text-sm font-bold mb-2" for="email">{t.email}</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						placeholder={t.emailPlaceholder}
						class="input input-bordered w-full"
						required
					/>
				</div>

				<div>
					<label class="block text-gray-700 text-sm font-bold mb-2" for="password">{t.password}</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						placeholder={t.passwordPlaceholder}
						class="input input-bordered w-full"
						required
					/>
				</div>

				{#if showAlert}
					<div role="alert" class="alert alert-error">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 shrink-0 stroke-current"
							fill="none"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>{errorMessage}</span>
					</div>
				{/if}

				<button type="submit" class="btn btn-primary w-full" disabled={loading}>
					{#if loading}
						<span class="loading loading-spinner loading-sm"></span>
						กำลังเข้าสู่ระบบ...
					{:else}
						{t.login}
					{/if}
				</button>

				<div class="flex items-center justify-between text-sm">
					<a href="/" class="link text-blue-600 hover:text-blue-800">{t.forgotPassword}</a>
				</div>
			</form>
		{/if}

		<!-- Register Link -->
		<div class="mt-8 text-center">
			<p class="text-gray-600">
				{t.dontHaveAccount}
				<a href="/register" class="link text-blue-600 hover:text-blue-800 font-medium ml-1">{t.register}</a>
			</p>
		</div>
	</div>
</div>

<style>
	.login-card {
		max-width: 450px;
		margin: 0 auto;
		backdrop-filter: blur(10px);
	}

	.btn-facebook {
		background-color: #1877f2;
		color: white;
		border: none;
		padding: 12px 20px;
		font-size: 16px;
		border-radius: 8px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		font-weight: 500;
	}

	.btn-facebook:hover {
		background-color: #166fe5;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(24, 119, 242, 0.3);
	}

	.btn-facebook:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(24, 119, 242, 0.3);
	}

	.btn-facebook:active {
		transform: translateY(0);
	}

	.btn-outline {
		border: 2px solid #e5e7eb;
		background-color: white;
		color: #374151;
		padding: 12px 20px;
		font-size: 16px;
		border-radius: 8px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		font-weight: 500;
	}

	.btn-outline:hover {
		border-color: #3b82f6;
		color: #3b82f6;
		background-color: #f8fafc;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
	}

	.input {
		transition: all 0.2s ease;
	}

	.input:focus {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
	}

	.alert-error {
		background-color: #fef2f2;
		color: #dc2626;
		border: 1px solid #fecaca;
		border-radius: 8px;
		padding: 12px;
	}
</style>
