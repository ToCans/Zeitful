// API Imports
import { sendTimerWorkerMessage } from '../../pages/timer/api/timer-controls';
// Component Imports
import ActiveNavBarUnderline from './activeNavBarUnderline';
import ConfirmationModal from './confirmationModal';
// Context Imports
import { IconContext } from "react-icons";
// Hook Imports
import { useAppContext } from '../../hooks/useAppContext';
// Icon Imports
import { PiClockCountdown, PiChartBar, PiUserCircle, PiGear } from 'react-icons/pi';
// React Imports
import { useState } from 'react';
// Type Imports
import type { Page } from '../../types/types';

// Interface Definition
interface NavBarProps {
	activePage: string;
	timerWorker: React.RefObject<Worker | null>;
	setActivePage: (activePage: Page) => void;
	setTimerRunning: (timerRunning: boolean) => void;
}

// Component Definition
const NavBar = ({ activePage, timerWorker, setActivePage, setTimerRunning }: NavBarProps) => {
	const [showConfirm, setShowConfirm] = useState(false);
	const settings = useAppContext();

	// Handle Settings Click with Confirmation
	const handleSettingsClick = () => {
		if (settings.timerRunning === true) {
			setShowConfirm(true);
		}
		else {
			confirmSettingsNavigation();
		}
	};

	// Confirm Settings Navigation
	const confirmSettingsNavigation = () => {
		togglePage('Settings');
		setTimerRunning(false);
		sendTimerWorkerMessage({
			timerWorker: timerWorker.current,
			runningBoolean: false,
			timeRemaining: null,
		});
		setShowConfirm(false);
	};


	// Toggle Page Functionality
	const togglePage = (targetPage: Page) => {
		setActivePage(activePage !== targetPage ? targetPage : 'Timer');
	};

	return (
		<div>
			{/* Confirmation Modal */}
			{showConfirm && (
				<ConfirmationModal timerWorker={timerWorker} togglePage={togglePage} setTimerRunning={setTimerRunning} setShowConfirm={setShowConfirm} sendTimerWorkerMessage={sendTimerWorkerMessage} />
			)}

			<div className='flex flex-col absolute bottom-0 w-full justify-center items-center min-h-14'>
				<div className='relative flex flex-row justify-center rounded-t-lg inset-shadow-md gap-2 p-2'>
					{/* Timer Button */}
					<div className='flex flex-col items-center'>
						<IconContext.Provider
							value={{
								className: `size-10 transition-opacity ${activePage === 'Timer'
									? 'opacity-70'
									: 'opacity-50 hover:opacity-85'
									}`,
							}}
						>
							<PiClockCountdown onClick={() => togglePage("Timer")} />
						</IconContext.Provider>
						<ActiveNavBarUnderline active={activePage === 'Timer'} />
					</div>

					{/* Statistics */}
					<div className='flex flex-col items-center'>
						<IconContext.Provider
							value={{
								className: `size-10 transition-opacity ${activePage === 'Statistics'
									? 'opacity-70'
									: 'opacity-50 hover:opacity-85'
									}`,
							}}
						>
							<PiChartBar onClick={() => togglePage("Statistics")} />
						</IconContext.Provider>
						<ActiveNavBarUnderline active={activePage === 'Statistics'} />
					</div>

					{/* User Page */}
					<div className='flex flex-col items-center'>
						<IconContext.Provider
							value={{
								className: `size-10 transition-opacity ${activePage === 'UserPage'
									? 'opacity-70'
									: 'opacity-50 hover:opacity-85'
									}`,
							}}
						>
							<PiUserCircle onClick={() => togglePage("UserPage")} />
						</IconContext.Provider>
						<ActiveNavBarUnderline active={activePage === 'UserPage'} />
					</div>

					{/* Settings */}
					<div className='flex flex-col items-center'>
						<IconContext.Provider
							value={{
								className: `size-10 transition-opacity ${activePage === 'Settings'
									? 'opacity-70'
									: 'opacity-50 hover:opacity-85'
									}`,
							}}
						>
							<PiGear onClick={() => {
								handleSettingsClick();
							}} />
						</IconContext.Provider>
						<ActiveNavBarUnderline active={activePage === 'Settings'} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
