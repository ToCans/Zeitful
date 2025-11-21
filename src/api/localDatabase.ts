// Library Imports
import initSqlJs from 'sql.js';
// Type Imports
import type { Database } from 'sql.js';
import type {
	Action,
	DatabaseActionResponse,
	NewWorkTask,
	WorkTask,
	WorkTaskStatus,
} from '../types/types';

// Consts
let dbInstance: Database | null = null;

// Overall Local Database Functions
// Get Database from Local Memory
export async function getLocalDatabase(): Promise<Database> {
	if (dbInstance) return dbInstance;

	const SQL = await initSqlJs({
		locateFile: (file: string) => `/sqljs/${file}`,
	});

	const saved = localStorage.getItem('zeitful_db');
	dbInstance = saved
		? new SQL.Database(Uint8Array.from(atob(saved), (c) => c.charCodeAt(0)))
		: new SQL.Database();

	createTables(dbInstance);
	return dbInstance;
}

// Create the Local Database
function createTables(db: Database) {
	db.run(`
    CREATE TABLE IF NOT EXISTS work_topics (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      last_action TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS work_tasks (
      id TEXT PRIMARY KEY,
      topic_id TEXT,
      name TEXT,
      status TEXT NOT NULL CHECK(status IN ('Open', 'Active', 'Closed')),
      last_action TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS work_entries (
      id TEXT PRIMARY KEY,
      task_id TEXT,
      topic_id TEXT,
      task_name TEXT,
      topic_name TEXT,
      duration REAL NOT NULL,
      completion_time TEXT NOT NULL
    );
  `);
}

// Saving Local Database
export async function saveLocalDatabase() {
	const db = await getLocalDatabase();
	const data = db.export();
	localStorage.setItem('zeitful_db', btoa(String.fromCharCode(...data)));
}

// Gathers all of the local database data from each table
export async function getLocalDatabaseData() {
	const db = await getLocalDatabase();

	function queryAll(sql: string) {
		const stmt = db.prepare(sql);
		const rows: Record<string, any>[] = [];
		while (stmt.step()) rows.push(stmt.getAsObject());
		stmt.free();
		return rows;
	}

	const topics = queryAll(`SELECT * FROM work_topics`);
	const tasks = queryAll(`SELECT * FROM work_tasks`);
	const workEntries = queryAll(`SELECT * FROM work_entries`);

	return { topics, tasks, workEntries };
}

// Converts the database to a downloadable json file
export async function downloadDataJson() {
	const data = await getLocalDatabaseData();
	const blob = new Blob([JSON.stringify(data, null, 2)], {
		type: 'application/json',
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'zeitful_data.json';
	a.click();
	URL.revokeObjectURL(url);
}

// Import JSON data back into the database
export async function importDatabaseDataHelper(jsonData: any) {
	const db = await getLocalDatabase();

	// Helper: Upsert for topics
	const upsertTopic = db.prepare(`
    INSERT INTO work_topics (id, name, color, last_action) 
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET name=excluded.name, color=excluded.color, last_action=excluded.last_action
  `);
	for (const t of jsonData.topics || []) {
		upsertTopic.run([t.id, t.name, t.color]);
	}
	upsertTopic.free();

	// Upsert for tasks
	const upsertTask = db.prepare(`
    INSERT INTO work_tasks (id, topic_id, name, status, last_action)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET topic_id=excluded.topic_id, name=excluded.name, status=excluded.status, last_action=excluded.last_action
  `);
	for (const t of jsonData.tasks || []) {
		upsertTask.run([t.id, t.topic_id, t.name, t.status, t.last_action]);
	}
	upsertTask.free();

	// Upsert for work entries
	const upsertEntry = db.prepare(`
    INSERT INTO work_entries (id, task_id, topic_id, task_name, topic_name, duration, completion_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      task_id=excluded.task_id,
      topic_id=excluded.topic_id,
      task_name=excluded.task_name,
      topic_name=excluded.topic_name,
      duration=excluded.duration,
      completion_time=excluded.completion_time
  `);
	for (const e of jsonData.workEntries || []) {
		upsertEntry.run([
			e.id,
			e.task_id,
			e.topic_id,
			e.task_name,
			e.topic_name,
			e.duration,
			e.completion_time,
		]);
	}
	upsertEntry.free();
	await saveLocalDatabase();
}

// Imports Database Data from Json File
export async function importLocalDatabaseDataFromJson(file: File) {
	const text = await file.text();
	const jsonData = JSON.parse(text);
	await importDatabaseDataHelper(jsonData);
}

// Local Database Functions for Tasks
// Adding Task to local database
export async function addTask(taskId: string, task: NewWorkTask): Promise<DatabaseActionResponse> {
	try {
		const db = await getLocalDatabase();

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
			`INSERT INTO work_tasks (id, topic_id, name, status, last_action)
             VALUES (?, ?, ?, ?, ?)`,
			[taskId, task?.topic_id ?? null, task.name, 'Open', 'Added']
		);

		await saveLocalDatabase();

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

// Editing task in local database
export async function editTask(taskId: string, task: WorkTask): Promise<DatabaseActionResponse> {
	try {
		const db = await getLocalDatabase();

		// Check if task exists
		const existing = db.exec(
			`SELECT * FROM work_tasks WHERE id = "${taskId.replace(/"/g, '""')}"`
		);

		if (existing.length === 0) {
			return {
				status: 'Failure',
				message: `Task with id "${taskId}" not found — cannot update.`,
			};
		}

		db.run(
			`UPDATE work_tasks
             SET topic_id = ?, 
                 name = ?, 
                 color = ?, 
                 status = ?, 
                 last_action = ?
             WHERE id = ?`,
			[task.topic_id ?? null, task.name, task.status, 'Edited', taskId]
		);

		await saveLocalDatabase();

		return {
			status: 'Success',
			message: `Task "${task.name}" was updated.`,
		};
	} catch (e) {
		return {
			status: 'Failure',
			message: `Task "${task.name}" wasn't updated. ${e}`,
		};
	}
}

// Deleting Task in local database ()
export async function deleteTask(taskId: string, task: WorkTask): Promise<DatabaseActionResponse> {
	try {
		const db = await getLocalDatabase();

		// Check if task exists
		const existing = db.exec(
			`SELECT * FROM work_tasks WHERE id = "${taskId.replace(/"/g, '""')}"`
		);

		if (existing.length === 0) {
			return {
				status: 'Failure',
				message: `Task with id "${taskId}" not found — cannot delete.`,
			};
		}

		db.run(
			`UPDATE work_tasks
             SET last_action = ?
             WHERE id = ?`,
			['Deleted', taskId]
		);

		await saveLocalDatabase();

		return {
			status: 'Success',
			message: `Task "${task.name}" was deleted.`,
		};
	} catch (e) {
		return {
			status: 'Failure',
			message: `Task "${task.name}" wasn't deleted. ${e}`,
		};
	}
}

export async function getTasks(): Promise<DatabaseActionResponse> {
	try {
		const db = await getLocalDatabase();
		const res = db.exec(`
            SELECT t.id, t.topic_id, t.name, t.status, t.last_action
            FROM work_tasks t
        `);

		if (res.length === 0)
			return {
				status: 'Success',
				message: `No tasks available in local database.`,
				item: [],
			};

		const localWorkTasks = res[0].values.map(([id, topic_id, name, status, last_action]) => ({
			id: id as string,
			topic_id: topic_id as string | null,
			name: name as string,
			status: status as WorkTaskStatus,
			last_action: last_action as Action,
		}));

		return {
			status: 'Success',
			message: `Local tasks available in local database.`,
			item: localWorkTasks,
		};
	} catch (e) {
		return {
			status: 'Failure',
			message: `Couldn't retrieve work tasks from local database. ${e}`,
		};
	}
}
