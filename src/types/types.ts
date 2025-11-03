// Type Defintions
export type Page = 'Timer' | 'Statistics' | 'AuthPage' | 'Settings';
export type WorkTaskStatus = 'Open' | 'Active' | 'Closed';

export type WorkTopic = {
	id: string;
	topic: string;
	color: string;
};

export type WorkTask = {
	id: string;
	topic: WorkTopic | null;
	time: Date;
	status: WorkTaskStatus;
};
