<script>
	import { createEventDispatcher } from 'svelte';
	export const form = null;
	const dispatch = createEventDispatcher();
	let loading = false;
	let errorMessage = '';
	let showAlert = false;

	let email = '';
	let password = '';

	async function handleLogin(event) {
		event.preventDefault();
		loading = true;
		errorMessage = '';
		showAlert = false;
		const form = new FormData();
		form.append('email', email);
		form.append('password', password);

		try {
			const response = await fetch('/login?/login', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
				},
				body: form
			});

			const result = await response.json();

			if (response.ok) {
				const data = result;
				console.log('Login successful:', data);
				dispatch('loginSuccess', { user: data.user });
				window.location.href = '/login';
			} else {
				errorMessage = result.errorMessage || 'Invalid email or password.';
				showAlert = true;
			}
		} catch (error) {
			console.error('Error during login:', error);
			errorMessage = 'An unexpected error occurred. Please try again later.';
			showAlert = true;
		} finally {
			loading = false;
		}
	}

	const redirectToFacebook = () => {
		window.location.href = `${import.meta.env.VITE_PB_URL}/api/collections/users/auth/facebook`;
	};
</script>

<div class="flex items-center justify-center min-h-screen">
	<div class="login-card rounded-lg shadow-lg p-8">
		<h2 class="text-2xl font-bold text-center mb-6">เข้าสู่ระบบ</h2>
		<!-- <form on:submit={handleLogin}>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="email"> Email </label>
				<input
					type="email"
					id="email"
					bind:value={email}
					placeholder="ใส่อีเมล"
					class="input input-bordered w-full"
					required
				/>
			</div>
			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="password"> Password </label>
				<input
					type="password"
					id="password"
					bind:value={password}
					placeholder="ใส่รหัสผ่าน"
					class="input input-bordered w-full"
					required
				/>
			</div>
			{#if showAlert}
				<div role="alert" class="alert alert-error mt-4">
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
					<span>{errorMessage || 'Error! Task failed successfully.'}</span>
				</div>
			{/if}
			<div class="flex items-center justify-between">
				<button type="submit" class="btn btn-primary w-full" disabled={loading}>
					{#if loading}
						Loading...
					{:else}
						เข้าสู่ระบบ
					{/if}
				</button>
			</div>
			<div class="flex items-center justify-between mt-4">
				<a href="/" class="link text-sm text-blue-500 hover:underline"> ลืมรหัสผ่าน </a>
				<a href="/register" class="link text-sm text-blue-500 hover:underline"> ลงทะเบียน </a>
			</div>
			
			
		</form> -->
		<form class="flex flex-col items-center space-y-6 w-full max-w-sm pt-6" method="post" action="?/OAuth">
			<button type="submit" class="btn btn-facebook mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-2">
					<path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
				</svg>
				เข้าสู่ระบบด้วย Facebook
			</button>
		</form>
	</div>
</div>

<style>
	.login-card {
		max-width: 400px;
		margin: 0 auto;
	}

	.alert {
		padding: 10px;
		border-radius: 5px;
	}

	.alert-error {
		background-color: #f8d7da;
		color: #721c24;
		border-color: #f5c6cb;
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
