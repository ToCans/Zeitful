// Type Imports
import type { TopicData } from '../../../types/types';
// Utils Imports
import { getTotalTimeWorked, getMostWorkedOn, getLeastWorkedOn } from '../utils/utils';
import { formatMinutes } from '../../../utils/time';

// Interface Defintion
interface OverallStatsProps {
    topicData: TopicData | null,
}

// Component Defintion
const OverallStats = ({ topicData }: OverallStatsProps) => {
    if (!topicData) {
        return null;
    }
    return (
        <div className="flex flex-col w-full h-2/5 space-y-2">
            <div className='flex flex- row items-center space-x-1 justify-between'>
                <p className='text-xs text-left'>Total Working Time</p>
                <p className='text-xs text-right'>{formatMinutes(getTotalTimeWorked(topicData))}</p></div>
            <div className='flex flex- row items-center space-x-1 justify-between'>
                <p className='text-xs text-left'>Most Worked On Topic</p>
                <p className='text-xs text-right'>{getMostWorkedOn(topicData)?.name}</p>
            </div>
            <div className='flex flex- row items-center space-x-1 justify-between'>
                <p className='text-xs text-left'>Least Worked on Topic</p>
                <p className='text-xs text-right'>{getLeastWorkedOn(topicData)?.name}</p>

            </div>

        </div>);
};

export default OverallStats;