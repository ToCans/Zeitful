// Comopnent Imports
import ColorIcon from './colorIcon';
// Type Imports
import type { WorkTask, WorkTopic } from '../../types/types';

// Interface Defintion
interface TaskTileProps {
	topics: WorkTopic[];
	task: WorkTask;
}

const TaskTile = ({ topics, task }: TaskTileProps) => {
	const matchedTopic = topics.find((t) => t.id === task.topic_id);
	const tileColor = matchedTopic ? matchedTopic.color : '#DBDBDB';
	const topicName = matchedTopic ? matchedTopic.name : 'No Topic';
	return (
		<div className='flex flex-row space-x-2 items-center w-full p-1'>
			<ColorIcon color={tileColor} />
			<div className='flex flex-row justify-between items-center w-full'>
				<div className='flex md:flex-row flex-col md:items-center'>
					<p className='text-sm text-nowrap'>{topicName}</p>
					<p className='text-sm text-nowrap'>{task.name}</p>
				</div>
				<p className='text-sm'>{task.status}</p>
			</div>
		</div>
	);
};

export default TaskTile;
