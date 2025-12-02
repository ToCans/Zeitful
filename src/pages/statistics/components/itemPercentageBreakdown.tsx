// Component Imports
import ItemPercentageTile from './itemPercentageTile';
// Type Imports
import type { TopicData } from '../../../types/types';
// Utils Imports
import { calculateTopicPercentages } from '../utils/utils';

// Interface Defintion
interface ItemPercentageBreakdownProps {
	topicData: TopicData | null;
}

// Component Defintion
const ItemPercentageBreakdown = ({ topicData }: ItemPercentageBreakdownProps) => {
	if (!topicData) {
		return null;
	}
	const topicDataWithPercentage = calculateTopicPercentages(topicData);
	return (
		<div className='flex flex-col w-full h-1/2 overflow-y-auto'>
			{topicData.itemIds.map((id, index) => (
				<ItemPercentageTile
					key={id}
					index={index}
					id={id}
					color={topicData.itemColors[index]}
					itemName={topicData.itemNames[index]}
					itemDuration={topicData.itemDurations[index]}
					topicPercentage={topicDataWithPercentage.topicPercentage?.[index] ?? 0}
				/>
			))}
		</div>
	);
};

export default ItemPercentageBreakdown;
