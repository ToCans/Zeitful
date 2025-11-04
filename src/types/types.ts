// Type Defintions
export type DatabaseActionStatus = 'Success' | 'Failure';
export type Page = 'Timer' | 'Statistics' | 'UserPage' | 'Settings';
export type WorkTaskStatus = 'Open' | 'Active' | 'Closed';

export type DatabaseActionResponse = {
	status: DatabaseActionStatus;
	message: string;
};

export type WorkTopic = {
	id: string;
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
