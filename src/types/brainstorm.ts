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
	// Graph visualization properties
	dependencies?: string[]; // IDs of features this depends on
	relatedFeatures?: string[]; // IDs of related features
	estimatedDuration?: number; // Estimated days to complete
	complexity?: 'low' | 'medium' | 'high'; // Implementation complexity
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
	dependencies?: string[];
	relatedFeatures?: string[];
	estimatedDuration?: number;
	complexity?: FeatureRequest['complexity'];
}

// Graph visualization types
export interface GraphNode {
	id: string;
	title: string;
	category: FeatureRequest['category'];
	priority: FeatureRequest['priority'];
	status: FeatureRequest['status'];
	votes: number;
	complexity?: FeatureRequest['complexity'];
	x?: number;
	y?: number;
}

export interface GraphLink {
	source: string;
	target: string;
	type: 'dependency' | 'related';
}

export interface GraphData {
	nodes: GraphNode[];
	links: GraphLink[];
}

export type ViewMode = 'card' | 'graph';