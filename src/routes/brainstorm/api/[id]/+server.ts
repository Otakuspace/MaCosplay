import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { FeatureRequest, UpdateFeatureRequestData } from '../../../../types/brainstorm';

// Import the same features array (in production, use a proper database)
// For now, we'll simulate database operations
let features: FeatureRequest[] = [];

// Initialize with sample data (this would be handled by the main API in production)
if (features.length === 0) {
	features = [
		{
			id: '1',
			title: 'โหมดมืดแบบสลับ',
			description: 'เพิ่มปุ่มสลับโหมดมืดทั้งระบบที่จดจำค่าตั้งของผู้ใช้ตลอดทุกเซสชัน',
			category: 'ui',
			priority: 'high',
			status: 'in-progress',
			author: 'สมชาย ใจดี',
			votes: 25,
			createdAt: new Date('2024-01-15').toISOString(),
			updatedAt: new Date('2024-01-20').toISOString(),
			tags: ['ui', 'การเข้าถึง', 'ธีม'],
			position: { x: 100, y: 100 },
			dependencies: [],
			relatedFeatures: ['2', '3'],
			estimatedDuration: 7,
			complexity: 'medium'
		},
		{
			id: '2',
			title: 'การอัปโหลดไฟล์แบบลากวาง',
			description: 'ให้ผู้ใช้สามารถลากและวางไฟล์ลงในแอปพลิเคชันได้โดยตรงเพื่อการจัดการไฟล์ที่ง่ายขึ้น',
			category: 'feature',
			priority: 'medium',
			status: 'requested',
			author: 'สมหญิง รักงาน',
			votes: 18,
			createdAt: new Date('2024-01-18').toISOString(),
			updatedAt: new Date('2024-01-18').toISOString(),
			tags: ['การจัดการไฟล์', 'ประสบการณ์ผู้ใช้'],
			position: { x: 300, y: 150 },
			dependencies: ['1'],
			relatedFeatures: ['4'],
			estimatedDuration: 14,
			complexity: 'high'
		},
		{
			id: '3',
			title: 'ปุ่มลัดคีย์บอร์ด',
			description: 'ใช้งานปุ่มลัดคีย์บอร์ดที่ครอบคลุมสำหรับผู้ใช้ขั้นสูงในการนำทางและดำเนินการได้อย่างรวดเร็ว',
			category: 'improvement',
			priority: 'medium',
			status: 'approved',
			author: 'อเล็กซ์ จอห์นสัน',
			votes: 32,
			createdAt: new Date('2024-01-10').toISOString(),
			updatedAt: new Date('2024-01-22').toISOString(),
			tags: ['การเข้าถึง', 'ประสิทธิภาพ', 'ปุ่มลัด'],
			position: { x: 500, y: 200 },
			dependencies: [],
			relatedFeatures: ['1', '5'],
			estimatedDuration: 10,
			complexity: 'medium'
		},
		{
			id: '4',
			title: 'ส่งออกเป็น PDF',
			description: 'เพิ่มฟังก์ชันการส่งออกเนื้อหาและรายงานเป็นไฟล์ PDF พร้อมตัวเลือกการจัดรูปแบบที่ปรับแต่งได้',
			category: 'feature',
			priority: 'low',
			status: 'requested',
			author: 'ซาร่าห์ วิลสัน',
			votes: 12,
			createdAt: new Date('2024-01-25').toISOString(),
			updatedAt: new Date('2024-01-25').toISOString(),
			tags: ['ส่งออก', 'pdf', 'รายงาน'],
			position: { x: 200, y: 300 },
			dependencies: ['2'],
			relatedFeatures: ['6'],
			estimatedDuration: 21,
			complexity: 'high'
		},
		{
			id: '5',
			title: 'ระบบแจ้งเตือนแบบเรียลไทม์',
			description: 'สร้างระบบแจ้งเตือนที่อัปเดตแบบเรียลไทม์เพื่อแจ้งให้ผู้ใช้ทราบเหตุการณ์สำคัญ',
			category: 'feature',
			priority: 'critical',
			status: 'approved',
			author: 'ประยุทธ์ เทคโน',
			votes: 45,
			createdAt: new Date('2024-01-12').toISOString(),
			updatedAt: new Date('2024-01-28').toISOString(),
			tags: ['แจ้งเตือน', 'เรียลไทม์', 'การสื่อสาร'],
			position: { x: 400, y: 350 },
			dependencies: [],
			relatedFeatures: ['3', '6'],
			estimatedDuration: 28,
			complexity: 'high'
		},
		{
			id: '6',
			title: 'ระบบสำรองข้อมูลอัตโนมัติ',
			description: 'ใช้งานระบบสำรองข้อมูลอัตโนมัติที่ทำงานในพื้นหลังเพื่อรักษาความปลอดภัยของข้อมูล',
			category: 'improvement',
			priority: 'high',
			status: 'in-review',
			author: 'วิทยา ปลอดภัย',
			votes: 28,
			createdAt: new Date('2024-01-08').toISOString(),
			updatedAt: new Date('2024-01-30').toISOString(),
			tags: ['สำรองข้อมูล', 'ความปลอดภัย', 'อัตโนมัติ'],
			position: { x: 600, y: 100 },
			dependencies: [],
			relatedFeatures: ['4', '5'],
			estimatedDuration: 35,
			complexity: 'high'
		},
		{
			id: '7',
			title: 'แก้ไขบัคการโหลดช้า',
			description: 'แก้ไขปัญหาการโหลดหน้าเว็บช้าในบางสถานการณ์',
			category: 'bug',
			priority: 'high',
			status: 'completed',
			author: 'เดวิด บัคฟิกเซอร์',
			votes: 8,
			createdAt: new Date('2024-01-05').toISOString(),
			updatedAt: new Date('2024-01-15').toISOString(),
			tags: ['ประสิทธิภาพ', 'โหลด', 'แก้ไขบัค'],
			position: { x: 150, y: 450 },
			dependencies: [],
			relatedFeatures: [],
			estimatedDuration: 5,
			complexity: 'low'
		},
		{
			id: '8',
			title: 'การปรับปรุงการออกแบบหน้าหลัก',
			description: 'ปรับปรุงการออกแบบหน้าหลักให้ทันสมัยและใช้งานง่ายขึ้น',
			category: 'ui',
			priority: 'medium',
			status: 'in-progress',
			author: 'นิดา ดีไซเนอร์',
			votes: 19,
			createdAt: new Date('2024-01-20').toISOString(),
			updatedAt: new Date('2024-02-01').toISOString(),
			tags: ['ui', 'หน้าหลัก', 'การออกแบบ'],
			position: { x: 350, y: 500 },
			dependencies: ['1'],
			relatedFeatures: ['2'],
			estimatedDuration: 14,
			complexity: 'medium'
		}
	];
}

export const GET: RequestHandler = async ({ params }) => {
	const feature = features.find(f => f.id === params.id);
	
	if (!feature) {
		return json({ error: 'Feature request not found' }, { status: 404 });
	}
	
	return json(feature);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const featureIndex = features.findIndex(f => f.id === params.id);
		
		if (featureIndex === -1) {
			return json({ error: 'Feature request not found' }, { status: 404 });
		}
		
		const updateData: UpdateFeatureRequestData = await request.json();
		const existingFeature = features[featureIndex];
		
		// Update the feature with new data
		const updatedFeature: FeatureRequest = {
			...existingFeature,
			...updateData,
			id: existingFeature.id, // Ensure ID cannot be changed
			createdAt: existingFeature.createdAt, // Preserve creation date
			updatedAt: new Date().toISOString()
		};
		
		features[featureIndex] = updatedFeature;
		
		return json(updatedFeature);
	} catch (error) {
		console.error('Error updating feature request:', error);
		return json({ error: 'Invalid request data' }, { status: 400 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	const featureIndex = features.findIndex(f => f.id === params.id);
	
	if (featureIndex === -1) {
		return json({ error: 'Feature request not found' }, { status: 404 });
	}
	
	const deletedFeature = features.splice(featureIndex, 1)[0];
	
	return json({ message: 'Feature request deleted successfully', feature: deletedFeature });
};