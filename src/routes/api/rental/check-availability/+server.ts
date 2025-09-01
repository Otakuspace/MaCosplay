import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createAdminClient } from '$lib/pocketbase';
import type { RentalAvailabilityCheck } from '$types/rental';
import { isDateRangeOverlapping } from '$types/rental';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { outfitId, startDate, endDate } = await request.json();

		if (!outfitId || !startDate || !endDate) {
			return json(
				{ 
					success: false, 
					message: 'Missing required fields: outfitId, startDate, endDate' 
				}, 
				{ status: 400 }
			);
		}

		const pb = await createAdminClient();

		// Get the outfit details
		const outfit = await pb.collection('itemList').getOne(outfitId);
		
		if (!outfit) {
			return json(
				{ 
					success: false, 
					message: 'Outfit not found' 
				}, 
				{ status: 404 }
			);
		}

		// Check if outfit is available for rent (Status field)
		if (outfit.Status !== 'พร้อมเช่า' && outfit.Status !== 'available') {
			return json({
				success: true,
				data: {
					outfitId,
					startDate,
					endDate,
					isAvailable: false,
					maintenanceMode: true,
					maintenanceReason: `Outfit is currently ${outfit.Status}`
				} as RentalAvailabilityCheck
			});
		}

		// Check for conflicting rentals in the date range
		// Note: This assumes you have a rental_orders collection
		// You'll need to create this collection in PocketBase
		try {
			const conflictingRentals = await pb.collection('rental_orders').getList(1, 50, {
				filter: `outfitId = "${outfitId}" && status != "cancelled" && status != "completed"`,
				expand: 'outfit,renter'
			});

			const hasConflict = conflictingRentals.items.some(rental => {
				return isDateRangeOverlapping(
					startDate,
					endDate,
					rental.rentalPeriod.startDate,
					rental.rentalPeriod.endDate
				);
			});

			if (hasConflict) {
				const conflictingRentalsList = conflictingRentals.items.filter(rental => {
					return isDateRangeOverlapping(
						startDate,
						endDate,
						rental.rentalPeriod.startDate,
						rental.rentalPeriod.endDate
					);
				});

				return json({
					success: true,
					data: {
						outfitId,
						startDate,
						endDate,
						isAvailable: false,
						conflictingRentals: conflictingRentalsList
					} as RentalAvailabilityCheck
				});
			}

			// Check if outfit is in maintenance mode
			try {
				const availability = await pb.collection('rental_availability').getFirstListItem(
					`outfitId = "${outfitId}"`
				);

				if (availability.maintenanceMode) {
					return json({
						success: true,
						data: {
							outfitId,
							startDate,
							endDate,
							isAvailable: false,
							maintenanceMode: true,
							maintenanceReason: availability.maintenanceReason || 'Outfit is under maintenance'
						} as RentalAvailabilityCheck
					});
				}
			} catch (error) {
				// No availability record found, assume available
			}

			// If we get here, the outfit is available
			return json({
				success: true,
				data: {
					outfitId,
					startDate,
					endDate,
					isAvailable: true
				} as RentalAvailabilityCheck
			});

		} catch (error) {
			// If rental_orders collection doesn't exist yet, assume available
			console.warn('Rental orders collection not found, assuming availability:', error);
			
			return json({
				success: true,
				data: {
					outfitId,
					startDate,
					endDate,
					isAvailable: true
				} as RentalAvailabilityCheck
			});
		}

	} catch (error) {
		console.error('Error checking rental availability:', error);
		return json(
			{ 
				success: false, 
				message: 'Internal server error' 
			}, 
			{ status: 500 }
		);
	}
};