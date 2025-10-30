// Style Imports
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primereact/resources/primereact.min.css';
import './index.css';

// Icon Imports
import { PrimeReactProvider } from 'primereact/api';

// React Imports
import { useState, useRef, useEffect } from 'react';

// Component and Context Imports
import NavBar from './components/NavBar';
import AuthPage from './pages/users/components/authPage';
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
//Type Imports
import type { WorkItem } from './types/work-item';
import type { Page } from './types/types';

// Utils Imports
import { getCurrentDate } from './utils/utils';

// App Component
function App() {
  // Default States
  const [activePage, setActivePage] = useState<Page>('Timer');
  const [activeWorkItem, setActiveWorkItem] = useState<WorkItem | null>(null);
  const [cycleNumber, setCycleNumber] = useState<number>(1);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);

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

  const [waveColor, setWaveColor] = useState<string>(() => {
    const value = checkLocalStorage('waveColor', 'bfdbfe');
    return typeof value === 'string' ? value : 'bfdbfe';
  });

  // Register the service worker
  useEffect(() => {
    // Check if the browser supports service workers
    if ('serviceWorker' in navigator) {
      // Triggered on load
      window.addEventListener('load', async () => {
        try {
          // Regiistering Software
          const swRegistration = await navigator.serviceWorker.register('./sw.js');
          console.log('Service worker registration succeeded:', swRegistration);

          // Push Manager Handling
          const pushManager = swRegistration.pushManager;
          if (!pushManager) {
            console.warn('Push Manager not available');
            return;
          }

          // Gathering Permissoin State
          let permissionState = await pushManager.permissionState();
          if (permissionState === 'prompt') {
            console.log('Permission prompt');
            permission.current = permissionState;
          } else if (permissionState === 'granted') {
            console.log('Permission granted');
            permission.current = permissionState;
            subscription.current = await pushManager.getSubscription();
            console.log('Push subscription', subscription.current);
          } else {
            console.log('Permission denied');
            permission.current = permissionState;
          }
        } catch (e) {
          console.log('Error registering service worker', e);
        }
      });
    } else {
      console.log("Can't load service worker");
    }
  }, []);

  // Prevent Scrolling when Modal is Open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
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
    <div className='flex flex-col h-dvh w-dvw bg-zinc-100 overflow-hidden'>
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
            workItems,
            activeWorkItem,
            waveColor,
            setActivePage,
            setTabTimer,
            setWorkingTime,
            setShortBreakTime,
            setLongBreakTime,
            setCycleNumber,
            setTimerRunning,
            setWorkItems,
            setActiveWorkItem,
            setWaveColor,
          }}
        >
          {/* Main content grows and centers */}
          <div className='flex-1 flex flex-col justify-center items-center bg-no-repeat bg-cover bg-center overscroll-none'>
            {activePage === 'Timer' && <Timer />}
            {activePage === 'Statistics' && <Statistics />}
            {activePage === 'AuthPage' && <AuthPage />}
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
