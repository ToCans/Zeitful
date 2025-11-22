// Type Imports
import type { DatabaseActionResponse, WorkTask, WorkEntry, WorkTopic, CloudDatabaseData } from '../types/types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Get Data from Local Supabase connection
export async function getDataFromSupabaseDatabase(supabaseClient: SupabaseClient): Promise<DatabaseActionResponse> {
    try {
        const [{ data: topics, error: topicsError },
            { data: tasks, error: tasksError },
            { data: workEntries, error: entriesError }] = await Promise.all([
                supabaseClient.from('work_topics').select('*'),
                supabaseClient.from('work_tasks').select('*'),
                supabaseClient.from('work_entries').select('*')
            ]);


        if (topicsError || tasksError || entriesError) {
            return {
                status: 'Failure',
                message: `Data cannot be gathered from supabase database. Topics Error: ${topicsError}. Tasks Error: ${tasksError}. Entries Error: ${entriesError}.`,
            };
        }

        return {
            status: 'Success',
            message: `Local entries available in local database.`,
            item: { tasks: tasks, topics: topics, workEntries: workEntries } as CloudDatabaseData,
        };

    } catch (e) {
        return {
            status: 'Failure',
            message: `Data cannot be gathered from supabase database. Error ${e}.`,
        };
    }

}

// Local Data Sync with supabase database
export async function syncLocalDataToSupabaseDatabase(supabaseClient: SupabaseClient, localData: any) {
    try {
        const { error: topicsError } = await supabaseClient
            .from('work_topics')
            .upsert(localData['topics'], { onConflict: 'id' });

        if (topicsError) {
            return {
                status: 'Failure',
                message: `Data could not be synced to supabase database. Topics Error: ${topicsError}.`,
            };
        }

        // 2️⃣ Sync tasks
        const { error: tasksError } = await supabaseClient
            .from('work_tasks')
            .upsert(localData['tasks'], { onConflict: 'id' });

        if (tasksError) {
            return {
                status: 'Failure',
                message: `Data could not be synced to supabase database. Tasks Error: ${tasksError}.`,
            };
        }

        // 3️⃣ Sync work entries
        const { error: entriesError } = await supabaseClient
            .from('work_entries')
            .upsert(localData['workEntries'], { onConflict: 'id' });

        if (entriesError) {
            return {
                status: 'Failure',
                message: `Data could not be synced to supabase database. Work Entries Error: ${entriesError}.`,
            };
        };

        return {
            status: 'Success',
            message: `Local data synced to supabase database.`,
        };

    } catch (e) {
        return {
            status: 'Failure',
            message: `Data could not be synced to supabase database. Error ${e}.`,
        };
    }

    console.log('Sync complete!');
}

// Tries to import a json file as a database
export async function importCloudDatabaseCredentials(file: File) {
    try {
        const text = await file.text();
        const jsonData = JSON.parse(text);
        return {
            status: 'Success',
            message: `Cloud Database credentials uploaded.`,
            cloudCredentials: jsonData
        };
    } catch (e) {
        return {
            status: 'Failure',
            message: `Cloud Database credentials could not be uploaded.`,
        };
    }
}

// Sending individual Work Entry to Supabase Database
export const addWorkTaskSupabaseDatabase = async (supabaseClient: SupabaseClient, workTask: WorkTask): Promise<DatabaseActionResponse> => {
    try {
        const { error: entryError } = await supabaseClient
            .from('work_tasks')
            .upsert(workTask, { onConflict: 'id' });

        if (entryError) {
            return {
                status: 'Failure',
                message: `Work Topic wasn't inserted into supabase database. ${entryError}`,
            };
        }
        return {
            status: 'Success',
            message: `Work Task inserted into supabase database.`,
        };
    } catch (e) {
        return {
            status: 'Failure',
            message: `Work Topic wasn't inserted into supabase database. ${e}`,
        };
    }
};

// Sending individual Work Entry to Supabase Database
export const addWorkTopicSupabaseDatabase = async (supabaseClient: SupabaseClient, workTopic: WorkTopic): Promise<DatabaseActionResponse> => {
    try {
        const { error: entryError } = await supabaseClient
            .from('work_topics')
            .upsert(workTopic, { onConflict: 'id' });

        if (entryError) {
            return {
                status: 'Failure',
                message: `Work Topic wasn't inserted into supabase database. ${entryError}`,
            };
        }
        return {
            status: 'Success',
            message: `Work Topic inserted into supabase database.`,
        };
    } catch (e) {
        return {
            status: 'Failure',
            message: `Work Topic wasn't inserted into supabase database. ${e}`,
        };
    }
};

// Adding individual Work Entry to Supabase Database
export const addWorkEntrySupabaseDatabase = async (supabaseClient: SupabaseClient, workEntry: WorkEntry): Promise<DatabaseActionResponse> => {
    try {
        const { error: entryError } = await supabaseClient
            .from('work_entries')
            .upsert(workEntry, { onConflict: 'id' });

        if (entryError) {
            return {
                status: 'Failure',
                message: `Work Entry wasn't inserted into supabase database. ${entryError}`,
            };
        }
        return {
            status: 'Success',
            message: `Work Entry inserted into supabase database.`,
        };
    } catch (e) {
        return {
            status: 'Failure',
            message: `Work Entry wasn't inserted into supabase database. ${e}`,
        };
    }
};





