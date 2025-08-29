/**
 * Image compression utility for faster uploads and loading
 */

export interface CompressionOptions {
	quality?: number; // 0.1 to 1.0
	maxWidth?: number;
	maxHeight?: number;
	format?: 'jpeg' | 'webp' | 'png';
}

export interface CompressedImage {
	file: File;
	blob: Blob;
	originalSize: number;
	compressedSize: number;
	compressionRatio: number;
}

/**
 * Compress an image file before upload
 */
export async function compressImage(
	file: File,
	options: CompressionOptions = {}
): Promise<CompressedImage> {
	const {
		quality = 0.8,
		maxWidth = 1920,
		maxHeight = 1080,
		format = 'jpeg'
	} = options;

	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const img = new Image();

		img.onload = () => {
			// Calculate new dimensions while maintaining aspect ratio
			let { width, height } = img;
			
			if (width > maxWidth || height > maxHeight) {
				const ratio = Math.min(maxWidth / width, maxHeight / height);
				width *= ratio;
				height *= ratio;
			}

			canvas.width = width;
			canvas.height = height;

			// Draw and compress image
			ctx?.drawImage(img, 0, 0, width, height);

			// Convert to blob with specified quality and format
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						reject(new Error('Failed to compress image'));
						return;
					}

					// Create new file with compressed data
					const compressedFile = new File([blob], file.name, {
						type: `image/${format}`,
						lastModified: Date.now()
					});

					const originalSize = file.size;
					const compressedSize = blob.size;
					const compressionRatio = (1 - compressedSize / originalSize) * 100;

					resolve({
						file: compressedFile,
						blob,
						originalSize,
						compressedSize,
						compressionRatio
					});
				},
				`image/${format}`,
				quality
			);
		};

		img.onerror = () => reject(new Error('Failed to load image'));
		img.src = URL.createObjectURL(file);
	});
}

/**
 * Compress multiple images
 */
export async function compressImages(
	files: File[],
	options: CompressionOptions = {}
): Promise<CompressedImage[]> {
	const promises = files.map(file => compressImage(file, options));
	return Promise.all(promises);
}

/**
 * Generate thumbnail for preview
 */
export async function generateThumbnail(
	file: File,
	width: number = 200,
	height: number = 200
): Promise<string> {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const img = new Image();

		img.onload = () => {
			canvas.width = width;
			canvas.height = height;

			// Draw image maintaining aspect ratio
			const ratio = Math.min(width / img.width, height / img.height);
			const centerX = (width - img.width * ratio) / 2;
			const centerY = (height - img.height * ratio) / 2;

			ctx?.drawImage(
				img,
				centerX,
				centerY,
				img.width * ratio,
				img.height * ratio
			);

			resolve(canvas.toDataURL('image/jpeg', 0.8));
		};

		img.onerror = () => reject(new Error('Failed to generate thumbnail'));
		img.src = URL.createObjectURL(file);
	});
}

/**
 * Check if image needs compression
 */
export function shouldCompressImage(file: File, maxSizeMB: number = 2): boolean {
	return file.size > maxSizeMB * 1024 * 1024;
}

/**
 * Get optimal compression options based on file size
 */
export function getOptimalCompressionOptions(file: File): CompressionOptions {
	const sizeMB = file.size / (1024 * 1024);
	
	if (sizeMB > 5) {
		return { quality: 0.6, maxWidth: 1600, maxHeight: 900, format: 'jpeg' };
	} else if (sizeMB > 2) {
		return { quality: 0.7, maxWidth: 1920, maxHeight: 1080, format: 'jpeg' };
	} else if (sizeMB > 1) {
		return { quality: 0.8, maxWidth: 1920, maxHeight: 1080, format: 'jpeg' };
	} else {
		return { quality: 0.9, maxWidth: 1920, maxHeight: 1080, format: 'jpeg' };
	}
}

