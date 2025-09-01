import { redirect } from "@sveltejs/kit";

export const load = ({ locals, parent }) => {
	
	if (!locals.pb.authStore.isValid) {
		console.log('User is not authenticated, redirecting to login');
		redirect(307, '/login');
	}

	// Get data from parent layout
	return parent();
}