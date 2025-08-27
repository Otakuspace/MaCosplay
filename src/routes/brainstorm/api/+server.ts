import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { FeatureRequest, CreateFeatureRequestData } from '../../../types/brainstorm';

// In-memory storage (replace with actual database in production)
let features: FeatureRequest[] = [
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

function generateId(): string {
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const GET: RequestHandler = async () => {
	return json(features);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data: CreateFeatureRequestData = await request.json();
		
		// Validate required fields
		if (!data.title?.trim()) {
			return json({ error: 'Title is required' }, { status: 400 });
		}
		
		if (!data.description?.trim()) {
			return json({ error: 'Description is required' }, { status: 400 });
		}
		
		if (!data.author?.trim()) {
			return json({ error: 'Author is required' }, { status: 400 });
		}

		const newFeature: FeatureRequest = {
			id: generateId(),
			title: data.title.trim(),
			description: data.description.trim(),
			category: data.category,
			priority: data.priority,
			status: 'requested',
			author: data.author.trim(),
			votes: 0,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			tags: data.tags || [],
			position: {
				x: Math.random() * 400 + 100,
				y: Math.random() * 400 + 100
			}
		};

		features.push(newFeature);
		
		return json(newFeature, { status: 201 });
	} catch (error) {
		console.error('Error creating feature request:', error);
		return json({ error: 'Invalid request data' }, { status: 400 });
	}
};