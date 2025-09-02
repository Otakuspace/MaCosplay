import { error } from "@sveltejs/kit";
import { serializeNonPOJOs } from "$lib/utils";
import { createAdminClient } from '$lib/pocketbase';

export const load = async ({ locals }) => {
	try {
		// If no user is authenticated, return basic data
		if (!locals.user) {
			console.log("User is not defined");
			return {
				user: undefined,
				userStore: []
			};
		}

		const adminClient = await createAdminClient();

		const user = await adminClient.collection('users').getOne(locals.user.id);
		if (user.Upgrade === 1) {
			await adminClient.collection('users').update(locals.user.id, {
				VerifyShop: "ยืนยันร้านค้าแล้ว"
			});
		}

		// Get user instances
		let userStore = [];
		try {
			const instances = await adminClient.collection('userStore').getFullList({
				filter: `user = "${locals.user.id}"`
			});
			userStore = serializeNonPOJOs(instances);
		} catch (err) {
			console.error('Error fetching user instances:', err);
			// Don't throw error here, just return empty array
		}

		return {
			user: locals.user,
			userStore
		};
	} catch (err) {
		console.error('Error in layout load function:', err);
		// Return basic data instead of throwing error
		return {
			user: undefined,
			userStore: []
		};
	}
};