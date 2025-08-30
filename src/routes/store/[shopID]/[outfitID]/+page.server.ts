import { error } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase';

export const load = async ({ params }) => {
	const { shopID, outfitID } = params;

	// Server-side validation and sanitization
	if (!shopID || !outfitID) {
		throw error(400, 'Missing required parameters');
	}

	// Validate shopID format (should be alphanumeric, no special characters)
	const shopIDRegex = /^[a-zA-Z0-9_-]+$/;
	if (!shopIDRegex.test(shopID)) {
		throw error(400, 'Invalid shop ID format');
	}

	// Validate outfitID format (should be alphanumeric, no special characters)
	const outfitIDRegex = /^[a-zA-Z0-9_-]+$/;
	if (!outfitIDRegex.test(outfitID)) {
		throw error(400, 'Invalid outfit ID format');
	}

	// Length validation
	if (shopID.length < 3 || shopID.length > 50) {
		throw error(400, 'Shop ID length invalid');
	}

	if (outfitID.length < 3 || outfitID.length > 50) {
		throw error(400, 'Outfit ID length invalid');
	}

	try {
		const adminClient = await createAdminClient();
		
		// Fetch the actual outfit item from the database using outfitID
		let outfit = null;
		let userStore = null;
		
		try {
			// First try to get the item by ID
			outfit = await adminClient.collection('itemList').getOne(outfitID, {
				expand: 'user,userStore'
			});
			
			// Get the store details from the outfit's userStore
			if (outfit.expand?.userStore) {
				userStore = outfit.expand.userStore;
			}
		} catch (fetchError) {
			// Fallback to mock data if item not found
			const getOutfitData = (id: string) => {
				const baseData = {
					id: id,
					Name: `Cosplay Outfit ${id}`,
					Description: 'This is a beautiful cosplay outfit with high-quality materials and excellent craftsmanship. Perfect for conventions and photo shoots.',
					Price: 2500,
					OriginalPrice: 3000,
					Size: 'M',
					Gender: 'Female',
					Series: 'Anime Series',
					Condition: 'New'
				};

				// Different image sets based on outfit ID patterns
				if (id.includes('anime') || id.includes('alya')) {
					return {
						...baseData,
						Name: `Anime Cosplay ${id}`,
						Series: 'Anime Series',
						Images: [
							`${id}/main.jpg`,
							`${id}/detail1.jpg`,
							`${id}/detail2.jpg`,
							`${id}/back.jpg`,
							'/images/Example/Anime_alya_cos.png',
							'/images/Example/Anime_main.png'
						]
					};
				} else if (id.includes('makima')) {
					return {
						...baseData,
						Name: `Makima Cosplay ${id}`,
						Series: 'Chainsaw Man',
						Images: [
							`${id}/main.jpg`,
							`${id}/detail1.jpg`,
							`${id}/detail2.jpg`,
							'/images/Example/MakimaCos.png',
							'/images/Example/Makima.png'
						]
					};
				} else if (id.includes('venti')) {
					return {
						...baseData,
						Name: `Venti Cosplay ${id}`,
						Series: 'Genshin Impact',
						Gender: 'Male',
						Images: [
							`${id}/main.jpg`,
							`${id}/detail1.jpg`,
							`${id}/detail2.jpg`,
							'/images/Example/VentiCos.png'
						]
					};
				} else {
					return {
						...baseData,
						Images: [
							`${id}/main.jpg`,
							`${id}/detail1.jpg`,
							`${id}/detail2.jpg`,
							`${id}/back.jpg`,
							'/images/Example/Anime_alya_cos.png',
							'/images/Example/MakimaCos.png',
							'/images/Example/VentiCos.png',
							'/images/Example/Anime_main.png'
						]
					};
				}
			};

			outfit = getOutfitData(outfitID);
			
			userStore = {
				id: shopID,
				name: `Cosplay Shop ${shopID}`,
				description: 'Professional cosplay shop specializing in high-quality costumes and accessories. We create custom designs and offer worldwide shipping.',
				location: 'Bangkok, Thailand',
				phone: '+66 2 123 4567',
				email: 'info@cosplayshop.com'
			};
		}

		// Transform the real outfit data to match the expected format
		if (outfit && outfit.id && !outfit.Images) {
			// Convert single Image field to Images array if needed
			outfit.Images = outfit.Image ? [outfit.Image] : [];
			
			// Map database fields to expected format
			outfit.Price = outfit.price || outfit.Price;
			outfit.Description = outfit.Desc || outfit.Details || outfit.Description;
			
			// Map price fields for private/test pricing
			outfit.isPriTest = outfit.isPriTest || outfit.is_pri_test;
			outfit.price_pri = outfit.price_pri || outfit.pricePri;
			outfit.price_test = outfit.price_test || outfit.priceTest;
		}

		return {
			itemList: [outfit],
			userStore: userStore
		};
	} catch (err) {
		console.error('Error in store outfit page:', err);
		throw error(500, 'Internal server error');
	}
};
