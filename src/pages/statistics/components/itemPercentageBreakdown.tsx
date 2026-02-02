// Component Imports
import ItemPercentageTile from './itemPercentageTile';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
// Icon Imports
import { PiSortAscending, PiSortDescending } from 'react-icons/pi';
import { IconContext } from 'react-icons';
// React Imports
import { useState } from 'react';
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
	const settings = useAppContext();
	const [sortMethod, setSortMethod] = useState<'dsc' | 'asc'>('dsc');
	if (!itemData) {
		return null;
	}
	const topicDataWithPercentage = calculateTopicPercentages(itemData);

	return (
		<div className='flex flex-col w-full h-2/5 overflow-y-auto'>
			<div className='flex flex-row justify-end space-x-1'>
				<IconContext.Provider
					value={{
						className: `${settings.darkMode
							? 'fill-gray-200 hover:fill-gray-400'
							: 'fill-black hover:fill-gray-600'
							} ${sortMethod === 'asc' ? 'opacity-100' : 'opacity-50'} 
											size-4 custom-target-icon`,
					}}
				>
					<PiSortAscending onClick={() => { setSortMethod('dsc'); }} />
				</IconContext.Provider>
				<IconContext.Provider
					value={{
						className: `${settings.darkMode
							? 'fill-gray-200 hover:fill-gray-400'
							: 'fill-black hover:fill-gray-600'
							} ${sortMethod === 'dsc' ? 'opacity-100' : 'opacity-50'} 
											size-4 custom-target-icon`,
					}}
				>
					<PiSortDescending onClick={() => { setSortMethod('asc'); }} />
				</IconContext.Provider>
			</div>
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
