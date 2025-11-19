// Function Imports
import { getDatabase, saveDatabase } from './database';
// Type Imports
import type { DatabaseActionResponse, WorkEntry, WorkTopic } from '../types/types';
import type { SettingsContextType } from '../types/context';

// --- Work Entries ---
export async function addWorkEntry(workEntry: WorkEntry): Promise<DatabaseActionResponse> {
	try {
		const db = await getDatabase();
		db.run(
			`INSERT INTO work_entries 
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
	uuid: string,
	settings: SettingsContextType,
	workEntry: Omit<WorkEntry, 'id' | 'duration' | 'topic_name' | 'completion_time'>,
	workTopics: WorkTopic[]
) => {
	// Non Selected Data
	const matchedTopic = workTopics.find((workTopic) => workTopic.id === workEntry.topic_id);

	const response = await addWorkEntry({
		id: uuid,
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
    FROM work_entries t
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
