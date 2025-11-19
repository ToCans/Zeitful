// Type Imports
import type { CloudDatabase, WorkEntry, WorkTopic } from '../types/types';
import type { SettingsContextType } from '../types/context';
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

    console.log('Sync complete!');
}

// Tries to import a json file as a database
export async function importCloudDatabaseCredentialile(file: File): Promise<CloudDatabase> {
    const text = await file.text();
    const jsonData = JSON.parse(text);
    return jsonData;
}

// Sending individual Work Entry to Supabase Database
async function sendToWorkEntrySupabaseDatabase(supabaseClient: SupabaseClient, workEntry: WorkEntry) {
    // 3️⃣ Sync work entries
    const { error: entryError } = await supabaseClient
        .from('work_entries')
        .upsert(workEntry, { onConflict: 'id' });

    if (entryError) throw entryError;

    console.log('Work Entry added to Cloud Database!');
}

export const handleAddWorkEntryToCloudDatabase = async (
    uuid: string,
    settings: SettingsContextType,
    workEntry: Omit<WorkEntry, 'id' | 'duration' | 'topic_name' | 'completion_time'>,
    workTopics: WorkTopic[]
) => {
    // Non Selected Data
    if (settings.cloudDatabase) {
        const matchedTopic = workTopics.find((workTopic) => workTopic.id === workEntry.topic_id);
        await sendToWorkEntrySupabaseDatabase(settings.cloudDatabase, {
            id: uuid,
            task_id: workEntry.task_id,
            topic_id: workEntry.topic_id,
            task_name: workEntry.task_name,
            topic_name: matchedTopic?.name ?? null,
            duration: settings.workingTime / 60,
            completion_time: new Date(),
        });
    }
};

