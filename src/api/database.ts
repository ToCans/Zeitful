// Function Imports
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from '../components/Database/database';
// Type Imports
import type { DatabaseActionResponse, WorkTask, WorkTaskStatus, WorkTopic } from '../types/types';
import type { SettingsContextType } from '../types/context';

// --- Topics ---
export async function addTopic(topic: WorkTopic): Promise<DatabaseActionResponse> {
	try {
		const db = await getDatabase();

		// Check if topic already exists
		const existing = db.exec(
			'SELECT * FROM WorkTopic WHERE topic = "' + topic.topic.replace(/"/g, '""') + '"'
		);
		console.log(existing);

		if (existing.length > 0) {
			return {
				status: 'Failure',
				message: `Topic "${topic.topic}" already exists — skipping insert.`,
			};
		}

		// If not found, insert new
		db.run(
			`INSERT INTO WorkTopic 
        (id, topic, color) 
        VALUES (?, ?, ?)`,
			[topic.id, topic.topic, topic.color]
		);

		await saveDatabase();
		return {
			status: 'Success',
			message: `Topic "${topic.topic}" inserted into database.`,
		};
	} catch (e) {
		return {
			status: 'Failure',
			message: `Topic "${topic.topic}" wasn't inserted into database. ${e}`,
		};
	}
}

export async function getTopics(): Promise<WorkTopic[]> {
	const db = await getDatabase();
	const res = db.exec('SELECT * FROM WorkTopic');
	if (res.length === 0) return [];
	return res[0].values.map(([id, topic, color]) => ({
		id: id as string,
		topic: topic as string,
		color: color as string,
	}));
}

// Topics Handling
export const handleAddTopic = async (
	settings: SettingsContextType,
	topic: Omit<WorkTopic, 'id'>
) => {
	const id = uuidv4();
	const response = await addTopic({ id: id, topic: topic.topic, color: topic.color });
	console.log(response.status);
	console.log(response.message);
	settings.setWorkTopics(await getTopics());
};

// --- Tasks ---
export async function addTask(task: Omit<WorkTask, 'id'>): Promise<DatabaseActionResponse> {
	try {
		const db = await getDatabase();
		const id = uuidv4();
		db.run(
			`INSERT INTO WorkTask 
        (id, topic, task_name, duration, completion_time, status) 
        VALUES (?, ?, ?, ?, ?, ?)`,
			[
				id,
				task.topic,
				task.task_name,
				task.duration,
				task.completion_time.toISOString(),
				task.status,
			]
		);
		await saveDatabase();
		return {
			status: 'Success',
			message: `Task "${task.task_name}" inserted into database.`,
		};
	} catch (e) {
		return {
			status: 'Failure',
			message: `Task "${task.task_name}" wasn't inserted into database. ${e}`,
		};
	}
}

export async function getTasks(): Promise<WorkTask[]> {
	const db = await getDatabase();
	const res = db.exec(`
    SELECT t.id, t.topic, t.task_name, t.duration, t.completion_time, t.status, wt.color
    FROM WorkTask t
    LEFT JOIN WorkTopic wt ON t.topic = wt.topic
  `);

	if (res.length === 0) return [];

	return res[0].values.map(([id, topic, task_name, duration, completion_time, status]) => ({
		id: id as string,
		topic: topic as string | null,
		task_name: task_name as string | null,
		duration: duration as number,
		completion_time: new Date(completion_time as string),
		status: status as WorkTaskStatus,
	}));
}

export const handleAddTask = async (settings: SettingsContextType, task: WorkTask) => {
	const response = await addTask({
		topic: task.topic,
		task_name: task.task_name,
		duration: settings.workingTime,
		completion_time: new Date(),
		status: 'Open',
	});
	console.log(response.status);
	console.log(response.message);
	settings.setWorkTasks(await getTasks());
};
