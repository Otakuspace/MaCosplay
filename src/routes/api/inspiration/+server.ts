import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In-memory storage for inspiration items (in a real app, this would be a database)
let inspirationStore: Map<string, any[]> = new Map();

export const GET: RequestHandler = async ({ url, cookies }) => {
    try {
        // Get user ID from cookies or session (simplified for demo)
        const userId = cookies.get('userId') || 'demo_user';
        
        // Get user's inspiration items
        const userInspirations = inspirationStore.get(userId) || [];
        
        // Optional filtering
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('search');
        
        let filteredItems = userInspirations;
        
        if (category) {
            filteredItems = filteredItems.filter(item => 
                item.series === category || item.brand === category
            );
        }
        
        if (search) {
            const searchLower = search.toLowerCase();
            filteredItems = filteredItems.filter(item =>
                item.Name.toLowerCase().includes(searchLower) ||
                (item.Details && item.Details.toLowerCase().includes(searchLower))
            );
        }
        
        return json({
            success: true,
            data: filteredItems,
            total: filteredItems.length
        });
    } catch (error) {
        console.error('Error fetching inspiration items:', error);
        return json({
            success: false,
            error: 'Failed to fetch inspiration items'
        }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const userId = cookies.get('userId') || 'demo_user';
        const body = await request.json();
        
        // Validate required fields
        if (!body.item || !body.item.id) {
            return json({
                success: false,
                error: 'Invalid item data'
            }, { status: 400 });
        }
        
        // Get current user's inspiration items
        const userInspirations = inspirationStore.get(userId) || [];
        
        // Check if item already exists
        const existingIndex = userInspirations.findIndex(item => item.id === body.item.id);
        if (existingIndex !== -1) {
            return json({
                success: false,
                error: 'Item already in inspiration'
            }, { status: 409 });
        }
        
        // Add inspiration metadata
        const inspirationItem = {
            ...body.item,
            addedAt: new Date().toISOString(),
            inspirationId: `inspiration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        // Add to user's inspiration
        userInspirations.push(inspirationItem);
        inspirationStore.set(userId, userInspirations);
        
        return json({
            success: true,
            data: inspirationItem,
            message: 'Item added to inspiration successfully'
        });
    } catch (error) {
        console.error('Error adding inspiration item:', error);
        return json({
            success: false,
            error: 'Failed to add inspiration item'
        }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ url, cookies }) => {
    try {
        const userId = cookies.get('userId') || 'demo_user';
        const inspirationId = url.searchParams.get('inspirationId');
        
        if (!inspirationId) {
            return json({
                success: false,
                error: 'Inspiration ID is required'
            }, { status: 400 });
        }
        
        // Get current user's inspiration items
        const userInspirations = inspirationStore.get(userId) || [];
        
        // Remove the item
        const filteredItems = userInspirations.filter(item => item.inspirationId !== inspirationId);
        
        if (filteredItems.length === userInspirations.length) {
            return json({
                success: false,
                error: 'Inspiration item not found'
            }, { status: 404 });
        }
        
        // Update storage
        inspirationStore.set(userId, filteredItems);
        
        return json({
            success: true,
            message: 'Inspiration item removed successfully'
        });
    } catch (error) {
        console.error('Error removing inspiration item:', error);
        return json({
            success: false,
            error: 'Failed to remove inspiration item'
        }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
    try {
        const userId = cookies.get('userId') || 'demo_user';
        
        // Clear all inspiration items for the user
        inspirationStore.set(userId, []);
        
        return json({
            success: true,
            message: 'All inspiration items cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing inspiration items:', error);
        return json({
            success: false,
            error: 'Failed to clear inspiration items'
        }, { status: 500 });
    }
};