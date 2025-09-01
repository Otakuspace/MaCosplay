import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createAdminClient } from '$lib/pocketbase';

// PATCH - Update cart item (quantity, size, etc.)
export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const pb = await createAdminClient();
		const updateData = await request.json();

		// First, verify the cart item belongs to the current user
		const existingItem = await pb.collection('shopping_cart').getOne(params.id);
		if (existingItem.user !== locals.user.id) {
			throw error(403, 'Access denied');
		}

		// Validate quantity if provided
		if (updateData.quantity !== undefined && updateData.quantity < 1) {
			throw error(400, 'Quantity must be at least 1');
		}

		// Update the cart item
		const updatedItem = await pb.collection('shopping_cart').update(params.id, updateData);

		return json({
			success: true,
			data: updatedItem
		});
	} catch (err) {
		if (err.status === 404) {
			throw error(404, 'Cart item not found');
		}
		console.error('Error updating cart item:', err);
		throw error(500, 'Failed to update cart item');
	}
};

// DELETE - Remove item from cart
export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const pb = await createAdminClient();

		// First, verify the cart item belongs to the current user
		const existingItem = await pb.collection('shopping_cart').getOne(params.id);
		if (existingItem.user !== locals.user.id) {
			throw error(403, 'Access denied');
		}

		// Delete the cart item
		await pb.collection('shopping_cart').delete(params.id);

		return json({
			success: true,
			message: 'Item removed from cart'
		});
	} catch (err) {
		if (err.status === 404) {
			throw error(404, 'Cart item not found');
		}
		console.error('Error removing cart item:', err);
		throw error(500, 'Failed to remove cart item');
	}
};