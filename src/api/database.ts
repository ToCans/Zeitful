// Function Imports
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from '../components/Database/database';
// Type Imports
import type {
	DatabaseActionResponse,
	WorkEntry,
	WorkTask,
	WorkTaskStatus,
	WorkTopic,
} from '../types/types';
import type { SettingsContextType } from '../types/context';

// --- Topics ---
export async function addTopic(topic: WorkTopic): Promise<DatabaseActionResponse> {
	try {
		const db = await getDatabase();

		// Check if topic already exists
		const existing = db.exec(
			'SELECT * FROM WorkTopic WHERE name = "' + topic.name.replace(/"/g, '""') + '"'
		);
		console.log(existing);

		if (existing.length > 0) {
			return {
				status: 'Failure',
				message: `Topic "${topic.name}" already exists — skipping insert.`,
			};
		}

		// If not found, insert new
		db.run(
			`INSERT INTO WorkTopic 
        (id, name, color) 
        VALUES (?, ?, ?)`,
			[topic.id, topic.name, topic.color]
		);

		await saveDatabase();
		return {
			status: 'Success',
			message: `Topic "${topic.name}" inserted into database.`,
		};
	} catch (e) {
		return {
			status: 'Failure',
			message: `Topic "${topic.name}" wasn't inserted into database. ${e}`,
		};
	}
}

export async function getTopics(): Promise<WorkTopic[]> {
	const db = await getDatabase();
	const res = db.exec('SELECT * FROM WorkTopic');
	if (res.length === 0) return [];
	return res[0].values.map(([id, name, color]) => ({
		id: id as string,
		name: name as string,
		color: color as string,
	}));
}

// Topics Handling
export const handleAddTopic = async (
	settings: SettingsContextType,
	topic: Omit<WorkTopic, 'id'>
) => {
	if (topic.name !== '') {
		const id = uuidv4();
		const response = await addTopic({ id: id, name: topic.name, color: topic.color });
		console.log(response.status);
		console.log(response.message);
		settings.setWorkTopics(await getTopics());
	} else {
		console.log('Please enter a topic name');
	}
};

// --- Tasks ---
export async function addTask(task: WorkTask): Promise<DatabaseActionResponse> {
	try {
		const db = await getDatabase();

		// Check if topic already exists
		const existing = db.exec(
			'SELECT * FROM WorkTask WHERE name = "' + task.name.replace(/"/g, '""') + '"'
		);

		if (existing.length > 0) {
			return {
				status: 'Failure',
				message: `Take "${task.name}" already exists — skipping insert.`,
			};
		}

		db.run(
			`INSERT INTO WorkTask (id, topic_id, name, status)
			 VALUES (?, ?, ?, ?)`,
			[
				task.id,
				task?.topic_id ?? null, // ✅ insert topic name or null
				task.name,
				task.status,
			]
		);

		await saveDatabase();

		return {
			status: 'Success',
			message: `Task "${task.name}" inserted into database.`,
		};
	} catch (e) {
		return {
			status: 'Failure',
			message: `Task "${task.name}" wasn't inserted into database. ${e}`,
		};
	}
}

export async function getTasks(): Promise<WorkTask[]> {
	const db = await getDatabase();
	const res = db.exec(`
    SELECT t.id, t.topic_id, t.name, t.status
    FROM WorkTask t
  `);

	if (res.length === 0) return [];

	return res[0].values.map(([id, topic_id, name, status]) => ({
		id: id as string,
		topic_id: topic_id as string | null,
		name: name as string,
		status: status as WorkTaskStatus,
	}));
}

export const handleAddTask = async (
	settings: SettingsContextType,
	task: Omit<WorkTask, 'id | status'>
) => {
	console.log('Incoming task', task);
	if (task.name !== '') {
		const id = uuidv4();
		const response = await addTask({
			id: id,
			topic_id: task.topic_id,
			name: task.name,
			status: 'Open',
		});
		console.log(response.status);
		console.log(response.message);
		settings.setWorkTasks(await getTasks());
	} else {
		console.log('Please enter a task name');
	}
};

// --- Work Entries ---
export async function addWorkEntry(workEntry: WorkEntry): Promise<DatabaseActionResponse> {
	try {
		const db = await getDatabase();
		db.run(
			`INSERT INTO WorkEntry 
        (id, task_id, topic_id, task_name, topic_name, duration, completion_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[
				workEntry.id,
				workEntry.task_id,
				workEntry.topic_id,
				workEntry.task_name,
				workEntry.topic_name,
				workEntry.duration,
				workEntry.completion_time.toISOString(),
			]
		);
		await saveDatabase();
		return {
			status: 'Success',
			message: `Work Entry inserted into database.`,
		};
	} catch (e) {
		return {
			status: 'Failure',
			message: `Work Entry wasn't inserted into database. ${e}`,
		};
	}
}

export const handleAddWorkEntry = async (
	settings: SettingsContextType,
	workEntry: Omit<WorkEntry, 'id' | 'duration' | 'topic_name' | 'completion_time'>,
	workTopics: WorkTopic[]
) => {
	// Non Selected Data
	const id = uuidv4();
	const matchedTopic = workTopics.find((workTopic) => workTopic.id === workEntry.topic_id);
	console.log('Incoming work entry', workEntry);

	const response = await addWorkEntry({
		id: id,
		task_id: workEntry.task_id,
		topic_id: workEntry.topic_id,
		task_name: workEntry.task_name,
		topic_name: matchedTopic?.name ?? null,
		duration: settings.workingTime / 60,
		completion_time: new Date(),
	});

	console.log(response.status);
	console.log(response.message);
	settings.setWorkEntries(await getWorkEntries());
};

export async function getWorkEntries(): Promise<WorkEntry[]> {
	const db = await getDatabase();
	const res = db.exec(`
    SELECT t.id, t.task_id, t.topic_id, t.task_name, t.topic_name, t.duration, t.completion_time
    FROM WorkEntry t
  `);

	if (res.length === 0) return [];

	return res[0].values.map(
		([id, task_id, topic_id, task_name, topic_name, duration, completion_time]) => ({
			id: id as string,
			task_id: task_id as string | null,
			topic_id: topic_id as string | null,
			task_name: task_name as string | null,
			topic_name: topic_name as string | null,
			duration: duration as number,
			completion_time: completion_time as Date,
		})
	);
}
