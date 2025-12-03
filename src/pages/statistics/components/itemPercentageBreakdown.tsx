// Component Imports
import ItemPercentageTile from './itemPercentageTile';
// Type Imports
import type { TaskData, TopicData } from '../../../types/types';
// Utils Imports
import { calculateTopicPercentages } from '../utils/utils';

// Interface Defintion
interface ItemPercentageBreakdownProps {
	itemData: TopicData | TaskData | null;
}

// Component Defintion
const ItemPercentageBreakdown = ({ itemData }: ItemPercentageBreakdownProps) => {
	if (!itemData) {
		return null;
	}
	const topicDataWithPercentage = calculateTopicPercentages(itemData);
	return (
		<div className='flex flex-col w-full h-2/5 overflow-y-auto'>
			{itemData.itemIds.map((id, index) => (
				<ItemPercentageTile
					key={id}
					index={index}
					id={id}
					color={itemData.itemColors[index]}
					itemName={itemData.itemNames[index]}
					itemDuration={itemData.itemDurations[index]}
					topicPercentage={topicDataWithPercentage.topicPercentage?.[index] ?? 0}
				/>
			))}
		</div>
	);
};

export default ItemPercentageBreakdown;
