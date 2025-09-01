<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { RentalAvailabilityCheck } from '$lib/types/rental';

	export let availability: RentalAvailabilityCheck;
	export let showDetails = false;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const dispatch = createEventDispatcher<{
		checkAvailability: { outfitId: string; startDate: string; endDate: string };
	}>();

	function getStatusColor() {
		if (availability.maintenanceMode) return 'badge-error';
		if (availability.isAvailable) return 'badge-success';
		return 'badge-warning';
	}

	function getStatusText() {
		if (availability.maintenanceMode) return 'ไม่พร้อมเช่า';
		if (availability.isAvailable) return 'พร้อมเช่า';
		return 'ไม่ว่าง';
	}

	function getStatusIcon() {
		if (availability.maintenanceMode) return '🔧';
		if (availability.isAvailable) return '✅';
		return '⏳';
	}

	function handleCheckAvailability() {
		dispatch('checkAvailability', {
			outfitId: availability.outfitId,
			startDate: availability.startDate,
			endDate: availability.endDate
		});
	}
</script>

<div class="flex items-center gap-2">
	<div class="badge {getStatusColor()} badge-{size} gap-1">
		<span class="text-sm">{getStatusIcon()}</span>
		<span>{getStatusText()}</span>
	</div>

	{#if showDetails && availability.maintenanceReason}
		<div class="text-xs text-gray-500">
			{availability.maintenanceReason}
		</div>
	{/if}

	{#if showDetails && availability.conflictingRentals && availability.conflictingRentals.length > 0}
		<div class="text-xs text-gray-500">
			มีผู้เช่าอื่นในช่วงเวลานี้
		</div>
	{/if}

	<button
		class="btn btn-ghost btn-xs"
		on:click={handleCheckAvailability}
		title="ตรวจสอบความพร้อม"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
		</svg>
	</button>
</div>