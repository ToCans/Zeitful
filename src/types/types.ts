// Type Defintions
export type Page = 'Timer' | 'Statistics' | 'UserPage' | 'Settings';
export type WorkTaskStatus = 'Open' | 'Active' | 'Closed';

export type WorkTopic = {
	topic: string;
	color: string;
};

export type WorkTask = {
	id: string;
	topic: WorkTopic["topic"] | null;
	task_name: string | null;
	duration: number;
	completion_time: Date;
	status: WorkTaskStatus;
};
