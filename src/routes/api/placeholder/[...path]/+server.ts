import { error } from '@sveltejs/kit';

export async function GET({ params, url }) {
	const path = params.path || '';
	const dimensions = path.match(/(\d+)\/(\d+)/);
	
	if (!dimensions) {
		throw error(400, 'Invalid image dimensions');
	}

	const [, width, height] = dimensions;
	const w = parseInt(width);
	const h = parseInt(height);

	// Create a simple placeholder image using canvas
	const canvas = `
		<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color:rgb(147,51,234);stop-opacity:1" />
					<stop offset="100%" style="stop-color:rgb(219,39,119);stop-opacity:1" />
				</linearGradient>
			</defs>
			<rect width="100%" height="100%" fill="url(#grad)"/>
			<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
				  fill="white" font-family="Arial, sans-serif" font-size="16" opacity="0.8">
				${w}×${h}
			</text>
			<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
				  fill="white" font-family="Arial, sans-serif" font-size="12" opacity="0.6">
				Cosplay Photo
			</text>
		</svg>
	`;

	return new Response(canvas, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=31536000'
		}
	});
}