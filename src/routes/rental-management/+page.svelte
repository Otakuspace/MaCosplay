<script lang="ts">
	import { onMount } from 'svelte';
	import RentalAvailabilityChecker from '$lib/components/RentalAvailabilityChecker.svelte';
	import ShippingTracking from '$lib/components/ShippingTracking.svelte';
	import type { RentalAvailabilityCheck } from '$types/rental';

	let selectedOutfitId = '';
	let selectedTrackingNumber = '';
	let showShippingTracking = false;
	let recentAvailabilityChecks: RentalAvailabilityCheck[] = [];

	function handleAvailabilityChecked(event: CustomEvent<RentalAvailabilityCheck>) {
		const availability = event.detail;
		recentAvailabilityChecks = [availability, ...recentAvailabilityChecks.slice(0, 4)];
	}

	function handleRentalRequested(event: CustomEvent<{ outfitId: string; startDate: string; endDate: string }>) {
		const { outfitId, startDate, endDate } = event.detail;
		alert(`การขอเช่า: ชุด ${outfitId} วันที่ ${startDate} ถึง ${endDate}`);
		// Here you would typically redirect to a rental form or checkout page
	}

	function handleTrackingSearch() {
		if (selectedTrackingNumber) {
			showShippingTracking = true;
		}
	}

	// Demo outfit IDs for testing
	const demoOutfits = [
		{ id: 'anime-alya-001', name: 'Anime Alya Cosplay' },
		{ id: 'makima-cosplay-002', name: 'Makima Cosplay' },
		{ id: 'venti-outfit-003', name: 'Venti Outfit' }
	];
</script>

<svelte:head>
	<title>การจัดการการเช่า - MaCosplay</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-8">การจัดการการเช่าชุดคอสเพลย์</h1>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Rental Availability Checker -->
		<div>
			<h2 class="text-2xl font-semibold mb-4">ตรวจสอบความพร้อมในการเช่า</h2>
			
			<div class="mb-4">
				<label class="label">
					<span class="label-text">เลือกชุดคอสเพลย์</span>
				</label>
				<select class="select select-bordered w-full" bind:value={selectedOutfitId}>
					<option value="">เลือกชุดคอสเพลย์</option>
					{#each demoOutfits as outfit}
						<option value={outfit.id}>{outfit.name}</option>
					{/each}
				</select>
			</div>

			{#if selectedOutfitId}
				<RentalAvailabilityChecker
					outfitId={selectedOutfitId}
					outfitName={demoOutfits.find(o => o.id === selectedOutfitId)?.name || ''}
					on:availabilityChecked={handleAvailabilityChecked}
					on:rentalRequested={handleRentalRequested}
				/>
			{:else}
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body">
						<div class="text-center text-gray-500">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
							</svg>
							<p>กรุณาเลือกชุดคอสเพลย์เพื่อตรวจสอบความพร้อม</p>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Shipping Tracking -->
		<div>
			<h2 class="text-2xl font-semibold mb-4">ติดตามการจัดส่ง</h2>
			
			<div class="card bg-base-100 shadow-xl mb-4">
				<div class="card-body">
					<div class="flex gap-2">
						<input
							type="text"
							placeholder="ใส่เลขพัสดุหรือเลขที่คำสั่ง"
							class="input input-bordered flex-1"
							bind:value={selectedTrackingNumber}
						/>
						<button
							class="btn btn-primary"
							on:click={handleTrackingSearch}
							disabled={!selectedTrackingNumber}
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
							ค้นหา
						</button>
					</div>
				</div>
			</div>

			{#if showShippingTracking && selectedTrackingNumber}
				<ShippingTracking trackingNumber={selectedTrackingNumber} />
			{:else if !selectedTrackingNumber}
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body">
						<div class="text-center text-gray-500">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
							</svg>
							<p>กรุณาใส่เลขพัสดุหรือเลขที่คำสั่งเพื่อติดตามการจัดส่ง</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Recent Availability Checks -->
	{#if recentAvailabilityChecks.length > 0}
		<div class="mt-8">
			<h2 class="text-2xl font-semibold mb-4">การตรวจสอบล่าสุด</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each recentAvailabilityChecks as check}
					<div class="card bg-base-100 shadow-xl">
						<div class="card-body">
							<h3 class="card-title text-sm">
								ชุด: {demoOutfits.find(o => o.id === check.outfitId)?.name || check.outfitId}
							</h3>
							<div class="text-xs text-gray-500 mb-2">
								{new Date(check.startDate).toLocaleDateString('th-TH')} - 
								{new Date(check.endDate).toLocaleDateString('th-TH')}
							</div>
							<div class="badge {check.isAvailable ? 'badge-success' : 'badge-error'}">
								{check.isAvailable ? 'พร้อมเช่า' : 'ไม่พร้อมเช่า'}
							</div>
							{#if check.maintenanceReason}
								<div class="text-xs text-gray-600 mt-2">
									{check.maintenanceReason}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Feature Information -->
	<div class="mt-8">
		<div class="alert alert-info">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			</svg>
			<div>
				<h3 class="font-bold">คุณสมบัติใหม่!</h3>
				<div class="text-sm">
					<p>• ตรวจสอบความพร้อมในการเช่าชุดคอสเพลย์ตามช่วงวันที่</p>
					<p>• ติดตามสถานะการจัดส่งแบบเรียลไทม์</p>
					<p>• แสดงข้อมูลการเช่าที่ขัดแย้งกัน</p>
					<p>• จัดการสถานะการบำรุงรักษาชุด</p>
				</div>
			</div>
		</div>
	</div>
</div>