import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';

let dbInstance: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs({
    locateFile: (file: string) => `/sqljs/${file}`, // served from public/sqljs/
  });

  const saved = localStorage.getItem('workdb');
  dbInstance = saved
    ? new SQL.Database(Uint8Array.from(atob(saved), (c) => c.charCodeAt(0)))
    : new SQL.Database();

  createTables(dbInstance);
  return dbInstance;
}

function createTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS WorkTopic (
      id TEXT PRIMARY KEY,
      topic TEXT NOT NULL,
      color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS WorkTask (
      id TEXT PRIMARY KEY,
      topic_id TEXT,
      time TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Open', 'Active', 'Closed')),
      FOREIGN KEY (topic_id) REFERENCES WorkTopic(id)
    );
  `);
}

export async function saveDatabase() {
  const db = await getDatabase();
  const data = db.export();
  localStorage.setItem('workdb', btoa(String.fromCharCode(...data)));
}
