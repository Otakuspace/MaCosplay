<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { PurchaseOrder, PurchaseOrderStatus } from '$types/purchase';
	import { STATUS_CONFIGS, getStatusConfig, formatCurrency, formatDate } from '$types/purchase';

	// Purchase list state
	let purchaseList: PurchaseOrder[] = [];
	let loading = true;
	let error = '';
	let searchTerm = '';
	let filterStatus: PurchaseOrderStatus | 'all' = 'all';
	let sortBy = 'date';
	let sortOrder = 'desc';

	// Purchase item statuses
	const statusOptions = STATUS_CONFIGS;

	// Mock data - replace with actual API calls
	const mockPurchaseList = [
		{
			id: '1',
			orderNumber: 'ORD-2024-001',
			items: [
				{
					name: 'ชุดคอสเพลย์ นารูโตะ',
					image: '/api/placeholder/150/150',
					quantity: 1,
					price: 1500,
					size: 'M'
				}
			],
			totalAmount: 1500,
			status: 'confirmed',
			orderDate: '2024-01-15',
			estimatedDelivery: '2024-01-22',
			shippingAddress: 'กรุงเทพมหานคร, ประเทศไทย'
		},
		{
			id: '2',
			orderNumber: 'ORD-2024-002',
			items: [
				{
					name: 'ชุดคอสเพลย์ วันพีช ลูฟี่',
					image: '/api/placeholder/150/150',
					quantity: 1,
					price: 1200,
					size: 'L'
				},
				{
					name: 'หมวกฟาง ลูฟี่',
					image: '/api/placeholder/150/150',
					quantity: 1,
					price: 300,
					size: 'Free Size'
				}
			],
			totalAmount: 1500,
			status: 'shipped',
			orderDate: '2024-01-10',
			estimatedDelivery: '2024-01-17',
			shippingAddress: 'เชียงใหม่, ประเทศไทย'
		}
	];

	onMount(async () => {
		await loadPurchaseList();
	});

	async function loadPurchaseList() {
		try {
			loading = true;
			const response = await fetch('/api/purchase-list');
			
			if (!response.ok) {
				throw new Error('Failed to fetch purchase list');
			}
			
			const result = await response.json();
			if (result.success) {
				purchaseList = result.data;
			} else {
				throw new Error('Failed to load purchase list');
			}
		} catch (err) {
			console.error('Error loading purchase list:', err);
			// Fallback to mock data for development
			purchaseList = mockPurchaseList;
			error = 'Using demo data - ' + err.message;
		} finally {
			loading = false;
		}
	}

	// Filter and sort purchase list
	$: filteredPurchaseList = purchaseList
		.filter(order => {
			const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
			const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
			return matchesSearch && matchesStatus;
		})
		.sort((a, b) => {
			let aValue, bValue;
			switch (sortBy) {
				case 'date':
					aValue = new Date(a.orderDate);
					bValue = new Date(b.orderDate);
					break;
				case 'amount':
					aValue = a.totalAmount;
					bValue = b.totalAmount;
					break;
				case 'status':
					aValue = a.status;
					bValue = b.status;
					break;
				default:
					return 0;
			}
			
			if (sortOrder === 'asc') {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

	function getStatusBadge(status: PurchaseOrderStatus) {
		return getStatusConfig(status);
	}

	async function updateOrderStatus(orderId, newStatus) {
		try {
			const response = await fetch(`/api/purchase-list/${orderId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus })
			});
			
			if (!response.ok) {
				throw new Error('Failed to update order status');
			}
			
			const result = await response.json();
			if (result.success) {
				// Update local state
				purchaseList = purchaseList.map(order => 
					order.id === orderId ? result.data : order
				);
			}
		} catch (err) {
			console.error('Error updating order status:', err);
			// Show error to user
			alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ: ' + err.message);
		}
	}
</script>

<svelte:head>
	<title>รายการสั่งซื้อ - MaCosplay</title>
	<meta name="description" content="ติดตามรายการสั่งซื้อและสถานะการจัดส่งของคุณ" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.39a2 2 0 001.92 2.61h9.56a2 2 0 001.92-2.61L17 13M9 19v.01M20 19v.01" />
				</svg>
				รายการสั่งซื้อ
			</h1>
			<p class="text-base-content/70 mt-2">ติดตามรายการสั่งซื้อและสถานะการจัดส่งของคุณ</p>
		</div>
	</div>

	<!-- Search and Filter Controls -->
	<div class="card bg-base-100 shadow-sm mb-6">
		<div class="card-body">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<!-- Search -->
				<div class="form-control">
					<label class="label">
						<span class="label-text">ค้นหา</span>
					</label>
					<input 
						type="text" 
						bind:value={searchTerm}
						placeholder="หมายเลขคำสั่งซื้อ หรือชื่อสินค้า"
						class="input input-bordered"
					/>
				</div>

				<!-- Status Filter -->
				<div class="form-control">
					<label class="label">
						<span class="label-text">สถานะ</span>
					</label>
					<select bind:value={filterStatus} class="select select-bordered">
						<option value="all">ทั้งหมด</option>
						{#each statusOptions as status}
							<option value={status.value}>{status.label}</option>
						{/each}
					</select>
				</div>

				<!-- Sort By -->
				<div class="form-control">
					<label class="label">
						<span class="label-text">เรียงตาม</span>
					</label>
					<select bind:value={sortBy} class="select select-bordered">
						<option value="date">วันที่สั่งซื้อ</option>
						<option value="amount">จำนวนเงิน</option>
						<option value="status">สถานะ</option>
					</select>
				</div>

				<!-- Sort Order -->
				<div class="form-control">
					<label class="label">
						<span class="label-text">ลำดับ</span>
					</label>
					<select bind:value={sortOrder} class="select select-bordered">
						<option value="desc">ใหม่ล่าสุด</option>
						<option value="asc">เก่าที่สุด</option>
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- Purchase List Content -->
	{#if loading}
		<div class="flex justify-center items-center py-12">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if error}
		<div class="alert alert-error">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>เกิดข้อผิดพลาด: {error}</span>
		</div>
	{:else if filteredPurchaseList.length === 0}
		<div class="text-center py-12">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.39a2 2 0 001.92 2.61h9.56a2 2 0 001.92-2.61L17 13M9 19v.01M20 19v.01" />
			</svg>
			<h3 class="text-xl font-semibold mb-2">ไม่มีรายการสั่งซื้อ</h3>
			<p class="text-base-content/70 mb-4">คุณยังไม่มีรายการสั่งซื้อใดๆ</p>
			<a href="/shop" class="btn btn-primary">เริ่มช้อปปิ้ง</a>
		</div>
	{:else}
		<div class="space-y-6">
			{#each filteredPurchaseList as order (order.id)}
				<div class="card bg-base-100 shadow-sm border border-base-200">
					<div class="card-body">
						<!-- Order Header -->
						<div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
							<div class="flex items-center space-x-3 mb-2 md:mb-0">
								<h3 class="font-semibold text-lg">คำสั่งซื้อ #{order.orderNumber}</h3>
								<div class="badge {getStatusBadge(order.status).color}">
									{getStatusBadge(order.status).label}
								</div>
							</div>
							<div class="text-sm text-base-content/70">
								<p>สั่งซื้อเมื่อ: {formatDate(order.orderDate)}</p>
								<p>คาดการณ์จัดส่ง: {formatDate(order.estimatedDelivery)}</p>
							</div>
						</div>

						<!-- Order Items -->
						<div class="space-y-3 mb-4">
							{#each order.items as item}
								<div class="flex items-center space-x-4 p-3 bg-base-50 rounded-lg">
									<div class="avatar">
										<div class="w-16 h-16 rounded-lg">
											<img src={item.image} alt={item.name} class="object-cover" />
										</div>
									</div>
									<div class="flex-1">
										<h4 class="font-medium">{item.name}</h4>
										<div class="text-sm text-base-content/70">
											<span>ขนาด: {item.size}</span>
											<span class="ml-4">จำนวน: {item.quantity}</span>
										</div>
									</div>
									<div class="text-right">
										<p class="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
									</div>
								</div>
							{/each}
						</div>

						<!-- Order Summary -->
						<div class="border-t pt-4">
							<div class="flex flex-col md:flex-row md:items-center md:justify-between">
								<div class="text-sm text-base-content/70 mb-2 md:mb-0">
									<p>ที่อยู่จัดส่ง: {order.shippingAddress}</p>
								</div>
								<div class="flex items-center space-x-4">
									<div class="text-right">
										<p class="text-sm text-base-content/70">ยอดรวม</p>
										<p class="text-xl font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
									</div>
									
									<!-- Action Buttons -->
									<div class="flex space-x-2">
										{#if order.status === 'pending'}
											<button 
												class="btn btn-sm btn-error btn-outline"
												on:click={() => updateOrderStatus(order.id, 'cancelled')}
											>
												ยกเลิก
											</button>
										{/if}
										
										{#if order.status === 'delivered'}
											<button class="btn btn-sm btn-primary btn-outline">
												รีวิว
											</button>
										{/if}
										
										<button class="btn btn-sm btn-ghost">
											ดูรายละเอียด
										</button>
									</div>
								</div>
							</div>
						</div>

						<!-- Order Timeline (for processing orders) -->
						{#if order.status === 'processing' || order.status === 'shipped'}
							<div class="border-t pt-4 mt-4">
								<h5 class="font-medium mb-3">สถานะการจัดส่ง</h5>
								<div class="steps steps-vertical lg:steps-horizontal">
									<div class="step step-primary">ยืนยันคำสั่งซื้อ</div>
									<div class="step {order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'step-primary' : ''}">เตรียมสินค้า</div>
									<div class="step {order.status === 'shipped' || order.status === 'delivered' ? 'step-primary' : ''}">จัดส่ง</div>
									<div class="step {order.status === 'delivered' ? 'step-primary' : ''}">ส่งมอบ</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Summary Stats -->
	<div class="stats shadow mt-8 w-full">
		<div class="stat">
			<div class="stat-figure text-primary">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
			</div>
			<div class="stat-title">คำสั่งซื้อทั้งหมด</div>
			<div class="stat-value text-primary">{purchaseList.length}</div>
		</div>
		
		<div class="stat">
			<div class="stat-figure text-secondary">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
				</svg>
			</div>
			<div class="stat-title">ยอดรวมทั้งหมด</div>
			<div class="stat-value text-secondary">
				{formatCurrency(purchaseList.reduce((total, order) => total + order.totalAmount, 0))}
			</div>
		</div>
		
		<div class="stat">
			<div class="stat-figure text-accent">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			</div>
			<div class="stat-title">ส่งมอบแล้ว</div>
			<div class="stat-value text-accent">
				{purchaseList.filter(order => order.status === 'delivered').length}
			</div>
		</div>
	</div>
</div>

<style>
	.steps-vertical .step::before {
		grid-row-start: 1;
		grid-row-end: 3;
		grid-column-start: 1;
		grid-column-end: 1;
		margin-inline-start: 0;
	}
</style>