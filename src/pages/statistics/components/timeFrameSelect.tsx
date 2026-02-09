// Component Imports
import { Button } from 'primereact/button';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
// Type Imports
import type { PersistedTabSettings } from '../../../types/types';

interface timeFrameSelectionProps {
	timeFrame: 'W' | 'M' | 'Y' | string;
}

const TimeFrameSelection = ({ timeFrame }: timeFrameSelectionProps) => {
	// Settings Context
	const settings = useAppContext();
	return (
		<div className='flex flex-row justify-between w-full'>
			<p className='text-2xl font-normal'>
				{timeFrame === 'W'
					? 'Weekly Stats'
					: timeFrame === 'M'
						? 'Monthly Stats'
						: 'Yearly Stats'}
			</p>
			<div className='flex flex-row gap-2'>
				<Button
					className={`${
						timeFrame === 'W'
							? 'opacity-100'
							: 'opacity-50 hover:opacity-100'
					}`}
					unstyled
					onClick={() =>
						settings.setTabSettings(
							(prev: PersistedTabSettings) => ({
								...prev,
								lastUsedPeriodTab: 'W',
							}),
						)
					}
				>
					W
				</Button>
				<Button
					className={`${
						timeFrame === 'M'
							? 'opacity-100'
							: 'opacity-50 hover:opacity-100'
					}`}
					unstyled
					onClick={() =>
						settings.setTabSettings(
							(prev: PersistedTabSettings) => ({
								...prev,
								lastUsedPeriodTab: 'M',
							}),
						)
					}
				>
					M
				</Button>
				<Button
					className={`${
						timeFrame === 'Y'
							? 'opacity-100'
							: 'opacity-50 hover:opacity-100'
					}`}
					unstyled
					onClick={() =>
						settings.setTabSettings(
							(prev: PersistedTabSettings) => ({
								...prev,
								lastUsedPeriodTab: 'Y',
							}),
						)
					}
				>
					Y
				</Button>
			</div>
		</div>
	);
};

export default TimeFrameSelection;
