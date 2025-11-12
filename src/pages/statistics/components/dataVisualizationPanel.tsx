// Component Imports
import ItemPercentageBreakdown from './itemPercentageBreakdown';
import OverallStats from './overallStats';
import PiChart from './piChart';
// Type Imports
import { useEffect, useState } from 'react';
import { type ItemData, type WorkEntry, type WorkTopic } from '../../../types/types';
// Utils Imports
import { filterWorkEntriesByDateRange, generateDateRange, getTotalDurationByTopicForSelectedPeriod, matchItemToTopics } from '../utils/utils';

// Interface Definition
interface DataVisualizationPanelProps {
    timeFrame: 'W' | 'M' | 'Y';
    selectedPeriod: any;
    workTopics: WorkTopic[];
    workEntries: WorkEntry[];
}

// Component Definition
const DataVisualizationPanel = ({ timeFrame, selectedPeriod, workTopics, workEntries }: DataVisualizationPanelProps) => {
    const [itemData, setItemData] = useState<ItemData | null>(null);

    // Date Ranges regenerated when selectedPeriod changes
    useEffect(() => {
        if (!selectedPeriod) return;
        const dateRange = generateDateRange(timeFrame, selectedPeriod);
        const filteredWorkEntries = filterWorkEntriesByDateRange(workEntries, dateRange);
        const durationsByTopic = getTotalDurationByTopicForSelectedPeriod(filteredWorkEntries); //TODO: Later allow duration by  task
        const itemData = matchItemToTopics(durationsByTopic, workTopics);
        setItemData(itemData);
    }, [selectedPeriod]);

    return (
        <div className='flex flex-row w-full gap-2'>
            {/* Chart and Topic Breakdown */}
            <div className='flex flex-col w-1/2 gap-4 items-center h-full'>
                <div className='w-full p-2'>
                    <p className='font-semibold text-sm'>Topic Breakdown</p>
                </div>
                {itemData && <PiChart itemData={itemData} />}
                {itemData && <ItemPercentageBreakdown itemData={itemData} />}
            </div>
            <div className='flex flex-col w-1/2 gap-4 items-center h-full'>
                <div className='w-full p-2'>
                    <p className='font-semibold text-sm'>Overall Stats</p>
                </div>
                {itemData && <OverallStats itemData={itemData} />}

            </div>
        </div>
    );
};

export default DataVisualizationPanel;
