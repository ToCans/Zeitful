import type { WorkEntry, WorkTask } from '../types/types';

export const sortWorkEntries = (workEntries: WorkEntry[], method: 'dsc' | 'asc'): WorkEntry[] => {
    return [...workEntries].sort((a, b) => {
        const aTime = new Date(a.completion_time).getTime();
        const bTime = new Date(b.completion_time).getTime();

        return method === 'asc' ? aTime - bTime : bTime - aTime;
    });
};

export const sortWorkTasks = (workEntries: WorkEntry[], workTasks: WorkTask[]): WorkTask[] => {
    // Sort entries by descending completion_time
    const sortedWorkEntries = sortWorkEntries(workEntries, "dsc");

    const sortedWorkTasks: WorkTask[] = [];
    const seenTaskIds = new Set<string>(); // to avoid duplicates

    for (const entry of sortedWorkEntries) {
        if (entry.task_id && !seenTaskIds.has(entry.task_id)) {
            const task = workTasks.find(t => t.id === entry.task_id);
            if (task) {
                sortedWorkTasks.push(task);
                seenTaskIds.add(entry.task_id);
            }
        }
    }

    for (const task of workTasks) {
        if (!seenTaskIds.has(task.id)) {
            sortedWorkTasks.push(task);
            seenTaskIds.add(task.id);
        }
    }

    return sortedWorkTasks;
};



