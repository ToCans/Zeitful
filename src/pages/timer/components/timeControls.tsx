// Component Imports
import TimeButton from './timeButton';
// Hook Imports
import { useSettings } from '../../../hooks/use-settings';

// Interface Definitions
interface TimerControlsProps {
	timeRemaining: number;
	setTimeRemaining: (time: number) => void;
}

// Component Definition
const TimerControls = ({ timeRemaining, setTimeRemaining }: TimerControlsProps) => {
	const settings = useSettings();
	return (
		<div className='row flex flex-row justify-center items-center w-full space-x-1'>
			{settings.timerRunning ? (
				<TimeButton
					purpose='Pause'
					timeRemaining={timeRemaining}
					setTimeRemaining={setTimeRemaining}
					setTimerRunning={settings.setTimerRunning}
				/>
			) : (
				<TimeButton
					purpose='Start'
					timeRemaining={timeRemaining}
					setTimeRemaining={setTimeRemaining}
					setTimerRunning={settings.setTimerRunning}
				/>
			)}

			<TimeButton
				purpose='Restart'
				timeRemaining={timeRemaining}
				setTimeRemaining={setTimeRemaining}
				setTimerRunning={settings.setTimerRunning}
			/>
			<TimeButton
				purpose='Skip'
				timeRemaining={timeRemaining}
				setTimeRemaining={setTimeRemaining}
				setTimerRunning={settings.setTimerRunning}
			/>
		</div>
	);
};

export default TimerControls;
