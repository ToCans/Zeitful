// Type Imports
import type { ItemData } from '../../../types/types';
// Utils Imports
import { getTotalTimeWorked, getMostWorkedOn, getLeastWorkedOn } from '../utils/utils';
import { formatMinutes } from '../../../utils/time';

// Interface Defintion
interface OverallStatsProps {
    itemData: ItemData | null,
}

// Component Defintion
const OverallStats = ({ itemData }: OverallStatsProps) => {
    if (!itemData) {
        return null;
    }
    return (
        <div className="flex flex-row w-full h-2/5 justify-between">
            <div className='space-y-1'>
                <p className='text-xs text-left'>Total Working Time</p>
                <p className='text-xs text-left'>Most Worked On Topic</p>
                <p className='text-xs text-left'>Least Worked on Topic</p>
            </div>
            <div className='space-y-1'>
                <p className='text-xs text-right text-gray-600'>{formatMinutes(getTotalTimeWorked(itemData))}</p>
                <p className='text-xs text-right text-gray-600'>{getMostWorkedOn(itemData)?.name}</p>
                <p className='text-xs text-right text-gray-600'>{getLeastWorkedOn(itemData)?.name}</p>

            </div>

        </div>);
};

export default OverallStats;