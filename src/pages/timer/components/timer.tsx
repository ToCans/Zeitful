//  API Imports
import { sendPushNotification } from '../api/push-notification';
import { addWorkEntry, getWorkEntries } from '../../../api/localDatabase';
import { addWorkEntrySupabaseDatabase } from '../../../api/cloudDatabase';
// Component Imports
import TimeDisplay from './timeDisplay';
import TimerControls from './timeControls';
import WavesAnimation from './wavesAnimation';
import TaskFocus from './taskFocus';
import CloudSyncStatusTile from './cloudSyncStatus';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
// React Imports
import { useState, useEffect, useRef, useCallback } from 'react';
// Type Imports
import type { SettingsContextType } from '../../../types/context';
import type { WorkEntry, WorkTopic } from '../../../types/types';
// Utils Imports
import { playAudio } from '../utils/audio';
import { formatTime } from '../../../utils/time';
import { v4 as uuidv4 } from 'uuid';

// Component Definition
const Timer = () => {
	// Settings Context
	const settings = useAppContext();

	// Component States
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [timeRemaining, setTimeRemaining] = useState<number>(
		settings.workingTime
	);
	const [progressBarValue, setProgressBarValue] = useState<number>(0);

	// References
	const progressBarTotalRef = useRef<number>(settings.workingTime);
	const timeRemainingRef = useRef<number>(timeRemaining);

	// Helper Functions Memos
	const handleAddWorkEntry = useCallback(
		async (
			uuid: string,
			settings: SettingsContextType,
			workEntry: Omit<
				WorkEntry,
				'id' | 'duration' | 'topic_name' | 'completion_time'
			>,
			workTopics: WorkTopic[]
		) => {
			const matchedTopic = workTopics.find(
				(workTopic) => workTopic.id === workEntry.topic_id
			);
			const response = await addWorkEntry({
				id: uuid,
				task_id: workEntry.task_id,
				topic_id: workEntry.topic_id,
				task_name: workEntry.task_name,
				topic_name: matchedTopic?.name ?? null,
				duration: settings.workingTime / 60,
				completion_time: new Date().toISOString(),
			});

			console.log(response.status, response.message);
			settings.setWorkEntries(
				(await getWorkEntries()).item as WorkEntry[]
			);
		},
		[]
	);

	const handleAddWorkEntryToCloudDatabase = useCallback(
		async (
			uuid: string,
			settings: SettingsContextType,
			workEntry: Omit<
				WorkEntry,
				'id' | 'duration' | 'topic_name' | 'completion_time'
			>,
			workTopics: WorkTopic[]
		) => {
			if (settings.cloudDatabase) {
				const matchedTopic = workTopics.find(
					(workTopic) => workTopic.id === workEntry.topic_id
				);
				const response = await addWorkEntrySupabaseDatabase(
					settings.cloudDatabase,
					{
						id: uuid,
						task_id: workEntry.task_id,
						topic_id: workEntry.topic_id,
						task_name: workEntry.task_name,
						topic_name: matchedTopic?.name ?? null,
						duration: settings.workingTime / 60,
						completion_time: new Date().toISOString(),
					}
				);
				console.log(response.status, response.message);
			}
		},
		[]
	);

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
					settings.workingTimeCompleted.current += Math.floor(
						settings.workingTime / 60
					);
					settings.workingCyclesCompleted.current += 1;

					// Defininig Shared UUID between local and cloud entries
					const id = uuidv4();

					// Storing Work Entry Data locally
					await handleAddWorkEntry(
						id,
						settings,
						{
							task_id: settings.activeWorkTask?.id ?? null,
							topic_id: settings.activeWorkTask?.topic_id ?? null,
							task_name: settings.activeWorkTask?.name ?? null,
						},
						settings.workTopics
					);

					// Storing Work Entry to  Cloud Database
					if (settings.cloudDatabase) {
						await handleAddWorkEntryToCloudDatabase(
							id,
							settings,
							{
								task_id: settings.activeWorkTask?.id ?? null,
								topic_id:
									settings.activeWorkTask?.topic_id ?? null,
								task_name:
									settings.activeWorkTask?.name ?? null,
							},
							settings.workTopics
						);
					}
				}

				// Sending Push Notification
				await sendPushNotification(settings);

				// Incrementing Cycle
				settings.setCycleNumber(settings.cycleNumber + 1);
			}
		};
	}, [settings, handleAddWorkEntry, handleAddWorkEntryToCloudDatabase]);

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
		const calculatedProgressBarValue =
			(1 - timeRemaining / progressBarTotalRef.current) * 100;
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
			className={`relative p-4 short-laptop:h-4/5 md:max-h-[66vh] md:h-[66vh] max-h-[80vh] h-[80vh] xl:w-1/2 md:w-2/3 w-11/12 rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 duration ease-out ${isMounted
				? 'translate-y-0 opacity-100'
				: '-translate-y-full opacity-0'
				} `}
		>
			{/* Fill Layer (grows from bottom to top) */}
			<WavesAnimation
				progress={progressBarValue}
				timerColor={settings.timerColor}
			/>

			{/* Content Layer */}
			<div className='relative z-20 w-full h-full flex flex-col rounded-lg p-5 justify-center items-center space-y-2'>
				<TimeDisplay timeRemaining={timeRemaining} />
				<div className='relative flex rounded-lg items-center justify-center opacity-70'>
					<TaskFocus />
					{settings.useCloudDatabase ? (
						<div className='absolute right-full mr-2'>
							<CloudSyncStatusTile />
						</div>
					) : null}
				</div>
				<TimerControls
					timeRemaining={timeRemaining}
					setTimeRemaining={setTimeRemaining}
				/>
				<p className='sm:text-xl text-center select-none'>
					Current Cycle: {Math.ceil(settings.cycleNumber / 2)}
				</p>
			</div>

			<div
				className={`absolute inset-0 ${settings.darkMode ? 'bg-zinc-700' : 'bg-white'
					} rounded-lg z-0`}
			></div>
		</div>
	);
};

export default Timer;
