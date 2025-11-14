// Component Imports
import TimeFrameSelection from './timeFrameSelect';
import { Dropdown } from 'primereact/dropdown';
import DataVisualizationPanel from './dataVisualizationPanel';
// Hook Imports
import { useSettings } from '../../../hooks/use-settings';
// React Imports
import { useEffect, useState } from 'react';
// Type Imports
import { type ItemData } from '../../../types/types';
// Utils Imports
import {
	filterWorkEntriesByDateRange,
	generateDateRange,
	getTotalDurationByTopicForSelectedPeriod,
	matchItemToTopics,
	gatherMostRecentData,
} from '../utils/utils';

const Statistics = () => {
	const settings = useSettings();
	const [isMounted, setIsMounted] = useState(false);
	const [timeFrame, setTimeFrame] = useState<'W' | 'M' | 'Y'>('M');
	const [periodOptions, setPeriodOptions] = useState<any[]>([]);
	const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
	const [itemData, setItemData] = useState<ItemData | null>(null);

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
	useEffect(() => {
		if (!selectedPeriod) return;
		const dateRange = generateDateRange(timeFrame, selectedPeriod);
		const filteredWorkEntries = filterWorkEntriesByDateRange(settings.workEntries, dateRange);
		const durationsByTopic = getTotalDurationByTopicForSelectedPeriod(filteredWorkEntries); //TODO: Later allow duration by  task
		const itemData = matchItemToTopics(durationsByTopic, settings.workTopics);
		setItemData(itemData);
	}, [timeFrame, selectedPeriod]);

	return (
		<div
			className={`bg-white gap-1 flex flex-col relative p-4 xl:w-2/5 md:w-3/5 w-11/12 md:h-[50vh] h-[70vh] rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 ease-out ${
				isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
			}`}
		>
			<div className='flex flex-col flex-1 items-center'>
				<TimeFrameSelection timeFrame={timeFrame} setTimeFrame={setTimeFrame} />

				<Dropdown
					value={selectedPeriod}
					options={periodOptions}
					onChange={(e) => setSelectedPeriod(e.value)}
					placeholder={`Select ${
						timeFrame === 'W' ? 'week' : timeFrame === 'M' ? 'month' : 'year'
					}`}
					className='w-full'
				/>

				<div className='flex flex-1 w-full'>
					{itemData?.itemIds.length === 0 ? (
						<p className='text-gray-500 text-sm'>No data found for this period.</p>
					) : (
						<DataVisualizationPanel itemData={itemData} />
					)}
				</div>
			</div>
		</div>
	);
};

export default Statistics;
