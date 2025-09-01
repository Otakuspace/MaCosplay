import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createAdminClient } from '$lib/pocketbase';

// POST - Checkout (convert cart to purchase order)
export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const pb = await createAdminClient();
		const checkoutData = await request.json();

		// Validate required fields
		if (!checkoutData.shippingAddress) {
			throw error(400, 'Shipping address is required');
		}

		// Get user's cart items
		const cartItems = await pb.collection('shopping_cart').getList(1, 200, {
			filter: `user = "${locals.user.id}"`,
			expand: 'product'
		});

		if (cartItems.items.length === 0) {
			throw error(400, 'Cart is empty');
		}

		// Generate order number
		const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

		// Create purchase items from cart items
		const createdItems = [];
		let totalAmount = 0;

		for (const cartItem of cartItems.items) {
			const product = cartItem.expand?.product;
			if (!product) {
				throw error(400, `Product not found for cart item ${cartItem.id}`);
			}

			const itemTotal = product.price * cartItem.quantity;
			totalAmount += itemTotal;

			const purchaseItem = await pb.collection('purchase_items').create({
				product: cartItem.product,
				productName: product.name,
				productImage: product.image,
				quantity: cartItem.quantity,
				unitPrice: product.price,
				totalPrice: itemTotal,
				size: cartItem.size,
				color: cartItem.color,
				customizations: cartItem.customizations
			});

			createdItems.push(purchaseItem.id);
		}

		// Calculate estimated delivery (7 days from now)
		const estimatedDelivery = new Date();
		estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

		// Create purchase order
		const order = await pb.collection('purchase_orders').create({
			orderNumber,
			user: locals.user.id,
			items: createdItems,
			totalAmount,
			status: 'pending',
			shippingAddress: checkoutData.shippingAddress,
			estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
			notes: checkoutData.notes || ''
		});

		// Clear the shopping cart
		for (const cartItem of cartItems.items) {
			await pb.collection('shopping_cart').delete(cartItem.id);
		}

		// Fetch the created order with expanded relations
		const createdOrder = await pb.collection('purchase_orders').getOne(order.id, {
			expand: 'items,items.product'
		});

		return json({
			success: true,
			data: createdOrder,
			message: 'Order created successfully'
		});
	} catch (err) {
		console.error('Error during checkout:', err);
		throw error(500, 'Checkout failed');
	}
};