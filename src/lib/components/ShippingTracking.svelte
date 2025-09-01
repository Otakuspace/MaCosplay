<script lang="ts">
	import { onMount } from 'svelte';
	import type { ShippingUpdate, RentalOrder, ShippingStatus } from '$lib/types/rental';
	import { getShippingStatusConfig, formatDateTime } from '$lib/types/rental';

	export let rentalOrderId: string;
	export let trackingNumber: string | undefined = undefined;

	let shippingUpdates: ShippingUpdate[] = [];
	let rentalOrder: RentalOrder | null = null;
	let loading = true;
	let error: string | null = null;

	async function fetchShippingTracking() {
		try {
			loading = true;
			error = null;

			const params = new URLSearchParams();
			if (rentalOrderId) params.append('rentalOrderId', rentalOrderId);
			if (trackingNumber) params.append('trackingNumber', trackingNumber);

			const response = await fetch(`/api/rental/shipping-tracking?${params}`);
			const result = await response.json();

			if (result.success) {
				shippingUpdates = result.data.shippingUpdates || [];
				rentalOrder = result.data.rentalOrder;
			} else {
				error = result.message || 'Failed to fetch shipping tracking';
			}
		} catch (err) {
			error = 'Network error occurred';
			console.error('Error fetching shipping tracking:', err);
		} finally {
			loading = false;
		}
	}

	function getStatusIcon(status: ShippingStatus) {
		switch (status) {
			case 'pending':
				return '⏳';
			case 'label_created':
				return '🏷️';
			case 'picked_up':
				return '📦';
			case 'in_transit':
				return '🚚';
			case 'out_for_delivery':
				return '🚛';
			case 'delivered':
				return '✅';
			case 'return_to_sender':
				return '↩️';
			case 'exception':
				return '⚠️';
			default:
				return '📋';
		}
	}

	onMount(() => {
		fetchShippingTracking();
	});

	$: if (rentalOrderId || trackingNumber) {
		fetchShippingTracking();
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
			</svg>
			การติดตามการจัดส่ง
		</h2>

		{#if rentalOrder}
			<div class="mb-4 p-4 bg-base-200 rounded-lg">
				<h3 class="font-semibold mb-2">รายละเอียดการเช่า</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
					<div>
						<span class="font-medium">เลขที่คำสั่ง:</span> {rentalOrder.orderNumber}
					</div>
					<div>
						<span class="font-medium">สถานะ:</span> 
						<span class="badge badge-sm {getShippingStatusConfig(rentalOrder.shippingStatus).color}">
							{getShippingStatusConfig(rentalOrder.shippingStatus).label}
						</span>
					</div>
					{#if rentalOrder.trackingNumber}
						<div>
							<span class="font-medium">เลขพัสดุ:</span> {rentalOrder.trackingNumber}
						</div>
					{/if}
					{#if rentalOrder.estimatedDelivery}
						<div>
							<span class="font-medium">วันที่คาดว่าจะได้รับ:</span> {formatDateTime(rentalOrder.estimatedDelivery)}
						</div>
					{/if}
				</div>
			</div>
		{/if}

		{#if loading}
			<div class="flex justify-center items-center py-8">
				<span class="loading loading-spinner loading-lg"></span>
				<span class="ml-2">กำลังโหลด...</span>
			</div>
		{:else if error}
			<div class="alert alert-error">
				<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>{error}</span>
			</div>
		{:else if shippingUpdates.length === 0}
			<div class="text-center py-8 text-gray-500">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<p>ยังไม่มีข้อมูลการติดตาม</p>
			</div>
		{:else}
			<div class="space-y-4">
				{@each shippingUpdates as update, index}
					<div class="flex items-start space-x-4">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center">
								<span class="text-sm">{getStatusIcon(update.status)}</span>
							</div>
							{#if index < shippingUpdates.length - 1}
								<div class="w-0.5 h-8 bg-base-300 mx-auto mt-2"></div>
							{/if}
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between">
								<h4 class="text-sm font-medium">
									{getShippingStatusConfig(update.status).label}
								</h4>
								<span class="text-xs text-gray-500">
									{formatDateTime(update.timestamp)}
								</span>
							</div>
							<p class="text-sm text-gray-600 mt-1">
								{update.description}
							</p>
							{#if update.location}
								<p class="text-xs text-gray-500 mt-1">
									📍 {update.location}
								</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<div class="card-actions justify-end mt-4">
			<button 
				class="btn btn-primary btn-sm" 
				on:click={fetchShippingTracking}
				disabled={loading}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
				</svg>
				อัพเดท
			</button>
		</div>
	</div>
</div>