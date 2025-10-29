// API Imports
import { startTimer, pauseTimer, restartTimer, skipTimer } from '../api/timer-controls';

// Hook Imports
import { useSettings } from '../../../hooks/use-settings';

// Icon Imports
import { IconContext } from 'react-icons';
import {
	PiPlayDuotone,
	PiPauseDuotone,
	PiSkipForwardDuotone,
	PiArrowCounterClockwise,
} from 'react-icons/pi';


// Interface Definitions
interface TimeButtonProps {
	purpose: 'Start' | 'Pause' | 'Restart' | 'Skip';
	timeRemaining: number;
	setTimeRemaining: (time: number) => void;
	setTimerRunning: (isRunning: boolean) => void;
}

// Component Definition
const TimeButton = ({
	purpose,
	timeRemaining,
	setTimeRemaining,
	setTimerRunning,
}: TimeButtonProps) => {
	const settings = useSettings();

	// Start Button Handling
	if (purpose === 'Start') {
		return (
			<IconContext.Provider value={{ className: 'timerButton' }}>
				<PiPlayDuotone
					id='startButton'
					onClick={async () => {
						startTimer({ settings: settings, timeRemaining, setTimerRunning: setTimerRunning });
					}}
					className='size-8'
				/>
			</IconContext.Provider>
		);
	}
	// Pause Button Handling
	else if (purpose === 'Pause') {
		return (
			<IconContext.Provider value={{ className: 'timerButton' }}>
				<PiPauseDuotone
					id='pauseButton'
					onClick={async () => {
						pauseTimer({ settings: settings, timeRemaining, setTimerRunning: setTimerRunning });
					}}
					className='size-8'
				/>
			</IconContext.Provider>
		);
	}
	// Restart Button Handling
	else if (purpose === 'Restart') {
		return (
			<IconContext.Provider value={{ className: 'timerButton' }}>
				<PiArrowCounterClockwise
					id='restartButton'
					onClick={async () => {
						restartTimer({ settings: settings, timeRemaining, setTimerRunning: setTimerRunning, setTimeRemaining: setTimeRemaining });
					}}
					className='size-8'
				/>
			</IconContext.Provider>
		);
	}
	// Skip Button Handling
	else {
		return (
			<IconContext.Provider value={{ className: 'timerButton' }}>
				<PiSkipForwardDuotone
					id='skipButton'
					onClick={async () => {
						skipTimer({ settings: settings, timeRemaining, setTimerRunning: setTimerRunning, setTimeRemaining: setTimeRemaining });
					}}
					className='size-8'
				/>
			</IconContext.Provider>
		);
	}
};

export default TimeButton;
