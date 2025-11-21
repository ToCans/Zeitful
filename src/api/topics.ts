// Function Imports
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveLocalDatabase } from './database';
// Type Imports
import type { Action, DatabaseActionResponse, NewWorkTopic, WorkTopic } from '../types/types';
import type { SettingsContextType } from '../types/context';

// --- Topics ---
export async function addTopic(
	topicID: string,
	topic: NewWorkTopic
): Promise<DatabaseActionResponse> {
	try {
		const db = await getDatabase();

		// Check if topic already exists
		const existing = db.exec(
			'SELECT * FROM work_topics WHERE name = "' + topic.name.replace(/"/g, '""') + '"'
		);

		if (existing.length > 0) {
			return {
				status: 'Failure',
				message: `Topic "${topic.name}" already exists — skipping insert.`,
			};
		}

		// If not found, insert new
		db.run(
			`INSERT INTO work_topics 
        (id, name, color, last_action) 
        VALUES (?, ?, ?, ?)`,
			[topicID, topic.name, topic.color, 'Added']
		);

		await saveLocalDatabase();
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
	const res = db.exec('SELECT * FROM work_topics');
	if (res.length === 0) return [];
	return res[0].values.map(([id, name, color, last_action]) => ({
		id: id as string,
		name: name as string,
		color: color as string,
		last_action: last_action as Action,
	}));
}

// Topics Handling
export const handleAddTopic = async (
	settings: SettingsContextType,
	topic: Omit<WorkTopic, 'id'>
) => {
	if (topic.name !== '') {
		const id = uuidv4();
		const response = await addTopic(id, { name: topic.name, color: topic.color });
		console.log(response.status, response.message);
		settings.setWorkTopics(await getTopics());
	} else {
		console.log('Please enter a topic name');
	}
};
