// API Imports
import { subscribeToPush } from '../api/push-notification';
// Type Defintions
import type { SettingsContextType } from '../../../types/context';

// Interface Definition for Timer Worker
export interface TimerWorkerMessageProps {
	timerWorker: Worker | null;
	runningBoolean: boolean;
	timeRemaining: number | null;
}

// Sending Time Worker Message
export const sendTimerWorkerMessage = ({
	timerWorker,
	runningBoolean,
	timeRemaining,
}: TimerWorkerMessageProps) => {
	// Post message to the timer service worker if it exists
	if (timerWorker) {
		timerWorker.postMessage({
			timerRunning: runningBoolean,
			timeRemaining: timeRemaining,
		});
	}
};

// Interface Defintion for Timer Controls
interface timerControlsProps {
	settings: SettingsContextType;
	timeRemaining: number;
	setTimerRunning: (timerRunning: boolean) => void;
	setTimeRemaining?: (timeRemaining: number) => void;
}

// Start Timer Functionality
export const startTimer = async ({
	settings,
	timeRemaining,
	setTimerRunning,
}: timerControlsProps) => {
	if (settings.permission.current === 'prompt') {
		await subscribeToPush(settings);
	}
	sendTimerWorkerMessage({
		timerWorker: settings.timerWorker.current,
		runningBoolean: true,
		timeRemaining: timeRemaining,
	});
	setTimerRunning(true);
};

// Pause Timer Functionality
export const pauseTimer = async ({
	settings,
	timeRemaining,
	setTimerRunning,
}: timerControlsProps) => {
	if (settings.permission.current === 'prompt') {
		await subscribeToPush(settings);
	}
	sendTimerWorkerMessage({
		timerWorker: settings.timerWorker.current,
		runningBoolean: false,
		timeRemaining: timeRemaining,
	});
	setTimerRunning(false);
};

// Restart Timer Functionality
export const restartTimer = async ({
	settings,
	setTimerRunning,
	setTimeRemaining,
}: timerControlsProps) => {
	if (settings.permission.current === 'prompt') {
		await subscribeToPush(settings);
	}
	sendTimerWorkerMessage({
		timerWorker: settings.timerWorker.current,
		runningBoolean: false,
		timeRemaining: null,
	});
	setTimerRunning(false);

	if (setTimeRemaining) {
		if (settings.cycleNumber % 8 === 0) {
			setTimeRemaining(settings.longBreakTime);
		} else if (settings.cycleNumber % 2 === 0) {
			setTimeRemaining(settings.shortBreakTime);
		} else {
			setTimeRemaining(settings.workingTime);
		}
	}
};

// Skip Timer Functionality
export const skipTimer = async ({ settings, setTimerRunning }: timerControlsProps) => {
	if (settings.permission.current === 'prompt') {
		await subscribeToPush(settings);
	}
	sendTimerWorkerMessage({
		timerWorker: settings.timerWorker.current,
		runningBoolean: false,
		timeRemaining: null,
	});
	setTimerRunning(false);
	settings.setCycleNumber(settings.cycleNumber + 1);
};
