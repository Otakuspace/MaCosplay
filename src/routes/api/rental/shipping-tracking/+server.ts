import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createAdminClient } from '$lib/pocketbase';
import type { ShippingUpdate, ShippingStatus } from '$types/rental';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const rentalOrderId = url.searchParams.get('rentalOrderId');
		const trackingNumber = url.searchParams.get('trackingNumber');

		if (!rentalOrderId && !trackingNumber) {
			return json(
				{ 
					success: false, 
					message: 'Either rentalOrderId or trackingNumber is required' 
				}, 
				{ status: 400 }
			);
		}

		const pb = await createAdminClient();

		let filter = '';
		if (rentalOrderId) {
			filter = `rentalOrderId = "${rentalOrderId}"`;
		} else if (trackingNumber) {
			filter = `trackingNumber = "${trackingNumber}"`;
		}

		// Get shipping updates
		const shippingUpdates = await pb.collection('shipping_updates').getList(1, 50, {
			filter,
			sort: '-timestamp'
		});

		// Get rental order details
		let rentalOrder = null;
		if (rentalOrderId) {
			try {
				rentalOrder = await pb.collection('rental_orders').getOne(rentalOrderId, {
					expand: 'outfit,renter,owner'
				});
			} catch (error) {
				console.warn('Rental order not found:', error);
			}
		}

		return json({
			success: true,
			data: {
				rentalOrder,
				shippingUpdates: shippingUpdates.items,
				latestUpdate: shippingUpdates.items[0] || null
			}
		});

	} catch (error) {
		console.error('Error fetching shipping tracking:', error);
		return json(
			{ 
				success: false, 
				message: 'Internal server error' 
			}, 
			{ status: 500 }
		);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { 
			rentalOrderId, 
			status, 
			location, 
			description, 
			trackingNumber 
		} = await request.json();

		if (!rentalOrderId || !status || !description) {
			return json(
				{ 
					success: false, 
					message: 'Missing required fields: rentalOrderId, status, description' 
				}, 
				{ status: 400 }
			);
		}

		const pb = await createAdminClient();

		// Create shipping update
		const shippingUpdate = await pb.collection('shipping_updates').create({
			rentalOrderId,
			status,
			location,
			description,
			timestamp: new Date().toISOString(),
			trackingNumber
		});

		// Update rental order shipping status
		try {
			await pb.collection('rental_orders').update(rentalOrderId, {
				shippingStatus: status,
				trackingNumber: trackingNumber || undefined
			});
		} catch (error) {
			console.warn('Failed to update rental order shipping status:', error);
		}

		return json({
			success: true,
			data: shippingUpdate
		});

	} catch (error) {
		console.error('Error creating shipping update:', error);
		return json(
			{ 
				success: false, 
				message: 'Internal server error' 
			}, 
			{ status: 500 }
		);
	}
};