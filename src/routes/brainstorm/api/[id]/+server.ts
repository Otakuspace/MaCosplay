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
			title: 'Dark Mode Toggle',
			description: 'Add a system-wide dark mode toggle that remembers user preference across sessions.',
			category: 'ui',
			priority: 'high',
			status: 'in-progress',
			author: 'John Doe',
			votes: 15,
			createdAt: new Date('2024-01-15').toISOString(),
			updatedAt: new Date('2024-01-20').toISOString(),
			tags: ['ui', 'accessibility', 'theme'],
			position: { x: 100, y: 100 }
		},
		{
			id: '2',
			title: 'Drag and Drop File Upload',
			description: 'Allow users to drag and drop files directly into the application for easier file management.',
			category: 'feature',
			priority: 'medium',
			status: 'requested',
			author: 'Jane Smith',
			votes: 8,
			createdAt: new Date('2024-01-18').toISOString(),
			updatedAt: new Date('2024-01-18').toISOString(),
			tags: ['file-management', 'ux'],
			position: { x: 300, y: 150 }
		},
		{
			id: '3',
			title: 'Keyboard Shortcuts',
			description: 'Implement comprehensive keyboard shortcuts for power users to navigate and perform actions quickly.',
			category: 'improvement',
			priority: 'medium',
			status: 'approved',
			author: 'Alex Johnson',
			votes: 22,
			createdAt: new Date('2024-01-10').toISOString(),
			updatedAt: new Date('2024-01-22').toISOString(),
			tags: ['accessibility', 'productivity', 'shortcuts'],
			position: { x: 500, y: 200 }
		},
		{
			id: '4',
			title: 'Export to PDF',
			description: 'Add functionality to export content and reports as PDF files with customizable formatting options.',
			category: 'feature',
			priority: 'low',
			status: 'requested',
			author: 'Sarah Wilson',
			votes: 5,
			createdAt: new Date('2024-01-25').toISOString(),
			updatedAt: new Date('2024-01-25').toISOString(),
			tags: ['export', 'pdf', 'reports'],
			position: { x: 200, y: 300 }
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