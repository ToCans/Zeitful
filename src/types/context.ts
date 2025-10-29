// Type Imports
import type { Dispatch, RefObject } from 'react';
import type { WorkItem } from './work-item';
import type { Page } from './types';

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
	workItems: WorkItem[];
	activeWorkItem: WorkItem | null;
	waveColor: string;
	setActivePage: Dispatch<React.SetStateAction<Page>>;
	setTabTimer: Dispatch<React.SetStateAction<boolean>>;
	setWorkingTime: Dispatch<React.SetStateAction<number>>;
	setShortBreakTime: Dispatch<React.SetStateAction<number>>;
	setLongBreakTime: Dispatch<React.SetStateAction<number>>;
	setCycleNumber: Dispatch<React.SetStateAction<number>>;
	setTimerRunning: Dispatch<React.SetStateAction<boolean>>;
	setWorkItems: Dispatch<React.SetStateAction<WorkItem[]>>;
	setActiveWorkItem: Dispatch<React.SetStateAction<WorkItem | null>>;
	setWaveColor: Dispatch<React.SetStateAction<string>>;
}
