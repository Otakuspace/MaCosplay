import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createAdminClient } from '$lib/pocketbase';

// GET - Fetch specific purchase order
export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const pb = await createAdminClient();
		
		// Fetch the order with expanded relations
		const order = await pb.collection('purchase_orders').getOne(params.id, {
			expand: 'items,items.product'
		});

		// Verify the order belongs to the current user
		if (order.user !== locals.user.id) {
			throw error(403, 'Access denied');
		}

		return json({
			success: true,
			data: order
		});
	} catch (err) {
		if (err.status === 404) {
			throw error(404, 'Order not found');
		}
		console.error('Error fetching purchase order:', err);
		throw error(500, 'Failed to fetch purchase order');
	}
};

// PATCH - Update purchase order (status, shipping info, etc.)
export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const pb = await createAdminClient();
		const updateData = await request.json();

		// First, verify the order belongs to the current user
		const existingOrder = await pb.collection('purchase_orders').getOne(params.id);
		if (existingOrder.user !== locals.user.id) {
			throw error(403, 'Access denied');
		}

		// Restrict what users can update
		const allowedFields = ['shippingAddress', 'notes'];
		const filteredData = {};
		
		for (const field of allowedFields) {
			if (updateData[field] !== undefined) {
				filteredData[field] = updateData[field];
			}
		}

		// Allow status updates only for certain transitions
		if (updateData.status) {
			const allowedStatusTransitions = {
				'pending': ['cancelled'],
				'confirmed': [],
				'processing': [],
				'shipped': [],
				'delivered': [],
				'cancelled': []
			};

			if (allowedStatusTransitions[existingOrder.status]?.includes(updateData.status)) {
				filteredData.status = updateData.status;
			}
		}

		// Update the order
		const updatedOrder = await pb.collection('purchase_orders').update(params.id, filteredData);

		// Fetch the updated order with expanded relations
		const order = await pb.collection('purchase_orders').getOne(params.id, {
			expand: 'items,items.product'
		});

		return json({
			success: true,
			data: order
		});
	} catch (err) {
		if (err.status === 404) {
			throw error(404, 'Order not found');
		}
		console.error('Error updating purchase order:', err);
		throw error(500, 'Failed to update purchase order');
	}
};

// DELETE - Cancel/Delete purchase order (only if pending)
export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const pb = await createAdminClient();

		// First, verify the order belongs to the current user and is cancellable
		const existingOrder = await pb.collection('purchase_orders').getOne(params.id);
		
		if (existingOrder.user !== locals.user.id) {
			throw error(403, 'Access denied');
		}

		if (existingOrder.status !== 'pending') {
			throw error(400, 'Only pending orders can be cancelled');
		}

		// Update status to cancelled instead of deleting
		await pb.collection('purchase_orders').update(params.id, {
			status: 'cancelled'
		});

		return json({
			success: true,
			message: 'Order cancelled successfully'
		});
	} catch (err) {
		if (err.status === 404) {
			throw error(404, 'Order not found');
		}
		console.error('Error cancelling purchase order:', err);
		throw error(500, 'Failed to cancel purchase order');
	}
};