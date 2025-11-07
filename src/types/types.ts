// Type Defintions
export type DatabaseActionStatus = 'Success' | 'Failure';
export type Item = 'Task' | 'Topic' | 'User';
export type Page = 'Timer' | 'Statistics' | 'UserPage' | 'Settings';
export type WorkTaskStatus = 'Open' | 'Active' | 'Closed';

export type DatabaseActionResponse = {
	status: DatabaseActionStatus;
	message: string;
};

export type WorkTask = {
	id: string;
	topic_id: string | null;
	name: string;
	status: WorkTaskStatus;
};

export type WorkTopic = {
	id: string;
	name: string;
	color: string;
};

export type WorkEntry = {
	id: string;
	task_id: WorkTask['id'] | null;
	topic_id: WorkTopic['id'] | null;
	task_name: WorkTask['name'] | null;
	topic_name: WorkTopic['name'] | null;
	duration: number;
	completion_time: Date;
};
