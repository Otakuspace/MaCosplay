import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createAdminClient } from '$lib/pocketbase';

// GET - Fetch user's purchase orders
export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const pb = await createAdminClient();
		
		// Get query parameters
		const page = parseInt(url.searchParams.get('page') || '1');
		const perPage = parseInt(url.searchParams.get('perPage') || '20');
		const status = url.searchParams.get('status');
		const sortBy = url.searchParams.get('sortBy') || '-created';

		// Build filter
		let filter = `user = "${locals.user.id}"`;
		if (status && status !== 'all') {
			filter += ` && status = "${status}"`;
		}

		// Fetch purchase orders with related items
		const orders = await pb.collection('purchase_orders').getList(page, perPage, {
			filter,
			sort: sortBy,
			expand: 'items,items.product'
		});

		return json({
			success: true,
			data: orders.items,
			totalItems: orders.totalItems,
			totalPages: orders.totalPages,
			page: orders.page,
			perPage: orders.perPage
		});
	} catch (err) {
		console.error('Error fetching purchase orders:', err);
		throw error(500, 'Failed to fetch purchase orders');
	}
};

// POST - Create new purchase order
export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const pb = await createAdminClient();
		const orderData = await request.json();

		// Validate required fields
		if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
			throw error(400, 'Order must contain at least one item');
		}

		if (!orderData.shippingAddress) {
			throw error(400, 'Shipping address is required');
		}

		// Generate order number
		const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

		// Create purchase items first
		const createdItems = [];
		for (const item of orderData.items) {
			const purchaseItem = await pb.collection('purchase_items').create({
				product: item.productId,
				productName: item.name,
				productImage: item.image,
				quantity: item.quantity,
				unitPrice: item.price,
				totalPrice: item.price * item.quantity,
				size: item.size,
				color: item.color,
				customizations: item.customizations || {}
			});
			createdItems.push(purchaseItem.id);
		}

		// Calculate total amount
		const totalAmount = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

		// Create purchase order
		const order = await pb.collection('purchase_orders').create({
			orderNumber,
			user: locals.user.id,
			items: createdItems,
			totalAmount,
			status: 'pending',
			shippingAddress: orderData.shippingAddress,
			estimatedDelivery: orderData.estimatedDelivery,
			notes: orderData.notes || ''
		});

		// Fetch the created order with expanded relations
		const createdOrder = await pb.collection('purchase_orders').getOne(order.id, {
			expand: 'items,items.product'
		});

		return json({
			success: true,
			data: createdOrder
		});
	} catch (err) {
		console.error('Error creating purchase order:', err);
		throw error(500, 'Failed to create purchase order');
	}
};