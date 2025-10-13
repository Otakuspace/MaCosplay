<script>
    import { thaiTranslations } from '$lib/i18n/thai';
    
    const t = thaiTranslations;
    
    let formData = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
    };
    let errorMessage = '';
    let showAlert = false;
    let loading = false;

    async function handleSubmit(event) {
        event.preventDefault();
        loading = true;
        errorMessage = '';
        showAlert = false;
        
        if (formData.password !== formData.passwordConfirm) {
            errorMessage = t.passwordsDoNotMatch;
            showAlert = true;
            loading = false;
            return;
        }

        const form = new FormData();
        form.append('name', formData.name);
        form.append('email', formData.email);
        form.append('password', formData.password);
        form.append('passwordConfirm', formData.passwordConfirm);

        try {
            const response = await fetch('/register', {
                method: 'POST',
                body: form,
            });

            if (response.redirected) {
                // Registration successful, show success message and redirect
                alert(t.registrationSuccess);
                window.location.href = '/login';
            } else {
                const result = await response.text();
                if (result.includes('errors')) {
                    errorMessage = 'การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง';
                    showAlert = true;
                } else {
                    errorMessage = 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง';
                    showAlert = true;
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
            errorMessage = 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง';
            showAlert = true;
        } finally {
            loading = false;
        }
    }
</script>

<div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
    <div class="register-card rounded-lg shadow-xl p-8 bg-white">
        <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">{t.register}</h2>
        
        <form on:submit={handleSubmit} class="space-y-6">
            <div>
                <label for="name" class="block text-gray-700 text-sm font-bold mb-2">{t.name}</label>
                <input 
                    type="text" 
                    id="name" 
                    bind:value={formData.name} 
                    placeholder={t.namePlaceholder}
                    class="input input-bordered w-full" 
                    required 
                />
            </div>
            
            <div>
                <label for="email" class="block text-gray-700 text-sm font-bold mb-2">{t.email}</label>
                <input 
                    type="email" 
                    id="email" 
                    bind:value={formData.email} 
                    placeholder={t.emailPlaceholder}
                    class="input input-bordered w-full" 
                    required 
                />
            </div>
            
            <div>
                <label for="password" class="block text-gray-700 text-sm font-bold mb-2">{t.password}</label>
                <input 
                    type="password" 
                    id="password" 
                    bind:value={formData.password} 
                    placeholder={t.passwordPlaceholder}
                    class="input input-bordered w-full" 
                    required 
                />
            </div>
            
            <div>
                <label for="passwordConfirm" class="block text-gray-700 text-sm font-bold mb-2">{t.confirmPassword}</label>
                <input 
                    type="password" 
                    id="passwordConfirm" 
                    bind:value={formData.passwordConfirm} 
                    placeholder="ยืนยันรหัสผ่านของคุณ"
                    class="input input-bordered w-full" 
                    required 
                />
            </div>

            {#if showAlert}
                <div role="alert" class="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errorMessage}</span>
                </div>
            {/if}
            
            <button type="submit" class="btn btn-primary w-full" disabled={loading}>
                {#if loading}
                    <span class="loading loading-spinner loading-sm"></span>
                    กำลังลงทะเบียน...
                {:else}
                    {t.register}
                {/if}
            </button>
        </form>

        <!-- Login Link -->
        <div class="mt-8 text-center">
            <p class="text-gray-600">
                {t.alreadyHaveAccount}
                <a href="/login" class="link text-blue-600 hover:text-blue-800 font-medium ml-1">{t.login}</a>
            </p>
        </div>
    </div>
</div>

<style>
    .register-card {
        max-width: 450px;
        margin: 0 auto;
        backdrop-filter: blur(10px);
    }

    .input {
        transition: all 0.2s ease;
    }

    .input:focus {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
        border-color: #22c55e;
    }

    .btn-primary {
        background-color: #22c55e;
        border-color: #22c55e;
        color: white;
        padding: 12px 20px;
        font-size: 16px;
        border-radius: 8px;
        transition: all 0.2s ease;
        font-weight: 500;
    }

    .btn-primary:hover {
        background-color: #16a34a;
        border-color: #16a34a;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }

    .btn-primary:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
    }

    .btn-primary:active {
        transform: translateY(0);
    }

    .btn-primary:disabled {
        background-color: #9ca3af;
        border-color: #9ca3af;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    .alert-error {
        background-color: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
        border-radius: 8px;
        padding: 12px;
    }

    .link {
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .link:hover {
        text-decoration: underline;
    }
</style>
