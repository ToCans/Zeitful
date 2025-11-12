// Component Imports
import ColorIcon from '../../../components/ItemManager/colorIcon';
// Type Imports
import type { ItemData } from '../../../types/types';
// Utils Imports
import { calculateTopicPercentages } from '../utils/utils';
import { formatMinutes } from '../../../utils/time';

// Interface Defintion
interface ItemPercentageBreakdownProps {
    itemData: ItemData | null,
}

// Component Defintion
const ItemPercentageBreakdown = ({ itemData }: ItemPercentageBreakdownProps) => {
    if (!itemData) {
        return null;
    }
    const itemDataWithPercentage = calculateTopicPercentages(itemData);
    return (
        <div className="flex flex-col w-full h-2/5 overflow-y-auto">
            {itemData.itemIds.map((id, index) => (
                <div
                    key={id}
                    className="flex flex-row items-center w-full space-x-1"
                >
                    <ColorIcon color={itemData.itemColors[index]} />
                    {/* Wrap name and duration in a flex container with flex-1 */}
                    <div className='flex w-1/2 flex-row'>
                        <p className="text-sm">{itemData.itemNames[index]}</p>
                    </div>
                    <div className='flex w-1/2 flex-row justify-between'>
                        <p className="text-xs text-left text-gray-500 font-semibold">{formatMinutes(itemData.itemDurations[index])}</p>
                        {/* Last item aligned to the right */}
                        <p className="text-xs text-right">
                            {(itemDataWithPercentage.topicPercentage?.[index] ?? 0).toFixed(2)}%
                        </p>
                    </div>

                </div>
            ))}
        </div>);
};

export default ItemPercentageBreakdown;