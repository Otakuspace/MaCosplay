import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const itemId = url.searchParams.get('itemId');
	
	if (!itemId) {
		return json({ error: 'Item ID is required' }, { status: 400 });
	}

	// Validate item ID format
	const itemIdRegex = /^[a-zA-Z0-9_-]+$/;
	if (!itemIdRegex.test(itemId)) {
		return json({ error: 'Invalid item ID format' }, { status: 400 });
	}

	const potentialImages = [
		`${itemId}/main.jpg`,
		`${itemId}/main.png`,
		`${itemId}/detail1.jpg`,
		`${itemId}/detail1.png`,
		`${itemId}/detail2.jpg`,
		`${itemId}/detail2.png`,
		`${itemId}/back.jpg`,
		`${itemId}/back.png`,
		`${itemId}/side.jpg`,
		`${itemId}/side.png`,
		`${itemId}/accessories.jpg`,
		`${itemId}/accessories.png`,
		`${itemId}/full.jpg`,
		`${itemId}/full.png`
	];

	const availableImages = [];
	const baseUrl = 'https://file.macosplay.com/mxj3660ce5olheb';

	// Check each potential image
	for (const imagePath of potentialImages) {
		try {
			const imageUrl = `${baseUrl}/${imagePath}`;
			const response = await fetch(imageUrl, { 
				method: 'HEAD',
				// Add timeout to prevent hanging
				signal: AbortSignal.timeout(5000)
			});
			
			if (response.ok) {
				availableImages.push({
					path: imagePath,
					url: imageUrl,
					type: imagePath.includes('main') ? 'main' : 
						  imagePath.includes('detail') ? 'detail' :
						  imagePath.includes('back') ? 'back' :
						  imagePath.includes('side') ? 'side' :
						  imagePath.includes('accessories') ? 'accessories' :
						  imagePath.includes('full') ? 'full' : 'other'
				});
			}
		} catch (error) {
			// Silently continue if image check fails
			console.log(`Image check failed for ${imagePath}:`, error);
		}
	}

	return json({
		itemId,
		availableImages,
		count: availableImages.length,
		timestamp: new Date().toISOString()
	});
};