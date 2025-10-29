// Component Imports
import { Chart } from 'primereact/chart';
import TopicList from './topicBreakDownTable';

// Hook Imports
import { useSettings } from '../../../hooks/use-settings';

// Type Imports
import type { StudyData } from '../../../types/study-data.ts';

// Utils Imports
import {
	overallStatsExtraction,
	piChartDataExtraction,
	topicBreakDownDataExtraction,
} from '../utils/utils';

// Component Definition
const DataVisualizationPanel = ({
	studyData,
	timeframe,
	selectedPeriod,
}: {
	studyData: StudyData[];
	timeframe: 'W' | 'M' | 'Y';
	selectedPeriod: any;
}) => {
	const settings = useSettings();
	const piChartData = piChartDataExtraction(studyData, settings.workItems);
	const breakDownData = topicBreakDownDataExtraction(studyData, settings.workItems);
	const overallStats = overallStatsExtraction(studyData);

	return (
		<div className='flex flex-col md:flex-row w-full gap-2'>
			{/* Chart and Topic Breakdown */}
			<div className='flex flex-col w-full md:w-1/2 gap-4 items-center h-full'>
				<div className='w-full'>
					<p className='font-semibold'>Topic Breakdown</p>
				</div>
				<Chart
					className='flex w-11/12 md:h-3/5 h-2/3 justify-center items-center'
					type='doughnut'
					data={piChartData}
					options={{
						plugins: {
							legend: {
								display: false, // <-- hides the legend
							},
						},
					}}
				/>
				<TopicList {...breakDownData} />
			</div>

			{/* Center Divider*/}
			<div className='h-1 md:h-full w-full md:w-1 rounded-lg bg-gray-200'></div>

			{/* Overall Statistics Divider*/}
			<div className='flex flex-col w-full md:w-1/2 items-center h-full'>
				<div className='flex flex-col w-full gap-2'>
					<p className='font-semibold'>Overall Stats</p>
					<div className='flex flex-col w-full gap-1'>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-gray-600'>Total Working Time</span>
							<span className='text-sm text-gray-500'>
								{overallStats.totalWorkTime}
							</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-gray-600'>Most Worked On Topic</span>
							<span className='text-sm text-gray-500'>
								{overallStats.mostWorkedOnTopic}
							</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-gray-600'>Least Worked On Topic</span>
							<span className='text-sm text-gray-500'>
								{overallStats.leastWorkedOnTopic}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DataVisualizationPanel;
