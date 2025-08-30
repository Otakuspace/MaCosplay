// Image-related type definitions for the store system

export interface ImageInfo {
	path: string;
	url: string;
	type: 'main' | 'detail' | 'back' | 'side' | 'accessories' | 'full' | 'other';
}

export interface ImageCheckResponse {
	itemId: string;
	availableImages: ImageInfo[];
	count: number;
	timestamp: string;
}

export interface OutfitImage {
	path: string;
	alt?: string;
	isLocal?: boolean;
}

export interface ItemData {
	id: string;
	Name: string;
	Description: string;
	Price: number;
	OriginalPrice?: number;
	Size?: string;
	Gender?: string;
	Series?: string;
	Condition?: string;
	Images: string[];
	Image?: string; // Legacy single image field
}

export interface ShopData {
	id: string;
	name: string;
	description: string;
	location?: string;
	phone?: string;
	email?: string;
}

export interface StorePageData {
	itemList: ItemData[];
	userStore: ShopData;
}

// Image upload related types
export interface ImageUploadOptions {
	maxFileSize: number;
	allowedTypes: string[];
	maxFiles?: number;
}

export interface ImageUploadProgress {
	fileName: string;
	progress: number;
	status: 'pending' | 'uploading' | 'completed' | 'error';
}