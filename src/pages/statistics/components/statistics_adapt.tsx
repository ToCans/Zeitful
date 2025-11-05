// API Imports
// import { fetchTimeframeData } from '../../../services/study-data';

// Component Imports
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
// import DataVisualizationPanel from './dataVisualizationPanel';

// Hook Imports
import { useState, useEffect } from 'react';
// import { useSettings } from '../../../hooks/use-settings';

// Type Imports
// import type { StudyData } from '../../../types/study-data';

// Utils Import
import { generatePeriods } from '../utils/utils';

// Component Definition
const Statistics = () => {
	const [isMounted, setIsMounted] = useState(false);
	const [timeframe, setTimeframe] = useState<'W' | 'M' | 'Y'>('M');
	const [availablePeriods, setAvailablePeriods] = useState<any[]>([]);
	const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
	// const [studyData, setStudyData] = useState<StudyData[]>([]);

	// Animate on mount
	useEffect(() => {
		const timeout = setTimeout(() => setIsMounted(true), 10);
		return () => clearTimeout(timeout);
	}, []);

	// Set the available periods when timeframe changes
	useEffect(() => {
		const periods = generatePeriods(timeframe);
		setAvailablePeriods(periods);
		const latest = periods[periods.length - 1]?.value ?? null;
		setSelectedPeriod(latest);
	}, [timeframe]);

	// Fetches data based on the selected period
	/* 
	useEffect(() => {
		if (selectedPeriod == null) return;
		fetchTimeframeData(timeframe, selectedPeriod, setStudyData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedPeriod]);
	*/

	return (
		<div
			className={`bg-white flex flex-col items-center p-4 w-4/5 md:w-3/5 xl:w-2/5 md:h-1/2 h-4/5 rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 ease-out ${
				isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
			}`}
		>
			<div className='flex flex-row justify-between w-full'>
				<p className='text-2xl font-normal'>
					{timeframe === 'W'
						? 'Weekly Stats'
						: timeframe === 'M'
						? 'Monthly Stats'
						: 'Yearly Stats'}
				</p>
				<div className='flex flex-row gap-2'>
					<Button
						className={`${
							timeframe === 'W' ? 'opacity-100' : 'opacity-50 hover:opacity-100'
						}`}
						unstyled
						onClick={() => setTimeframe('W')}
					>
						W
					</Button>
					<Button
						className={`${
							timeframe === 'M' ? 'opacity-100' : 'opacity-50 hover:opacity-100'
						}`}
						unstyled
						onClick={() => setTimeframe('M')}
					>
						M
					</Button>
					<Button
						className={`${
							timeframe === 'Y' ? 'opacity-100' : 'opacity-50 hover:opacity-100'
						}`}
						unstyled
						onClick={() => setTimeframe('Y')}
					>
						Y
					</Button>
				</div>
			</div>

			{/* 📅 Dropdown for period selection */}
			<div className='flex w-full'>
				<Dropdown
					value={selectedPeriod}
					options={availablePeriods}
					onChange={(e) => setSelectedPeriod(e.value)}
					placeholder={`Select ${
						timeframe === 'W' ? 'week' : timeframe === 'M' ? 'month' : 'year'
					}`}
					className='w-full'
				/>
			</div>
			{/* 
			<div className='flex w-full h-full overflow-y-auto'>
				{studyData.length === 0 ? (
					<p className='text-gray-500 text-sm'>No data found for this period.</p>
				) : (
					<DataVisualizationPanel
						selectedPeriod={selectedPeriod}
						studyData={studyData}
						timeframe={timeframe}
					/>
				)}
			</div>
			*/}
		</div>
	);
};

export default Statistics;
