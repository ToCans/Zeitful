// Type Imports
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Dispatch, RefObject } from 'react';
import type { Page, WorkTask, WorkTopic, WorkEntry } from './types';

// Interface Defintion
export interface SettingsContextType {
	showTabTimer: boolean;
	workingTime: number;
	shortBreakTime: number;
	longBreakTime: number;
	cycleNumber: number;
	timerWorker: RefObject<Worker | null>;
	breakFinishAudio: RefObject<HTMLAudioElement | null>;
	workFinishAudio: RefObject<HTMLAudioElement | null>;
	workingTimeCompleted: RefObject<number>;
	workingCyclesCompleted: RefObject<number>;
	todayDate: RefObject<string | null>;
	timerRunning: boolean;
	permission: RefObject<any>;
	subscription: RefObject<PushSubscription | null>;
	workTopics: WorkTopic[];
	workTasks: WorkTask[];
	workEntries: WorkEntry[];
	activeWorkTask: WorkTask | null;
	timerColor: string;
	cloudDatabase: SupabaseClient | null;
	useCloudDatabase: boolean;
	lastCloudDatabaseSync: string;
	darkMode: boolean;
	hasSyncedRef: RefObject<boolean>;
	setActivePage: Dispatch<React.SetStateAction<Page>>;
	setTabTimer: Dispatch<React.SetStateAction<boolean>>;
	setWorkingTime: Dispatch<React.SetStateAction<number>>;
	setShortBreakTime: Dispatch<React.SetStateAction<number>>;
	setLongBreakTime: Dispatch<React.SetStateAction<number>>;
	setCycleNumber: Dispatch<React.SetStateAction<number>>;
	setTimerRunning: Dispatch<React.SetStateAction<boolean>>;
	setWorkTasks: Dispatch<React.SetStateAction<WorkTask[]>>;
	setWorkTopics: Dispatch<React.SetStateAction<WorkTopic[]>>;
	setWorkEntries: Dispatch<React.SetStateAction<WorkEntry[]>>;
	setActiveWorkTask: Dispatch<React.SetStateAction<WorkTask | null>>;
	setTimerColor: Dispatch<React.SetStateAction<string>>;
	setUseCloudDatabase: Dispatch<React.SetStateAction<boolean>>;
	setCloudDatabase: Dispatch<React.SetStateAction<SupabaseClient | null>>;
	setLastCloudDatabaseSync: Dispatch<React.SetStateAction<string>>;
	setDarkMode: Dispatch<React.SetStateAction<boolean>>;
}
