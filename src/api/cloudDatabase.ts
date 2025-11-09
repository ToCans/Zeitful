import type { CloudDatabase } from '../types/types';

// Supabase Request
async function supabaseRequest<T>(
    table: string,
    cloudDatabaseCredentials: CloudDatabase,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${cloudDatabaseCredentials['database_url']}/rest/v1/${table}`, {
        ...options,
        headers: {
            "apikey": cloudDatabaseCredentials['api_key'],
            "Authorization": `Bearer ${cloudDatabaseCredentials['api_key']}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Supabase error (${res.status}): ${text}`);
    }

    return res.json();
}

// Tries to import a json file as a database
export async function importCloudDatabaseCredentialile(file: File): Promise<CloudDatabase> {
    const text = await file.text();
    const jsonData = JSON.parse(text);
    return jsonData;
}

