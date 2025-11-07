//  API Imports
import { sendPushNotification } from '../api/push-notification';
// Component Imports
import TimeDisplay from './timeDisplay';
import TimerControls from './timeControls';
import WavesAnimation from './wavesAnimation';
import TaskFocus from './taskFocus';
// Hook Imports
import { useSettings } from '../../../hooks/use-settings';
// Interface Imports
// import { InputData } from '../../../api/study-data';
// React Imports
import { useState, useEffect, useRef } from 'react';
// Utils Imports
import { playAudio } from '../utils/audio';
import { formatTime } from '../../../utils/utils';
import { handleAddWorkEntry } from '../../../api/database';

// Component Definition
const Timer = () => {
	// Settings Context
	const settings = useSettings();

	// Component States
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [timeRemaining, setTimeRemaining] = useState<number>(settings.workingTime);
	const [progressBarValue, setProgressBarValue] = useState<number>(0);

	// References
	const progressBarTotalRef = useRef<number>(settings.workingTime);
	const timeRemainingRef = useRef<number>(timeRemaining);

	// Trigger the slide-in animation on component mount
	useEffect(() => {
		// Delay to ensure the component mounts first, then triggers animation
		const timeout = setTimeout(() => {
			setIsMounted(true);
		}, 10); // Small delay, e.g., 10ms, to ensure transition triggers

		return () => {
			clearTimeout(timeout);
			setIsMounted(false);
		};
	}, []);

	// End of Timer handling
	useEffect(() => {
		if (!settings.timerWorker.current) {
			return;
		}
		settings.timerWorker.current.onmessage = async (e) => {
			timeRemainingRef.current = e.data.timeRemaining;
			setTimeRemaining(timeRemainingRef.current);
			if (e.data.timeRemaining === 0) {
				settings.setTimerRunning(false);
				// Break Cycle Handling
				if (settings.cycleNumber % 2 === 0) {
					playAudio(settings.breakFinishAudio);
				}
				// Work Cycle Handling
				else {
					playAudio(settings.workFinishAudio);

					// Local Storage Completion
					settings.workingTimeCompleted.current += Math.floor(settings.workingTime / 60);
					settings.workingCyclesCompleted.current += 1;
				}

				// Sending Push Notification
				await sendPushNotification(settings);

				// Incrementing Cycle
				settings.setCycleNumber(settings.cycleNumber + 1);

				// Storing Work Entry Data
				await handleAddWorkEntry(
					settings,
					{
						task_id: settings.activeWorkTask?.id ?? null,
						topic_id: settings.activeWorkTask?.topic_id ?? null,
						task_name: settings.activeWorkTask?.name ?? null,
					},
					settings.workTopics
				);
			}
		};
	}, [settings]);

	// Showing Tab Timer
	useEffect(() => {
		if (settings.showTabTimer === true) {
			document.title = `${formatTime(timeRemaining)} - Zeitful`;
		} else {
			document.title = 'Zeitful';
		}
	}, [timeRemaining, settings]);

	// Timer Progress Handling
	useEffect(() => {
		let calculatedProgressBarValue = (1 - timeRemaining / progressBarTotalRef.current) * 100;
		setProgressBarValue(calculatedProgressBarValue);
	}, [timeRemaining, progressBarTotalRef]);

	// Time Remaining Handling
	useEffect(() => {
		if (settings.cycleNumber % 8 === 0) {
			setTimeRemaining(settings.longBreakTime);
			progressBarTotalRef.current = settings.longBreakTime;
		} else if (settings.cycleNumber % 2 === 0) {
			setTimeRemaining(settings.shortBreakTime);
			progressBarTotalRef.current = settings.shortBreakTime;
		} else {
			setTimeRemaining(settings.workingTime);
			progressBarTotalRef.current = settings.workingTime;
		}
	}, [
		settings.cycleNumber,
		settings.longBreakTime,
		settings.shortBreakTime,
		settings.workingTime,
	]);

	return (
		<div
			className={`relative p-4 w-4/5 md:w-3/5 xl:w-2/5 h-1/2 rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 duration ease-out ${
				isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
			}`}
		>
			{/* Fill Layer (grows from bottom to top) */}
			<WavesAnimation progress={progressBarValue} timerColor={settings.timerColor} />

			{/* Content Layer */}
			<div className='relative z-20 w-full h-full flex flex-col rounded-lg p-5 justify-center items-center space-y-2'>
				<TimeDisplay timeRemaining={timeRemaining} />
				<TaskFocus />
				<TimerControls timeRemaining={timeRemaining} setTimeRemaining={setTimeRemaining} />
				<p className='sm:text-xl text-center select-none'>
					Current Cycle: {Math.ceil(settings.cycleNumber / 2)}
				</p>
			</div>

			<div className='absolute inset-0 bg-white rounded-lg z-0'></div>
		</div>
	);
};

export default Timer;
