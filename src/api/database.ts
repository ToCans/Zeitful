// Library Imports
import initSqlJs from 'sql.js';
// Type Imports
import type { Database } from 'sql.js';

// Consts
let dbInstance: Database | null = null;

// Databae Gathering
export async function getDatabase(): Promise<Database> {
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

// Database/Tables Creation
function createTables(db: Database) {
	db.run(`
	CREATE TABLE IF NOT EXISTS work_topics (
	  id TEXT PRIMARY KEY,
	  name TEXT NOT NULL,
	  color TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS work_tasks (
	  id TEXT PRIMARY KEY,
	  topic_id TEXT,
	  name TEXT,
	  status TEXT NOT NULL CHECK(status IN ('Open', 'Active', 'Closed'))
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

// Saving Database Functionality
export async function saveLocalDatabase() {
	const db = await getDatabase();
	const data = db.export();
	localStorage.setItem('zeitful_db', btoa(String.fromCharCode(...data)));
}

// Gathers all of the local database data from each table
export async function getLocalDatabaseData() {
	const db = await getDatabase();

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
export async function importDatabaseHelper(jsonData: any) {
	const db = await getDatabase();

	// Helper: Upsert for topics
	const upsertTopic = db.prepare(`
    INSERT INTO work_topics (id, name, color, ) 
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET name=excluded.name, color=excluded.color
  `);
	for (const t of jsonData.topics || []) {
		upsertTopic.run([t.id, t.name, t.color]);
	}
	upsertTopic.free();

	// Upsert for tasks
	const upsertTask = db.prepare(`
    INSERT INTO work_tasks (id, topic_id, name, status)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET topic_id=excluded.topic_id, name=excluded.name, status=excluded.status
  `);
	for (const t of jsonData.tasks || []) {
		upsertTask.run([t.id, t.topic_id, t.name, t.status]);
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

// Tries to import a json file as a database
export async function importJsonFile(file: File) {
	const text = await file.text();
	const jsonData = JSON.parse(text);
	await importDatabaseHelper(jsonData);
}
