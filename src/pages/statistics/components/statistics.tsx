import TimeFrameSelection from './timeFrameSelect';
import { Dropdown } from 'primereact/dropdown';
import DataVisualizationPanel from './dataVisualizationPanel';
import { useSettings } from '../../../hooks/use-settings';
import { useEffect, useState } from 'react';
import { gatherMostRecentData } from '../utils/utils';

const Statistics = () => {
	const settings = useSettings();

	const [isMounted, setIsMounted] = useState(false);
	const [timeFrame, setTimeFrame] = useState<'W' | 'M' | 'Y'>('M');
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

	return (
		<div
			className={`bg-white gap-1 flex flex-col relative p-4 w-4/5 md:w-3/5 xl:w-2/5 h-[50vh] rounded-lg overflow-auto shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 ease-out ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
				}`}
		>
			<div className="flex flex-col flex-1 items-center">
				<TimeFrameSelection timeFrame={timeFrame} setTimeFrame={setTimeFrame} />

				<Dropdown
					value={selectedPeriod}
					options={periodOptions}
					onChange={(e) => setSelectedPeriod(e.value)}
					placeholder={`Select ${timeFrame === 'W'
						? 'week'
						: timeFrame === 'M'
							? 'month'
							: 'year'
						}`}
					className="w-full"
				/>

				<div className="flex w-full h-full overflow-y-auto">
					{settings.workEntries.length === 0 ? (
						<p className="text-gray-500 text-sm">No data found for this period.</p>
					) : (
						<DataVisualizationPanel timeFrame={timeFrame} selectedPeriod={selectedPeriod} workEntries={settings.workEntries} workTopics={settings.workTopics}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Statistics;
