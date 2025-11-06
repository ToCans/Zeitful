// Type Defintions
export type DatabaseActionStatus = 'Success' | 'Failure';
export type Item = 'Task' | 'Topic';
export type Page = 'Timer' | 'Statistics' | 'UserPage' | 'Settings';
export type WorkTaskStatus = 'Open' | 'Active' | 'Closed';

export type DatabaseActionResponse = {
	status: DatabaseActionStatus;
	message: string;
};

export type WorkTask = {
	id: string;
	topic_id: string | null;
	task_name: string;
	status: WorkTaskStatus;
};

export type WorkTopic = {
	id: string;
	name: string;
	color: string;
};

export type WorkEntry = {
	id: string;
	topic: WorkTopic['name'] | null;
	task_name: string | null;
	duration: number;
	completion_time: Date;
};
