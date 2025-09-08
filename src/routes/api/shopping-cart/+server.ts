import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createAdminClient } from '$lib/pocketbase';

// GET - Fetch user's shopping cart
export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const pb = await createAdminClient();

		// Fetch cart items with product details
		const cartItems = await pb.collection('shopping_cart').getList(1, 50, {
			filter: `user = "${locals.user.id}"`,
			sort: '-created',
			expand: 'product'
		});

		return json({
			success: true,
			data: cartItems.items
		});
	} catch (err) {
		console.error('Error fetching shopping cart:', err);
		
		// Check if it's a connection error
		if (err.message?.includes('fetch') || err.message?.includes('network') || err.message?.includes('ECONNREFUSED')) {
			throw error(503, 'Database service unavailable. Please try again later.');
		}
		
		// Check if it's an authentication error
		if (err.message?.includes('Failed to authenticate') || err.status === 401) {
			throw error(401, 'Authentication failed. Please check your credentials.');
		}
		
		// Check if it's a validation error
		if (err.status === 400) {
			throw error(400, err.message || 'Invalid request data');
		}
		
		throw error(500, 'Failed to fetch shopping cart');
	}
};

// POST - Add item to shopping cart
export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const pb = await createAdminClient();
		const itemData = await request.json();

		// Validate required fields
		if (!itemData.productId) {
			throw error(400, 'Product ID is required');
		}

		if (!itemData.quantity || itemData.quantity < 1) {
			throw error(400, 'Valid quantity is required');
		}

		// Ensure product exists - try both collections
		let productExists = false;
		let productCollection = null;
		try {
			await pb.collection('itemList').getOne(itemData.productId);
			productExists = true;
			productCollection = 'itemList';
		} catch (e) {
			try {
				await pb.collection('cosplay_products').getOne(itemData.productId);
				productExists = true;
				productCollection = 'cosplay_products';
			} catch (e2) {
				throw error(404, 'Product not found or unavailable');
			}
		}
		
		if (!productExists) {
			throw error(404, 'Product not found or unavailable');
		}

		// Check if item already exists in cart
		const existingItems = await pb.collection('shopping_cart').getList(1, 1, {
			filter: `user = "${locals.user.id}" && product = "${itemData.productId}" && size = "${itemData.size || ''}" && color = "${itemData.color || ''}"`
		});

		if (existingItems.items.length > 0) {
			// Update existing item quantity
			const existingItem = existingItems.items[0];
			const updatedItem = await pb.collection('shopping_cart').update(existingItem.id, {
				quantity: existingItem.quantity + itemData.quantity
			});

			return json({
				success: true,
				data: updatedItem,
				message: 'Cart item updated'
			});
		} else {
			// Create new cart item
			const cartItem = await pb.collection('shopping_cart').create({
				user: locals.user.id,
				product: itemData.productId,
				quantity: itemData.quantity,
				size: itemData.size || '',
				color: itemData.color || '',
				customizations: itemData.customizations || {}
			});

			return json({
				success: true,
				data: cartItem,
				message: 'Item added to cart'
			});
		}
	} catch (err) {
		console.error('Error adding to cart:', err);
		
		// Check if it's a connection error
		if (err.message?.includes('fetch') || err.message?.includes('network') || err.message?.includes('ECONNREFUSED')) {
			throw error(503, 'Database service unavailable. Please try again later.');
		}
		
		// Check if it's an authentication error
		if (err.message?.includes('Failed to authenticate') || err.status === 401) {
			throw error(401, 'Authentication failed. Please check your credentials.');
		}
		
		// Check if it's a validation error
		if (err.status === 400) {
			// Prefer PocketBase detailed validation messages if available
			let detailedMessage = undefined;
			const anyErr: any = err as any;
			const pbData = anyErr?.data;
			if (pbData?.message) {
				detailedMessage = pbData.message;
			} else if (pbData?.data && typeof pbData.data === 'object') {
				const fieldMessages: string[] = [];
				for (const [fieldName, fieldErr] of Object.entries(pbData.data)) {
					const msg = (fieldErr as any)?.message || (fieldErr as any)?.code || '';
					if (msg) fieldMessages.push(`${fieldName}: ${msg}`);
				}
				if (fieldMessages.length > 0) {
					detailedMessage = fieldMessages.join('; ');
				}
			}
			throw error(400, detailedMessage || anyErr?.message || 'Invalid request data');
		}
		
		throw error(500, 'Failed to add item to cart');
	}
};

// DELETE - Clear shopping cart
export const DELETE: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const pb = await createAdminClient();

		// Get all cart items for the user
		const cartItems = await pb.collection('shopping_cart').getList(1, 200, {
			filter: `user = "${locals.user.id}"`
		});

		// Delete all cart items
		for (const item of cartItems.items) {
			await pb.collection('shopping_cart').delete(item.id);
		}

		return json({
			success: true,
			message: 'Shopping cart cleared'
		});
	} catch (err) {
		console.error('Error clearing cart:', err);
		
		// Check if it's a connection error
		if (err.message?.includes('fetch') || err.message?.includes('network') || err.message?.includes('ECONNREFUSED')) {
			throw error(503, 'Database service unavailable. Please try again later.');
		}
		
		// Check if it's an authentication error
		if (err.message?.includes('Failed to authenticate') || err.status === 401) {
			throw error(401, 'Authentication failed. Please check your credentials.');
		}
		
		// Check if it's a validation error
		if (err.status === 400) {
			throw error(400, err.message || 'Invalid request data');
		}
		
		throw error(500, 'Failed to clear shopping cart');
	}
};