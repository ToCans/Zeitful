// Component Imports
import ItemPercentageBreakdown from './itemPercentageBreakdown';
import OverallStats from './overallStats';
import PiChart from './piChart';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
// React Imports
import { useMemo } from 'react';
// Type Imports
import { type WorkEntry } from '../../../types/types';
// Utils Imports
import { getTotalDurationByTaskForSelectedPeriod, getTotalDurationByTopicForSelectedPeriod, matchItemToTasks, matchItemToTopics } from '../utils/utils';

// Interface Definition
interface DataVisualizationPanelProps {
	itemFilter: 'Task' | 'Topic';
	periodFilteredData: WorkEntry[] | null;
	unfilteredWorkEntries: WorkEntry[] | null;
}

// Component Definition
const DataVisualizationPanel = ({ itemFilter, periodFilteredData }: DataVisualizationPanelProps) => {
	const settings = useAppContext();

	const workEntriesGroupedByItem = useMemo(() => {
		if (!periodFilteredData) return null;
		if (itemFilter === 'Task') {
			const durationsByTask = getTotalDurationByTaskForSelectedPeriod(periodFilteredData);
			const taskData = matchItemToTasks(durationsByTask, settings.workTasks, settings.workTopics);
			return taskData;
		} else {
			const durationsByTopic = getTotalDurationByTopicForSelectedPeriod(periodFilteredData);
			const topicData = matchItemToTopics(durationsByTopic, settings.workTopics);
			return topicData;
		}
	}, [itemFilter, periodFilteredData, settings.workTopics]);

	return (
		<div className='flex md:flex-row flex-col w-full h-full overflow-y-auto md:gap-4 gap-2 p-2'>
			{/* Chart and Topic Breakdown */}
			<div className='flex flex-col md:w-1/2 md:h-full h-3/4 w-full gap-4 items-center'>
				<p className='font-semibold text-sm w-full '>{itemFilter} Breakdown</p>
				{workEntriesGroupedByItem && <PiChart itemData={workEntriesGroupedByItem} />}
				{workEntriesGroupedByItem && <ItemPercentageBreakdown itemData={workEntriesGroupedByItem} />}
			</div>
			<div
				className={`md:h-full h-1 md:w-1 w-full ${settings.darkMode ? 'bg-gray-400' : 'bg-gray-200'
					} rounded-b-lg`}
			></div>
			<div className='flex flex-col md:w-1/2 md:h-full h-1/4 w-full gap-4 items-center'>
				{workEntriesGroupedByItem && <OverallStats itemFilter={itemFilter} itemFilteredData={workEntriesGroupedByItem} periodFilteredData={periodFilteredData} unfilteredData={settings.workEntries} />}
			</div>
		</div>
	);
};

export default DataVisualizationPanel;
