import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	// Check if user is authenticated
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	try {
		// TODO: Replace with actual PocketBase API calls
		// Example implementation:
		/*
		const purchaseList = await locals.pb.collection('purchaseList').getList(1, 50, {
			filter: `user = "${locals.user.id}"`,
			sort: '-created',
			expand: 'items'
		});

		return {
			purchaseList: purchaseList.items,
			user: locals.user
		};
		*/

		// For now, return empty data structure
		return {
			purchaseList: [],
			user: locals.user
		};
	} catch (err) {
		console.error('Error loading purchase list:', err);
		throw error(500, 'Failed to load purchase list');
	}
};