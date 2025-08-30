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
			// Generate different mock data based on outfit ID for demonstration
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
							// Item ID-based paths (will be checked dynamically)
							`${id}/main.jpg`,
							`${id}/detail1.jpg`,
							`${id}/detail2.jpg`,
							`${id}/back.jpg`,
							// Fallback images
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
							// Generic item ID-based paths
							`${id}/main.jpg`,
							`${id}/detail1.jpg`,
							`${id}/detail2.jpg`,
							`${id}/back.jpg`,
							// Fallback to example images
							'/images/Example/Anime_alya_cos.png',
							'/images/Example/MakimaCos.png',
							'/images/Example/VentiCos.png',
							'/images/Example/Anime_main.png'
						]
					};
				}
			};

			const mockOutfit = getOutfitData(outfitID);

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
