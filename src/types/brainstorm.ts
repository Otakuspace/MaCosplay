export interface FeatureRequest {
	id: string;
	title: string;
	description: string;
	category: 'ui' | 'feature' | 'improvement' | 'bug' | 'other';
	priority: 'low' | 'medium' | 'high' | 'critical';
	status: 'requested' | 'in-review' | 'approved' | 'in-progress' | 'completed' | 'rejected';
	author: string;
	votes: number;
	createdAt: string;
	updatedAt: string;
	tags: string[];
	position?: {
		x: number;
		y: number;
	};
}

export interface BrainstormBoard {
	id: string;
	title: string;
	description: string;
	features: FeatureRequest[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateFeatureRequestData {
	title: string;
	description: string;
	category: FeatureRequest['category'];
	priority: FeatureRequest['priority'];
	author: string;
	tags: string[];
}

export interface UpdateFeatureRequestData {
	title?: string;
	description?: string;
	category?: FeatureRequest['category'];
	priority?: FeatureRequest['priority'];
	status?: FeatureRequest['status'];
	tags?: string[];
	position?: {
		x: number;
		y: number;
	};
}