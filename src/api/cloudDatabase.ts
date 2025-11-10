import type { CloudDatabase } from '../types/types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Supabase Request
export async function getFromSupabaseDatabase(supabaseClient: SupabaseClient) {
    const [{ data: topics, error: topicsError },
        { data: tasks, error: tasksError },
        { data: workEntries, error: entriesError }] = await Promise.all([
            supabaseClient.from('work_topics').select('*'),
            supabaseClient.from('work_tasks').select('*'),
            supabaseClient.from('work_entries').select('*')
        ]);

    if (topicsError || tasksError || entriesError)
        throw topicsError || tasksError || entriesError;

    return { topics, tasks, workEntries };
}

export async function sendToSupabaseDatabase(supabaseClient: SupabaseClient, localData: any) {
    // 1️⃣ Sync topics
    const { error: topicsError } = await supabaseClient
        .from('work_topics')
        .upsert(localData['topics'], { onConflict: 'id' });

    if (topicsError) throw topicsError;

    // 2️⃣ Sync tasks
    const { error: tasksError } = await supabaseClient
        .from('work_tasks')
        .upsert(localData['tasks'], { onConflict: 'id' });

    if (tasksError) throw tasksError;

    // 3️⃣ Sync work entries
    const { error: entriesError } = await supabaseClient
        .from('work_entries')
        .upsert(localData['workEntries'], { onConflict: 'id' });

    if (entriesError) throw entriesError;

    console.log('✅ Sync complete!');
}

// Tries to import a json file as a database
export async function importCloudDatabaseCredentialile(file: File): Promise<CloudDatabase> {
    const text = await file.text();
    const jsonData = JSON.parse(text);
    return jsonData;
}

