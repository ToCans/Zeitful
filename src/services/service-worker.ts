// src/services/service-worker.ts

export interface TimerWorkerMessageProps {
	timerWorker: Worker | null,
	runningBoolean: boolean,
	timeRemaining: number | null
}

export const sendTimerWorkerMessage = ({
	timerWorker,
	runningBoolean,
	timeRemaining
}: TimerWorkerMessageProps
) => {
	// Post message to the worker if it exists
	if (timerWorker) {
		timerWorker.postMessage({
			timerRunning: runningBoolean,
			timeRemaining: timeRemaining,
		});
	}
};
