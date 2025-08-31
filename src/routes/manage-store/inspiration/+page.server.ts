import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
    try {
        // In a real application, you would fetch inspiration data from your database
        // For now, we'll return empty data since we're using localStorage on the client side
        
        return {
            inspirationItems: [],
            meta: {
                total: 0,
                categories: []
            }
        };
    } catch (error) {
        console.error('Error loading inspiration data:', error);
        return {
            inspirationItems: [],
            meta: {
                total: 0,
                categories: []
            }
        };
    }
};