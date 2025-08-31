import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
    try {
        // Get user ID from cookies or session
        const userId = cookies.get('userId') || 'demo_user';
        
        // In a real app, you would fetch from database
        // For now, return common categories
        const categories = [
            { id: 'anime', name: 'Anime', count: 0 },
            { id: 'game', name: 'Game', count: 0 },
            { id: 'movie', name: 'Movie', count: 0 },
            { id: 'original', name: 'Original Character', count: 0 },
            { id: 'historical', name: 'Historical', count: 0 },
            { id: 'fantasy', name: 'Fantasy', count: 0 }
        ];
        
        return json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return json({
            success: false,
            error: 'Failed to fetch categories'
        }, { status: 500 });
    }
};