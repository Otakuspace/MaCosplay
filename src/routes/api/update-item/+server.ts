import { json } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export const PUT = async ({ request, locals }) => {

    if(!locals.user.id){
        throw redirect(302, '/login');
    }

    const adminClient = await createAdminClient();
    
    try {
        const formData = await request.formData();
        const id = formData.get('id');
        const image = formData.get('image');
        const name = formData.get('name');
        const desc = formData.get('details');
        const price = formData.get('price');
        const size = formData.get('size');
        const status = formData.get('status');
        const province = formData.get('province');
        const isPublic = formData.get('isPublic') === 'on';
        const price_pri = formData.get('price_pri');
        const price_test = formData.get('price_test');
        const isPriTest = formData.get('isPriTest') === 'price_pri_test';
        const tags = formData.get('tags');
        console.log(formData.get('isPriTest'))



        if (!id) {
            return json({ error: 'Item ID is required' }, { status: 400 });
        }

        // Fetch existing item
        const existingItem = await adminClient.collection('itemList').getOne(id);

        // Prepare update data
        const updateData = {
            Name: name,
            Desc: desc,
            price: price,
            Size: size,
            Status: status,
            Province: province,
            public: isPublic,
            price_pri: price_pri,
            price_test: price_test,
            isPriTest: isPriTest,
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []
        };



        console.log(updateData)

        // Include image if it's a File and not null
        if (image instanceof File && image.size > 0) {
            updateData.Image = image;
        }

        // Check for changes
        const hasChanges = Object.keys(updateData).some(key => updateData[key] !== existingItem[key]);

        if (!hasChanges) {
            return json({ message: 'No changes detected' }, { status: 200 });
        }

        // Update item
        const updatedItem = await locals.pb.collection('itemList').update(id, updateData);
        return json(updatedItem, { status: 200 });


    } catch (error) {
        console.error('Error updating item:', error);
        return json({ error: error.message }, { status: error.status || 500 });
    }
};

function serializeNonPOJOs(obj) {
    return structuredClone(obj);
}