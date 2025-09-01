<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { RentalAvailabilityCheck } from '$lib/types/rental';
	import RentalAvailabilityBadge from './RentalAvailabilityBadge.svelte';

	export let outfitId: string;
	export let outfitName: string = '';

	let startDate = '';
	let endDate = '';
	let availability: RentalAvailabilityCheck | null = null;
	let loading = false;
	let error: string | null = null;

	const dispatch = createEventDispatcher<{
		availabilityChecked: RentalAvailabilityCheck;
		rentalRequested: { outfitId: string; startDate: string; endDate: string };
	}>();

	// Set default dates (next week)
	$: {
		const today = new Date();
		const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
		const nextWeekEnd = new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000);
		
		if (!startDate) {
			startDate = nextWeek.toISOString().split('T')[0];
		}
		if (!endDate) {
			endDate = nextWeekEnd.toISOString().split('T')[0];
		}
	}

	async function checkAvailability() {
		if (!startDate || !endDate) {
			error = 'กรุณาเลือกวันที่เริ่มต้นและสิ้นสุด';
			return;
		}

		if (new Date(startDate) >= new Date(endDate)) {
			error = 'วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น';
			return;
		}

		try {
			loading = true;
			error = null;

			const response = await fetch('/api/rental/check-availability', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					outfitId,
					startDate,
					endDate
				})
			});

			const result = await response.json();

			if (result.success) {
				availability = result.data;
				dispatch('availabilityChecked', availability);
			} else {
				error = result.message || 'เกิดข้อผิดพลาดในการตรวจสอบ';
			}
		} catch (err) {
			error = 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
			console.error('Error checking availability:', err);
		} finally {
			loading = false;
		}
	}

	function handleRentalRequest() {
		if (availability?.isAvailable) {
			dispatch('rentalRequested', {
				outfitId,
				startDate,
				endDate
			});
		}
	}

	function calculateDays() {
		if (!startDate || !endDate) return 0;
		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffTime = Math.abs(end.getTime() - start.getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
			</svg>
			ตรวจสอบความพร้อมในการเช่า
		</h2>

		{#if outfitName}
			<p class="text-sm text-gray-600 mb-4">ชุด: {outfitName}</p>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
			<div class="form-control">
				<label class="label">
					<span class="label-text">วันที่เริ่มต้น</span>
				</label>
				<input
					type="date"
					class="input input-bordered"
					bind:value={startDate}
					min={new Date().toISOString().split('T')[0]}
				/>
			</div>

			<div class="form-control">
				<label class="label">
					<span class="label-text">วันที่สิ้นสุด</span>
				</label>
				<input
					type="date"
					class="input input-bordered"
					bind:value={endDate}
					min={startDate || new Date().toISOString().split('T')[0]}
				/>
			</div>
		</div>

		{#if startDate && endDate}
			<div class="text-sm text-gray-600 mb-4">
				ระยะเวลาการเช่า: {calculateDays()} วัน
			</div>
		{/if}

		{#if error}
			<div class="alert alert-error mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>{error}</span>
			</div>
		{/if}

		<div class="card-actions justify-between">
			<button
				class="btn btn-primary"
				on:click={checkAvailability}
				disabled={loading || !startDate || !endDate}
			>
				{#if loading}
					<span class="loading loading-spinner loading-sm"></span>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				{/if}
				ตรวจสอบความพร้อม
			</button>

			{#if availability}
				<div class="flex items-center gap-2">
					<RentalAvailabilityBadge {availability} showDetails={true} />
					
					{#if availability.isAvailable}
						<button
							class="btn btn-success btn-sm"
							on:click={handleRentalRequest}
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
							</svg>
							เช่าตอนนี้
						</button>
					{/if}
				</div>
			{/if}
		</div>

		{#if availability && !availability.isAvailable && availability.conflictingRentals}
			<div class="mt-4 p-4 bg-base-200 rounded-lg">
				<h3 class="font-semibold mb-2">การเช่าที่ขัดแย้ง</h3>
				<div class="space-y-2">
					{@each availability.conflictingRentals as rental}
						<div class="text-sm">
							<div class="flex justify-between">
								<span>ผู้เช่า: {rental.expand?.renter?.name || 'ไม่ระบุ'}</span>
								<span class="text-gray-500">
									{new Date(rental.rentalPeriod.startDate).toLocaleDateString('th-TH')} - 
									{new Date(rental.rentalPeriod.endDate).toLocaleDateString('th-TH')}
								</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>