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
		<div className='flex flex-row space-x-2 items-center'>
			<ColorIcon color={tileColor} />
			<p className='min-w-40'>{topicName}</p>
			<p className='min-w-40'>{task.name}</p>
			<p className='min-w-10'>{task.status}</p>
		</div>
	);
};

export default TaskTile;
