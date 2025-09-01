// Purchase List Types

export interface PurchaseItem {
	id: string;
	product: string; // Product ID reference
	productName: string;
	productImage?: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	size?: string;
	color?: string;
	customizations?: Record<string, any>;
	created: string;
	updated: string;
}

export interface PurchaseOrder {
	id: string;
	orderNumber: string;
	user: string; // User ID reference
	items: string[] | PurchaseItem[]; // Can be IDs or expanded items
	totalAmount: number;
	status: PurchaseOrderStatus;
	shippingAddress: string;
	estimatedDelivery?: string;
	trackingNumber?: string;
	notes?: string;
	created: string;
	updated: string;
	expand?: {
		items?: PurchaseItem[];
		user?: any;
	};
}

export type PurchaseOrderStatus = 
	| 'pending' 
	| 'confirmed' 
	| 'processing' 
	| 'shipped' 
	| 'delivered' 
	| 'cancelled';

export interface ShoppingCartItem {
	id: string;
	user: string; // User ID reference
	product: string; // Product ID reference
	quantity: number;
	size?: string;
	color?: string;
	customizations?: Record<string, any>;
	created: string;
	updated: string;
	expand?: {
		product?: Product;
		user?: any;
	};
}

export interface Product {
	id: string;
	name: string;
	description?: string;
	price: number;
	image?: string;
	images?: string[];
	category?: string;
	tags?: string[];
	sizes?: string[];
	colors?: string[];
	inStock: boolean;
	stockQuantity?: number;
	created: string;
	updated: string;
}

export interface CheckoutData {
	shippingAddress: string;
	notes?: string;
	paymentMethod?: string;
	specialInstructions?: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	totalItems: number;
	totalPages: number;
	page: number;
	perPage: number;
}

// Status configuration for UI
export interface StatusConfig {
	value: PurchaseOrderStatus;
	label: string;
	color: string;
	icon?: string;
}

export const STATUS_CONFIGS: StatusConfig[] = [
	{ value: 'pending', label: 'รอดำเนินการ', color: 'badge-warning' },
	{ value: 'confirmed', label: 'ยืนยันแล้ว', color: 'badge-info' },
	{ value: 'processing', label: 'กำลังเตรียม', color: 'badge-primary' },
	{ value: 'shipped', label: 'จัดส่งแล้ว', color: 'badge-secondary' },
	{ value: 'delivered', label: 'ส่งมอบแล้ว', color: 'badge-success' },
	{ value: 'cancelled', label: 'ยกเลิก', color: 'badge-error' }
];

// Helper functions
export function getStatusConfig(status: PurchaseOrderStatus): StatusConfig {
	return STATUS_CONFIGS.find(config => config.value === status) || 
		{ value: status, label: status, color: 'badge-neutral' };
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('th-TH', {
		style: 'currency',
		currency: 'THB'
	}).format(amount);
}

export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('th-TH', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}