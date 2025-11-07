// Function Imports
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from './database';
// Type Imports
import type { DatabaseActionResponse, WorkTopic } from '../types/types';
import type { SettingsContextType } from '../types/context';

// --- Topics ---
export async function addTopic(topic: WorkTopic): Promise<DatabaseActionResponse> {
	try {
		const db = await getDatabase();

		// Check if topic already exists
		const existing = db.exec(
			'SELECT * FROM work_topics WHERE name = "' + topic.name.replace(/"/g, '""') + '"'
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
			`INSERT INTO work_topics 
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
	const res = db.exec('SELECT * FROM work_topics');
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
