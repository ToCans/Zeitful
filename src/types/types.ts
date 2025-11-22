// Type Imports
import type { SettingsContextType } from './context';

// Type Defintions
export type Action = 'Added' | 'Edited' | 'Deleted';
export type DatabaseActionStatus = 'Success' | 'Failure';
export type Item = 'Task' | 'Topic' | 'User';
export type Page = 'Timer' | 'Statistics' | 'UserPage' | 'Settings';
export type WorkTaskStatus = 'Open' | 'Active' | 'Closed';

export type CloudDatabaseCredentials = {
	api_key: string;
	database_url: string;
};

export type CloudDatabaseData = {
	tasks: WorkTask[];
	topics: WorkTopic[];
	workEntries: WorkEntry[];
};

export type DatabaseActionResponse = {
	status: DatabaseActionStatus;
	message: string;
	item?: WorkTask[] | WorkTopic[] | WorkEntry[] | CloudDatabaseData;
};

export type DurationByTopic = {
	[topic_id: string]: number;
};

export type PiChartData = {
	labels: string[];
	datasets: {
		data: number[];
		backgroundColor: string[];
	}[];
};

export type TopicData = {
	itemIds: string[];
	itemNames: string[];
	itemDurations: number[];
	itemColors: string[];
	topicPercentage?: number[];
};

export type PersistedSettings = Pick<
	SettingsContextType,
	| 'showTabTimer'
	| 'workingTime'
	| 'shortBreakTime'
	| 'longBreakTime'
	| 'timerColor'
	| 'useCloudDatabase'
	| 'lastCloudDatabaseSync'
	| 'darkMode'
>;

// Work Tasks //
export type EditedWorkTask = {
	topic_id: string | null;
	name: string;
	status: WorkTaskStatus;
	last_action: Action;
};

export type WorkTask = {
	id: string;
	topic_id: string | null;
	name: string;
	status: WorkTaskStatus;
	last_action: Action;
};

// Work Topics //
export type EditedWorkTopic = {
	name: string;
	color: string;
	last_action: Action;
};

export type WorkTopic = {
	id: string;
	name: string;
	color: string;
	last_action: Action;
};

// Work Entries //
export type WorkEntry = {
	id: string;
	task_id: WorkTask['id'] | null;
	topic_id: WorkTopic['id'] | null;
	task_name: WorkTask['name'] | null;
	topic_name: WorkTopic['name'] | null;
	duration: number;
	completion_time: string;
};
