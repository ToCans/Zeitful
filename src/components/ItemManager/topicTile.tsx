import type { WorkTopic } from '../../types/types';

interface TopicTileProps {
	topic: WorkTopic;
}

const TopicTile = ({ topic }: TopicTileProps) => {
	return (
		<div className='flex flex-row space-x-2 items-center'>
			<span
				className={`h-4 w-4 border-2 mr-2 border-slate-500 rounded-md`}
				style={{ backgroundColor: `${topic.color}` }}
			></span>
			<p className='min-w-40'>{topic.name}</p>
		</div>
	);
};

export default TopicTile;
