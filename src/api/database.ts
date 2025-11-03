// Function Imports
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from '../components/Database/database';
// Type Imports
import type { WorkTask, WorkTaskStatus, WorkTopic } from '../types/types';

// --- Topics ---
export async function addTopic(topic: Omit<WorkTopic, 'id'>): Promise<string> {
    const db = await getDatabase();
    const id = uuidv4();
    db.run('INSERT INTO WorkTopic (id, topic, color) VALUES (?, ?, ?)', [
        id,
        topic.topic,
        topic.color,
    ]);
    await saveDatabase();
    return id;
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

// --- Tasks ---
export async function addTask(task: Omit<WorkTask, 'id'>): Promise<string> {
    const db = await getDatabase();
    const id = uuidv4();
    db.run(
        'INSERT INTO WorkTask (id, topic_id, time, status) VALUES (?, ?, ?, ?)',
        [id, task.topic?.id ?? null, task.time.toISOString(), task.status]
    );
    await saveDatabase();
    return id;
}

export async function getTasks(): Promise<WorkTask[]> {
    const db = await getDatabase();
    const res = db.exec(`
    SELECT t.id, t.time, t.status,
           wt.id as topic_id, wt.topic as topic_name, wt.color as topic_color
    FROM WorkTask t
    LEFT JOIN WorkTopic wt ON t.topic_id = wt.id
  `);
    if (res.length === 0) return [];
    return res[0].values.map(
        ([id, time, status, topic_id, topic_name, topic_color]) => ({
            id: id as string,
            time: new Date(time as string),
            status: status as WorkTaskStatus,
            topic: topic_id
                ? { id: topic_id as string, topic: topic_name as string, color: topic_color as string }
                : null,
        })
    );
}
