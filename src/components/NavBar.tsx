// API Imports
import { sendTimerWorkerMessage } from '../services/service-worker';

// Component Imports
import ActiveNavBarUnderline from './activeNavBarUnderline';
import { Button } from 'primereact/button';

// Icon Imports
import { PiClockCountdown, PiChartBar, PiUserCircle, PiGear } from "react-icons/pi";

// Type Imports
import type { Page } from '../types/types';

// Interface Definition
interface NavBarProps {
    activePage: string;
    timerWorker: React.RefObject<Worker | null>; // using ref for .current
    setActivePage: (activePage: Page) => void;
    setTimerRunning: (timerRunning: boolean) => void;
}

// Component Definition
const NavBar = ({
    activePage,
    timerWorker,
    setActivePage,
    setTimerRunning,
}: NavBarProps) => {
    // Toggle Page Functionality
    const togglePage = (targetPage: Page) => {
        setActivePage(activePage !== targetPage ? targetPage : 'Timer');
    };

    return (
        <div className="flex flex-col absolute bottom-0 w-full justify-center items-center">
            <div className="flex flex-row w-fitjustify-center min-h-14 bg-zinc-100 rounded-t-lg p-1 inset-shadow-md gap-2">
                {/* Timer Button */}
                <Button unstyled className="focus:outline-none focus:ring-0 opacity-50" icon={() => <div className="relative flex flex-col items-center">
                    <PiClockCountdown className={`size-10 fill-black opacity-75 ${activePage === "Timer" ? '90' : ''}`} />
                    <ActiveNavBarUnderline active={activePage === "Timer"} />
                </div>} /*tooltip="Timer"*/ onClick={() => togglePage("Timer")} />

                {/* Statistics Button */}
                <Button unstyled className="focus:outline-none focus:ring-0 opacity-50" icon={() => <div className="relative flex flex-col items-center">
                    <PiChartBar className={`size-10 fill-black opacity-75 ${activePage === "Stats" ? '90' : ''}`} />
                    <ActiveNavBarUnderline active={activePage === "Statistics"} />
                </div>} /*tooltip="Timer"*/ onClick={() => togglePage("Statistics")} />

                {/* User Button */}
                <Button unstyled className="focus:outline-none focus:ring-0 opacity-50" icon={() => <div className="relative flex flex-col items-center">
                    <PiUserCircle className={`size-10 fill-black opacity-75 ${activePage === "User" ? '90' : ''}`} />
                    <ActiveNavBarUnderline active={activePage === "AuthPage"} />
                </div>} /*tooltip="Timer"*/ onClick={() => togglePage("AuthPage")} />

                {/* Settings Button */}
                <Button unstyled className="focus:outline-none focus:ring-0 opacity-50" icon={() => <div className="relative flex flex-col items-center">
                    <PiGear className={`size-10 fill-black opacity-75 ${activePage === "Settings" ? '90' : ''}`} />
                    <ActiveNavBarUnderline active={activePage === "Settings"} />
                </div>} /*tooltip="Timer"*/ onClick={() => {
                    togglePage('Settings');
                    setTimerRunning(false);
                    sendTimerWorkerMessage({
                        timerWorker: timerWorker.current,
                        runningBoolean: false,
                        timeRemaining: null
                    });
                }} />
            </div>
        </div>
    );
};

export default NavBar;