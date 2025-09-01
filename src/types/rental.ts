// Rental Types for Cosplay Outfits

export interface RentalPeriod {
	id: string;
	startDate: string;
	endDate: string;
	created: string;
	updated: string;
}

export interface RentalAvailability {
	id: string;
	outfitId: string; // Reference to ItemList
	isAvailable: boolean;
	availableFrom?: string;
	availableUntil?: string;
	currentRental?: string; // Reference to active rental
	maintenanceMode: boolean;
	maintenanceReason?: string;
	created: string;
	updated: string;
	expand?: {
		outfit?: any;
		currentRental?: RentalOrder;
	};
}

export interface RentalOrder {
	id: string;
	orderNumber: string;
	outfitId: string; // Reference to ItemList
	renterId: string; // Reference to Users
	ownerId: string; // Reference to Users (shop owner)
	rentalPeriod: RentalPeriod;
	totalAmount: number;
	depositAmount?: number;
	status: RentalOrderStatus;
	shippingAddress: string;
	shippingMethod: 'pickup' | 'delivery' | 'meetup';
	estimatedDelivery?: string;
	trackingNumber?: string;
	shippingStatus: ShippingStatus;
	notes?: string;
	created: string;
	updated: string;
	expand?: {
		outfit?: any;
		renter?: any;
		owner?: any;
		shippingUpdates?: ShippingUpdate[];
	};
}

export type RentalOrderStatus = 
	| 'pending' 
	| 'confirmed' 
	| 'preparing' 
	| 'shipped' 
	| 'delivered' 
	| 'in_use' 
	| 'returning' 
	| 'returned' 
	| 'completed' 
	| 'cancelled';

export type ShippingStatus = 
	| 'pending' 
	| 'label_created' 
	| 'picked_up' 
	| 'in_transit' 
	| 'out_for_delivery' 
	| 'delivered' 
	| 'return_to_sender' 
	| 'exception';

export interface ShippingUpdate {
	id: string;
	rentalOrderId: string;
	status: ShippingStatus;
	location?: string;
	description: string;
	timestamp: string;
	trackingNumber?: string;
	created: string;
}

export interface RentalAvailabilityCheck {
	outfitId: string;
	startDate: string;
	endDate: string;
	isAvailable: boolean;
	conflictingRentals?: RentalOrder[];
	maintenanceMode?: boolean;
	maintenanceReason?: string;
}

// Status configuration for UI
export interface RentalStatusConfig {
	value: RentalOrderStatus;
	label: string;
	color: string;
	icon?: string;
	description?: string;
}

export const RENTAL_STATUS_CONFIGS: RentalStatusConfig[] = [
	{ value: 'pending', label: 'รอดำเนินการ', color: 'badge-warning', description: 'รอการยืนยันจากเจ้าของ' },
	{ value: 'confirmed', label: 'ยืนยันแล้ว', color: 'badge-info', description: 'การเช่าถูกยืนยันแล้ว' },
	{ value: 'preparing', label: 'กำลังเตรียม', color: 'badge-primary', description: 'กำลังเตรียมชุดคอสเพลย์' },
	{ value: 'shipped', label: 'จัดส่งแล้ว', color: 'badge-secondary', description: 'ชุดคอสเพลย์ถูกจัดส่งแล้ว' },
	{ value: 'delivered', label: 'ส่งมอบแล้ว', color: 'badge-success', description: 'ชุดคอสเพลย์ถูกส่งมอบแล้ว' },
	{ value: 'in_use', label: 'กำลังใช้งาน', color: 'badge-accent', description: 'ชุดคอสเพลย์กำลังถูกใช้งาน' },
	{ value: 'returning', label: 'กำลังส่งคืน', color: 'badge-secondary', description: 'ชุดคอสเพลย์กำลังถูกส่งคืน' },
	{ value: 'returned', label: 'ส่งคืนแล้ว', color: 'badge-success', description: 'ชุดคอสเพลย์ถูกส่งคืนแล้ว' },
	{ value: 'completed', label: 'เสร็จสิ้น', color: 'badge-success', description: 'การเช่าเสร็จสิ้นแล้ว' },
	{ value: 'cancelled', label: 'ยกเลิก', color: 'badge-error', description: 'การเช่าถูกยกเลิก' }
];

export const SHIPPING_STATUS_CONFIGS: RentalStatusConfig[] = [
	{ value: 'pending', label: 'รอดำเนินการ', color: 'badge-warning' },
	{ value: 'label_created', label: 'สร้างป้ายแล้ว', color: 'badge-info' },
	{ value: 'picked_up', label: 'รับแล้ว', color: 'badge-primary' },
	{ value: 'in_transit', label: 'กำลังขนส่ง', color: 'badge-secondary' },
	{ value: 'out_for_delivery', label: 'กำลังจัดส่ง', color: 'badge-accent' },
	{ value: 'delivered', label: 'ส่งมอบแล้ว', color: 'badge-success' },
	{ value: 'return_to_sender', label: 'ส่งคืนผู้ส่ง', color: 'badge-error' },
	{ value: 'exception', label: 'มีปัญหา', color: 'badge-error' }
];

// Helper functions
export function getRentalStatusConfig(status: RentalOrderStatus): RentalStatusConfig {
	return RENTAL_STATUS_CONFIGS.find(config => config.value === status) || 
		{ value: status, label: status, color: 'badge-neutral' };
}

export function getShippingStatusConfig(status: ShippingStatus): RentalStatusConfig {
	return SHIPPING_STATUS_CONFIGS.find(config => config.value === status) || 
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

export function formatDateTime(dateString: string): string {
	return new Date(dateString).toLocaleString('th-TH', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function calculateRentalDays(startDate: string, endDate: string): number {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const diffTime = Math.abs(end.getTime() - start.getTime());
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isDateRangeOverlapping(
	start1: string, 
	end1: string, 
	start2: string, 
	end2: string
): boolean {
	const s1 = new Date(start1);
	const e1 = new Date(end1);
	const s2 = new Date(start2);
	const e2 = new Date(end2);
	
	return s1 < e2 && s2 < e1;
}