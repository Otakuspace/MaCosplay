import { json } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export const PUT = async ({ request, locals }) => {
    if (!locals.user.id) {
        throw redirect(302, '/login');
    }

    const adminClient = await createAdminClient();

    try {
        const { itemIds, public: isPublic } = await request.json();

        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return json({ error: 'Item IDs array is required' }, { status: 400 });
        }

        if (typeof isPublic !== 'boolean') {
            return json({ error: 'Public visibility boolean is required' }, { status: 400 });
        }

        // Update items visibility in batch
        const updatePromises = itemIds.map(id => 
            adminClient.collection('itemList').update(id, { public: isPublic })
        );

        await Promise.all(updatePromises);

        return json({ 
            message: `Successfully updated visibility for ${itemIds.length} items`,
            updatedCount: itemIds.length,
            public: isPublic
        }, { status: 200 });

    } catch (error) {
        console.error('Error bulk updating items visibility:', error);
        return json({ error: error.message }, { status: error.status || 500 });
    }
};