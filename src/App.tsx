// Style Imports
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primereact/resources/primereact.min.css';
import './index.css';
// API Imports
import { getTasks } from './api/localDatabase';
import { getTopics } from './api/topics';
import { getWorkEntries } from './api/workEntries';
// Icon Imports
import { PrimeReactProvider } from 'primereact/api';
// React Imports
import { useState, useRef, useEffect } from 'react';
// Component and Context Imports
import NavBar from './components/NavBar/NavBar';
import UserPage from './pages/users/components/userPage';
import Settings from './pages/settings/components/settings';
import Statistics from './pages/statistics/components/statistics';
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
import { type Page, type WorkEntry, type WorkTask, type WorkTopic } from './types/types';
import type { SupabaseClient } from '@supabase/supabase-js';
// Utils Imports
import { getCurrentDate } from './utils/utils';

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
	const [cloudDatabase, setCloudDatabase] = useState<SupabaseClient | null>(null);

	// Default References
	const permission = useRef<string | null>(null);
	const subscription = useRef<PushSubscription | null>(null);
	const todayDate = useRef<string | null>(null);

	// Refernces for Cookies
	const workingTimeCompleted = useRef<number>(0);
	const workingCyclesCompleted = useRef<number>(0);

	// Audio and Webworker Definitions
	const breakFinishAudio = useRef<HTMLAudioElement | null>(null);
	const workFinishAudio = useRef<HTMLAudioElement | null>(null);

	// Reference for webworker
	const timerWorker = useRef<Worker | null>(null);

	// Local Storage Checks
	const [showTabTimer, setTabTimer] = useState<boolean>(() => {
		const value = checkLocalStorage('tabTimer', true);
		return typeof value === 'boolean' ? value : true;
	});
	const [workingTime, setWorkingTime] = useState<number>(() => {
		const value = checkLocalStorage('workingTime', 25 * 60);
		return typeof value === 'number' ? value : 5 * 60;
	});
	const [shortBreakTime, setShortBreakTime] = useState<number>(() => {
		const value = checkLocalStorage('shortBreakTime', 5 * 60);
		return typeof value === 'number' ? value : 5 * 60;
	});
	const [longBreakTime, setLongBreakTime] = useState<number>(() => {
		const value = checkLocalStorage('longBreakTime', 15 * 60);
		return typeof value === 'number' ? value : 15 * 60;
	});
	const [timerColor, setTimerColor] = useState<string>(() => {
		const value = checkLocalStorage('timerColor', 'bfdbfe');
		return typeof value === 'string' ? value : 'bfdbfe';
	});
	const [darkMode, setDarkMode] = useState<boolean>(() => {
		const value = checkLocalStorage('darkMode', false);
		return typeof value === 'boolean' ? value : false;
	});
	const [useCloudDatabase, setUseCloudDatabase] = useState<boolean>(() => {
		const value = checkLocalStorage('useCloudDatabase', false);
		return typeof value === 'boolean' ? value : false;
	});
	const [lastCloudDatabaseSync, setLastCloudDatabaseSync] = useState<string>(() => {
		const value = checkLocalStorage('lastCloudDatabaseSync', 'None');
		return typeof value === 'string' ? value : 'None';
	});

	// Push
	useEffect(() => {
		if ('serviceWorker' in navigator) {
			(async () => {
				try {
					const swRegistration = await navigator.serviceWorker.register('/sw.js');
					console.log('SW registered', swRegistration);

					const pushManager = swRegistration.pushManager;
					if (!pushManager) {
						console.warn('Push manager unsupported');
						return;
					}

					let permissionState = await pushManager.permissionState();
					permission.current = permissionState;

					if (permissionState === 'granted') {
						subscription.current = await pushManager.getSubscription();
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

	// Get the latest topics and tasks
	useEffect(() => {
		(async () => {
			setWorkTopics(await getTopics());
			setWorkTasks((await getTasks()).item as WorkTask[]);
			setWorkEntries(await getWorkEntries());
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
				darkMode
					? 'bg-zinc-800 text-zinc-100 fill-gray-200 hover:fill-gray-400'
					: 'bg-zinc-100 text-black fill-gray-400'
			} overflow-hidden`}
		>
			<PrimeReactProvider>
				<SettingsContext.Provider
					value={{
						showTabTimer,
						workingTime,
						shortBreakTime,
						longBreakTime,
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
						timerColor,
						cloudDatabase,
						useCloudDatabase,
						lastCloudDatabaseSync,
						darkMode,
						setActivePage,
						setTabTimer,
						setWorkingTime,
						setShortBreakTime,
						setLongBreakTime,
						setCycleNumber,
						setTimerRunning,
						setWorkTasks,
						setWorkTopics,
						setWorkEntries,
						setActiveWorkTask,
						setTimerColor,
						setCloudDatabase,
						setUseCloudDatabase,
						setLastCloudDatabaseSync,
						setDarkMode,
					}}
				>
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
