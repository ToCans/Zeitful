// Utils Imports
import { formatTime } from '../../../utils/utils';

// Interface Definitions
interface TimeDisplayProps {
	timeRemaining: number;
}

const TimeDisplay = ({ timeRemaining }: TimeDisplayProps) => {
	const time = formatTime(timeRemaining);

	return (
		<p
			className='sm:text-9xl text-center text-8xl select-none opacity-100'
		>
			{time}
		</p>
	);
};

export default TimeDisplay;
