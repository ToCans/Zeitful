// Component Import
import ColorIcon from './colorIcon';
// Type Import
import type { WorkTopic } from '../../types/types';

// Interface Defintion
interface TopicTileProps {
	topic: WorkTopic;
}

// Component Defintion
const TopicTile = ({ topic }: TopicTileProps) => {
	return (
		<div className='flex flex-row space-x-2 items-center w-full p-0.5'>
			<ColorIcon color={topic.color} />
			<p className='text-sm text-nowrap'>{topic.name}</p>
		</div>
	);
};

export default TopicTile;
