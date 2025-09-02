<script lang="ts">
	import { onMount } from 'svelte';
	import { formatCurrency } from '$types/purchase';

	// Mock cart data to demonstrate functionality
	let cartItems = [
		{
			id: '1',
			quantity: 2,
			size: 'M',
			color: 'แดง',
			expand: {
				product: {
					id: 'prod1',
					name: 'ชุดคอสเพลย์ Genshin Impact - Raiden Shogun',
					price: 2500,
					image: 'https://via.placeholder.com/150x150/ff6b6b/ffffff?text=Raiden'
				}
			}
		},
		{
			id: '2',
			quantity: 1,
			size: 'L',
			color: 'น้ำเงิน',
			expand: {
				product: {
					id: 'prod2',
					name: 'ชุดคอสเพลย์ Demon Slayer - Tanjiro',
					price: 1800,
					image: 'https://via.placeholder.com/150x150/4ecdc4/ffffff?text=Tanjiro'
				}
			}
		}
	];

	let loading = false;
	let error = '';
	let checkoutLoading = false;
	let shippingAddress = '';

	function updateQuantity(itemId, newQuantity) {
		if (newQuantity < 1) {
			removeItem(itemId);
			return;
		}

		cartItems = cartItems.map(item => 
			item.id === itemId ? { ...item, quantity: newQuantity } : item
		);
	}

	function removeItem(itemId) {
		cartItems = cartItems.filter(item => item.id !== itemId);
	}

	function clearCart() {
		cartItems = [];
	}

	function checkout() {
		if (!shippingAddress.trim()) {
			alert('กรุณากรอกที่อยู่จัดส่ง');
			return;
		}

		checkoutLoading = true;
		setTimeout(() => {
			alert('การสั่งซื้อเสร็จสิ้น! (Demo)');
			checkoutLoading = false;
			clearCart();
		}, 2000);
	}

	$: totalAmount = cartItems.reduce((sum, item) => {
		const product = item.expand?.product;
		return sum + (product?.price || 0) * item.quantity;
	}, 0);
</script>

<svelte:head>
	<title>ตะกร้าสินค้า Demo - MaCosplay</title>
	<meta name="description" content="Demo ตะกร้าสินค้า - แสดงการทำงานของระบบ" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<div class="alert alert-info mb-6">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
		</svg>
		<span>นี่คือหน้า Demo ที่แสดงการทำงานของตะกร้าสินค้า</span>
	</div>

	<div class="flex items-center justify-between mb-8">
		<h1 class="text-3xl font-bold flex items-center">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.39a2 2 0 001.92 2.61h9.56a2 2 0 001.92-2.61L17 13M9 19v.01M20 19v.01" />
			</svg>
			ตะกร้าสินค้า (Demo)
		</h1>
		
		{#if cartItems.length > 0}
			<button 
				class="btn btn-outline btn-error btn-sm"
				on:click={clearCart}
			>
				ล้างตะกร้า
			</button>
		{/if}
	</div>

	{#if cartItems.length === 0}
		<div class="text-center py-12">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.39a2 2 0 001.92 2.61h9.56a2 2 0 001.92-2.61L17 13M9 19v.01M20 19v.01" />
			</svg>
			<h3 class="text-xl font-semibold mb-2">ตะกร้าสินค้าว่าง</h3>
			<p class="text-base-content/70 mb-4">คุณยังไม่มีสินค้าในตะกร้า</p>
			<a href="/shop" class="btn btn-primary">เริ่มช้อปปิ้ง</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Cart Items -->
			<div class="lg:col-span-2">
				<div class="space-y-4">
					{#each cartItems as item (item.id)}
						{@const product = item.expand?.product}
						<div class="card bg-base-100 shadow-sm border border-base-200">
							<div class="card-body p-4">
								<div class="flex items-center space-x-4">
									<!-- Product Image -->
									<div class="avatar">
										<div class="w-20 h-20 rounded-lg">
											<img 
												src={product?.image || '/api/placeholder/150/150'} 
												alt={product?.name || 'Product'} 
												class="object-cover"
											/>
										</div>
									</div>

									<!-- Product Info -->
									<div class="flex-1">
										<h3 class="font-semibold text-lg">{product?.name || 'Unknown Product'}</h3>
										<div class="text-sm text-base-content/70 space-y-1">
											{#if item.size}
												<p>ขนาด: {item.size}</p>
											{/if}
											{#if item.color}
												<p>สี: {item.color}</p>
											{/if}
											<p class="font-medium text-primary">{formatCurrency(product?.price || 0)}</p>
										</div>
									</div>

									<!-- Quantity Controls -->
									<div class="flex items-center space-x-2">
										<button 
											class="btn btn-circle btn-sm btn-outline"
											on:click={() => updateQuantity(item.id, item.quantity - 1)}
										>
											-
										</button>
										<span class="w-8 text-center font-medium">{item.quantity}</span>
										<button 
											class="btn btn-circle btn-sm btn-outline"
											on:click={() => updateQuantity(item.id, item.quantity + 1)}
										>
											+
										</button>
									</div>

									<!-- Item Total & Remove -->
									<div class="text-right">
										<p class="font-bold text-lg">{formatCurrency((product?.price || 0) * item.quantity)}</p>
										<button 
											class="btn btn-ghost btn-sm text-error mt-1"
											on:click={() => removeItem(item.id)}
										>
											ลบ
										</button>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Order Summary & Checkout -->
			<div class="lg:col-span-1">
				<div class="card bg-base-100 shadow-sm border border-base-200 sticky top-24">
					<div class="card-body">
						<h3 class="font-bold text-xl mb-4">สรุปคำสั่งซื้อ</h3>
						
						<!-- Order Summary -->
						<div class="space-y-2 mb-4">
							<div class="flex justify-between">
								<span>จำนวนสินค้า:</span>
								<span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} ชิ้น</span>
							</div>
							<div class="flex justify-between">
								<span>ยอดรวม:</span>
								<span class="font-medium">{formatCurrency(totalAmount)}</span>
							</div>
							<div class="divider my-2"></div>
							<div class="flex justify-between text-lg font-bold">
								<span>ยอดรวมทั้งหมด:</span>
								<span class="text-primary">{formatCurrency(totalAmount)}</span>
							</div>
						</div>

						<!-- Shipping Address -->
						<div class="form-control mb-4">
							<label class="label">
								<span class="label-text font-medium">ที่อยู่จัดส่ง *</span>
							</label>
							<textarea 
								bind:value={shippingAddress}
								class="textarea textarea-bordered h-20" 
								placeholder="กรอกที่อยู่จัดส่งแบบละเอียด..."
								required
							></textarea>
						</div>

						<!-- Checkout Button -->
						<button 
							class="btn btn-primary w-full"
							disabled={checkoutLoading || !shippingAddress.trim()}
							on:click={checkout}
						>
							{#if checkoutLoading}
								<span class="loading loading-spinner loading-sm"></span>
								กำลังดำเนินการ...
							{:else}
								สั่งซื้อ
							{/if}
						</button>

						<!-- Additional Info -->
						<div class="text-xs text-base-content/60 mt-3 space-y-1">
							<p>• การจัดส่งภายใน 3-7 วันทำการ</p>
							<p>• รับประกันสินค้า 30 วัน</p>
							<p>• ชำระเงินปลายทาง</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Feature List -->
	<div class="mt-12">
		<h2 class="text-2xl font-bold mb-6">ฟีเจอร์ที่ทำงานได้:</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="card bg-base-100 shadow-sm border border-base-200">
				<div class="card-body">
					<h3 class="card-title text-success">✅ ทำงานได้</h3>
					<ul class="space-y-2">
						<li>• แสดงรายการสินค้าในตะกร้า</li>
						<li>• ปรับจำนวนสินค้า (+/-)</li>
						<li>• ลบสินค้าออกจากตะกร้า</li>
						<li>• ล้างตะกร้าทั้งหมด</li>
						<li>• คำนวณยอดรวมอัตโนมัติ</li>
						<li>• แสดงที่อยู่จัดส่ง</li>
						<li>• ปุ่มสั่งซื้อ (Demo)</li>
					</ul>
				</div>
			</div>
			<div class="card bg-base-100 shadow-sm border border-base-200">
				<div class="card-body">
					<h3 class="card-title text-warning">⚠️ ต้องตั้งค่า</h3>
					<ul class="space-y-2">
						<li>• การเชื่อมต่อฐานข้อมูล PocketBase</li>
						<li>• การยืนยันตัวตนผู้ใช้</li>
						<li>• การบันทึกข้อมูลจริง</li>
						<li>• การประมวลผลการชำระเงิน</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>