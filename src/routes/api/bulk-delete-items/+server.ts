import { json } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export const DELETE = async ({ request, locals }) => {
    if (!locals.user.id) {
        throw redirect(302, '/login');
    }

    const adminClient = await createAdminClient();

    try {
        const { itemIds } = await request.json();

        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return json({ error: 'Item IDs array is required' }, { status: 400 });
        }

        // Delete items in batch
        const deletePromises = itemIds.map(id => 
            adminClient.collection('itemList').delete(id)
        );

        await Promise.all(deletePromises);

        return json({ 
            message: `Successfully deleted ${itemIds.length} items`,
            deletedCount: itemIds.length 
        }, { status: 200 });

    } catch (error) {
        console.error('Error bulk deleting items:', error);
        return json({ error: error.message }, { status: error.status || 500 });
    }
};