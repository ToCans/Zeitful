// Style Imports
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primereact/resources/primereact.min.css';
import './index.css';
// API Imports
import { getTasks, getTopics, getWorkEntries } from './api/localDatabase';
// Icon Imports
import { PrimeReactProvider } from 'primereact/api';
// React Imports
import { useState, useRef, useEffect } from 'react';
// Component and Context Imports
import NavBar from './components/NavBar/NavBar';
import UserPage from './pages/users/components/userPage';
import Settings from './pages/settings/components/settings';
import Statistics from './pages/statistics/components/statistics';
import { Toast } from 'primereact/toast';
import Timer from './pages/timer/components/timer';
import SettingsContext from './context/settingsContext';
// MP3 Imports
import breakFinishAudioClip from './assets/sounds/complete.mp3';
import workFinishAudioClip from './assets/sounds/lowHighChime.mp3';
// Script Imports
import timerWorkerScript from './scripts/timerWorker';
// Function Imports
import { checkLocalStorage } from './utils/utils';
//Type Imports
import {
	type Page,
	type WorkEntry,
	type WorkTask,
	type WorkTopic,
	type TimePeriod,
	type StatisticsTab,
	type Item,
} from './types/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
	PersistedAppSettings,
	PersistedTabSettings,
} from '../src/types/types';
// Utils Imports
import { getCurrentDate } from './utils/time';

// App Component
function App() {
	// Default States
	const [activePage, setActivePage] = useState<Page>('Timer');
	const [activeWorkTask, setActiveWorkTask] = useState<WorkTask | null>(null);
	const [cycleNumber, setCycleNumber] = useState<number>(1);
	const [timerRunning, setTimerRunning] = useState<boolean>(false);
	const [workTopics, setWorkTopics] = useState<WorkTopic[]>([]);
	const [workTasks, setWorkTasks] = useState<WorkTask[]>([]);
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([]);

	// Cloud Database
	const [cloudDatabase, setCloudDatabase] = useState<SupabaseClient | null>(
		null,
	);

	// Default References
	const permission = useRef<PermissionState | null>(null);
	const subscription = useRef<PushSubscription | null>(null);
	const todayDate = useRef<string | null>(null);
	const hasSyncedRef = useRef<boolean>(false);

	// Refernces for Cookies
	const workingTimeCompleted = useRef<number>(0);
	const workingCyclesCompleted = useRef<number>(0);

	// Audio and Webworker Definitions
	const breakFinishAudio = useRef<HTMLAudioElement | null>(null);
	const workFinishAudio = useRef<HTMLAudioElement | null>(null);

	// Reference for webworker
	const timerWorker = useRef<Worker | null>(null);

	// Toast Reference
	const toast = useRef<Toast>(null!);

	// Local Storage Checks
	const [appSettings, setAppSettings] = useState<PersistedAppSettings>(
		() => ({
			showTabTimer: checkLocalStorage('showTabTimer', true) as boolean,
			workingTime: checkLocalStorage('workingTime', 25 * 60) as number,
			shortBreakTime: checkLocalStorage(
				'shortBreakTime',
				5 * 60,
			) as number,
			longBreakTime: checkLocalStorage(
				'longBreakTime',
				15 * 60,
			) as number,
			timerColor: checkLocalStorage('timerColor', 'bfdbfe') as string,
			darkMode: checkLocalStorage('darkMode', false) as boolean,
			useCloudDatabase: checkLocalStorage(
				'useCloudDatabase',
				false,
			) as boolean,
			lastCloudDatabaseSync: checkLocalStorage(
				'lastCloudDatabaseSync',
				'None',
			) as string,
		}),
	);

	const [tabSettings, setTabSettings] = useState<PersistedTabSettings>(
		() => ({
			lastUsedPeriodTab: checkLocalStorage(
				'lastUsedPeriodTab',
				'M',
			) as TimePeriod,
			lastUsedStatisticsTab: checkLocalStorage(
				'lastUsedStatisticsTab',
				'Task',
			) as StatisticsTab,
			lastUsedUserPageTab: checkLocalStorage(
				'lastUsedUserPageTab',
				'Task',
			) as Item,
		}),
	);

	// Push
	useEffect(() => {
		if ('serviceWorker' in navigator) {
			(async () => {
				try {
					const swRegistration =
						await navigator.serviceWorker.register('/sw.js');
					console.log('SW registered', swRegistration);

					const pushManager = swRegistration.pushManager;
					if (!pushManager) {
						console.warn('Push manager unsupported');
						return;
					}

					const permissionState = await pushManager.permissionState();
					permission.current = permissionState;

					if (permissionState === 'granted') {
						subscription.current =
							await pushManager.getSubscription();
						console.log('Push registered', subscription.current);
					}
				} catch (e) {
					console.error('SW registration failed:', e);
				}
			})();
		}
	}, []);

	// Prevent Scrolling when Modal is Open
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	}, []);

	// Get the latest topics, tasks, and work entries
	useEffect(() => {
		(async () => {
			const topicResponse = await getTopics();
			const taskResponse = await getTasks();
			const workEntryResponse = await getWorkEntries();

			// Setting Topics
			if (topicResponse.status == 'Failure') {
				toast.current?.show({
					severity: 'error',
					summary: topicResponse.status,
					detail: topicResponse.message,
					life: 3000,
				});
			} else {
				setWorkTopics(topicResponse.item as WorkTopic[]);
			}

			// Setting Tasks
			if (taskResponse.status == 'Failure') {
				toast.current?.show({
					severity: 'error',
					summary: taskResponse.status,
					detail: taskResponse.message,
					life: 3000,
				});
			} else {
				setWorkTasks(taskResponse.item as WorkTask[]);
			}

			// Setting Work Entries
			if (workEntryResponse.status == 'Failure') {
				toast.current?.show({
					severity: 'error',
					summary: workEntryResponse.status,
					detail: workEntryResponse.message,
					life: 3000,
				});
			} else {
				setWorkEntries(workEntryResponse.item as WorkEntry[]);
			}
		})();
	}, []);

	useEffect(() => {
		// Setting refs
		todayDate.current = getCurrentDate();
		timerWorker.current = new Worker(timerWorkerScript);
		breakFinishAudio.current = new Audio(breakFinishAudioClip);
		workFinishAudio.current = new Audio(workFinishAudioClip);

		// Cleanup function
		return () => {
			if (timerWorker.current) {
				timerWorker.current.terminate();
			}
		};
	}, []); // Empty dependency array, so this runs only once on mount.

	return (
		<div
			className={`flex flex-col h-dvh w-dvw ${
				appSettings.darkMode
					? 'bg-zinc-800 text-zinc-100 fill-gray-200 hover:fill-gray-400'
					: 'bg-zinc-100 text-black fill-gray-400'
			} overflow-hidden`}
		>
			<PrimeReactProvider>
				<SettingsContext.Provider
					value={{
						cycleNumber,
						timerWorker,
						breakFinishAudio,
						workFinishAudio,
						workingTimeCompleted,
						workingCyclesCompleted,
						todayDate,
						timerRunning,
						permission,
						subscription,
						workTasks,
						workTopics,
						workEntries,
						activeWorkTask,
						cloudDatabase,
						hasSyncedRef,
						toast: toast.current,
						appSettings,
						tabSettings,
						setActivePage,
						setCycleNumber,
						setTimerRunning,
						setWorkTasks,
						setWorkTopics,
						setWorkEntries,
						setActiveWorkTask,
						setCloudDatabase,
						setAppSettings,
						setTabSettings,
					}}
				>
					<Toast ref={toast}></Toast>
					{/* Main content grows and centers */}
					<div className='flex-1 flex flex-col justify-center items-center overscroll-none'>
						{activePage === 'Timer' && <Timer />}
						{activePage === 'Statistics' && <Statistics />}
						{activePage === 'UserPage' && <UserPage />}
						{activePage === 'Settings' && <Settings />}
					</div>

					{/* Navbar pinned at bottom */}
					<NavBar
						activePage={activePage}
						timerWorker={timerWorker}
						setActivePage={setActivePage}
						setTimerRunning={setTimerRunning}
					/>
				</SettingsContext.Provider>
			</PrimeReactProvider>
		</div>
	);
}

export default App;
