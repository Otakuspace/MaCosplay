import { json } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

export const POST = async ({ locals, request }) => {
    const adminClient = await createAdminClient();
    
    try {
        const formData = await request.formData();
        
        // Extract all necessary fields
        const image = formData.get('image');
        const name = formData.get('name');
        const desc = formData.get('details');
        const price = formData.get('price');
        const size = formData.get('size');
        const status = formData.get('status');
        const province = formData.get('province');
        const isPublic = formData.get('isPublic') === 'on';
        const userStore = formData.get('userStore');
        const price_pri = formData.get('price_pri');
        const price_test = formData.get('price_test');
        const isPriTest = formData.get('isPriTest') === 'price_pri_test';
        const tags = formData.get('tags');
        console.log(formData.get('isPriTest'))
        // Validate required fields
        if (!name || !price || !size || !status || !province) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }




        // Prepare item data
        const itemData = {
            Name: name,
            Desc: desc,
            price: price,
            Size: size,
            Status: status,
            Province: province,
            user: locals.user.id,
            Image: image instanceof File ? image : null,

            public: isPublic,
            userStore: userStore,
            price_pri: price_pri,
            price_test: price_test,
            isPriTest: isPriTest,
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []
        };




        // Create the item in PocketBase
        const record = await adminClient.collection('itemList').create(itemData);

        return json({
            message: 'Item created successfully',
            item: serializeNonPOJOs(record)
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating item:', error);
        return json({ error: error.message }, { status: error.status || 500 });
    }
};