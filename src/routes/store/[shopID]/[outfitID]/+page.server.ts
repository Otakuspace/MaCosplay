import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	// Cache busting for development - remove in production
	console.log(`[${new Date().toISOString()}] Loading outfit: ${params.outfitID} from shop: ${params.shopID}`);
	
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
			// Mock data for demonstration - replace with actual API calls later
			const mockOutfit = {
				id: outfitID,
				Name: `Cosplay Outfit ${outfitID}`,
				Description: 'This is a beautiful cosplay outfit with high-quality materials and excellent craftsmanship. Perfect for conventions and photo shoots.',
				Price: 2500,
				OriginalPrice: 3000,
				Size: 'M',
				Gender: 'Female',
				Series: 'Anime Series',
				Condition: 'New',
				Images: [
					'/images/Example/Anime_alya_cos.png',
					'/images/Example/MakimaCos.png',
					'/images/Example/VentiCos.png',
					'/images/Example/Anime_main.png'
				]
			};

		const mockShop = {
			id: shopID,
			name: `Cosplay Shop ${shopID}`,
			description: 'Professional cosplay shop specializing in high-quality costumes and accessories. We create custom designs and offer worldwide shipping.',
			location: 'Bangkok, Thailand',
			phone: '+66 2 123 4567',
			email: 'info@cosplayshop.com'
		};

		return {
			itemList: [mockOutfit],
			userStore: mockShop
		};
	} catch (err) {
		console.error('Error in store outfit page:', err);
		throw error(500, 'Internal server error');
	}
};
