// Component Imports
import { ProgressSpinner } from 'primereact/progressspinner';
import TimeFrameSelection from './timeFrameSelect';
import { Dropdown } from 'primereact/dropdown';
import DataVisualizationPanel from './dataVisualizationPanel';
import ItemFilterButton from './itemFilterButton';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
import useGatherPeriodData from '../hooks/useGatherPeriodData';
// React Imports
import { useEffect, useState } from 'react';
// Utils Imports
import {
	gatherMostRecentData,
} from '../utils/utils';

// Component Definition
const Statistics = () => {
	const settings = useAppContext();
	const [isMounted, setIsMounted] = useState(false);
	const [timeFrame, setTimeFrame] = useState<'W' | 'M' | 'Y'>('M');
	const [itemFilter, setItemFilter] = useState<'Task' | 'Topic'>('Topic');
	const [periodOptions, setPeriodOptions] = useState<any[]>([]);
	const [selectedPeriod, setSelectedPeriod] = useState<any>(null);

	// Animate on mount
	useEffect(() => {
		const timeout = setTimeout(() => setIsMounted(true), 10);
		return () => clearTimeout(timeout);
	}, []);

	// Whenever the timeframe changes, recompute periods *and* selectedPeriod together
	useEffect(() => {
		const { periodOptions, latestPeriod } = gatherMostRecentData(timeFrame);
		setPeriodOptions(periodOptions);
		setSelectedPeriod(latestPeriod);
	}, [timeFrame]);

	// Date Ranges regenerated when selectedPeriod changes
	const { timeFilteredWorkEntries, isLoading } = useGatherPeriodData({ selectedPeriod: selectedPeriod, timeFrame: timeFrame, workEntries: settings.workEntries });

	return (
		<div
			className={`${settings.darkMode ? 'bg-zinc-700' : 'bg-white'
				} gap-1 flex flex-col relative p-4 md:h-3/5 h-4/5 xl:w-1/2 md:w-2/3 w-11/12 rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 ease-out ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
				}`}
		>
			<div className='flex flex-col flex-1 items-center min-h-0'>
				<div className='flex flex-col w-full h-30 space-y-2'>
					<TimeFrameSelection timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
					<Dropdown
						value={selectedPeriod}
						options={periodOptions}
						onChange={(e) => setSelectedPeriod(e.value)}
						placeholder={`Select ${timeFrame === 'W' ? 'week' : timeFrame === 'M' ? 'month' : 'year'
							}`}
						className={`w-full ${settings.darkMode ? 'dark-dropdown' : 'light-dropdown'}`}
						style={{
							backgroundColor: settings.darkMode ? '#52525B' : '#ffffff',
							borderColor: settings.darkMode ? '#6b7280' : '#d1d5db',
						}}
						panelClassName={
							settings.darkMode ? 'dark-dropdown-panel' : 'light-dropdown-panel'
						}
						panelStyle={{ backgroundColor: settings.darkMode ? '#52525B' : '#ffffff' }}
					/>
					<div className='flex flex-row space-x-1'>
						<ItemFilterButton isActive={itemFilter == 'Task'} name={'Task'} setItemFilter={setItemFilter} />
						<ItemFilterButton isActive={itemFilter == 'Topic'} name={'Topic'} setItemFilter={setItemFilter} />
					</div>
				</div>
				{isLoading ?
					(<div className='flex w-full h-full min-h-0 items-center justify-center' >
						<ProgressSpinner className={`${settings.darkMode ? 'dark-spinner' : 'light-spinner'}`} />
					</div>) :
					(<div className='flex w-full h-full min-h-0 items-center justify-center'>
						{timeFilteredWorkEntries?.length === 0 ? (
							<p className='text-sm p-2'>No data found for this period.</p>
						) : (
							<DataVisualizationPanel itemFilter={itemFilter} timeFilteredWorkEntries={timeFilteredWorkEntries} />
						)}
					</div>)}

			</div>
		</div >
	);
};

export default Statistics;
