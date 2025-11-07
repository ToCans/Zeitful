// Function Imports
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from './database';
// Type Imports
import type { DatabaseActionResponse, WorkTask, WorkTaskStatus } from '../types/types';
import type { SettingsContextType } from '../types/context';

// --- Tasks ---
export async function addTask(task: WorkTask): Promise<DatabaseActionResponse> {
	try {
		const db = await getDatabase();

		// Check if topic already exists
		const existing = db.exec(
			'SELECT * FROM work_tasks WHERE name = "' + task.name.replace(/"/g, '""') + '"'
		);

		if (existing.length > 0) {
			return {
				status: 'Failure',
				message: `Take "${task.name}" already exists — skipping insert.`,
			};
		}

		db.run(
			`INSERT INTO work_tasks (id, topic_id, name, status)
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
    FROM work_tasks t
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
