import type { WorkTask, WorkTopic } from '../../types/types';

interface TaskTileProps {
	topics: WorkTopic[];
	task: WorkTask;
}

const TaskTile = ({ topics, task }: TaskTileProps) => {
	const matchedTopic = topics.find((t) => t.id === task.topic_id);
	const tileColor = matchedTopic ? matchedTopic.color : '#DBDBDB';
	return (
		<div className='flex flex-row space-x-2 items-center'>
			<span
				className={`h-4 w-4 border-2 mr-2 border-slate-500 rounded-md`}
				style={{ backgroundColor: `${tileColor}` }}
			></span>

			<p>{matchedTopic ? matchedTopic.name : 'No Topic'}</p>
			<p>{task.task_name}</p>
			<p>{task.status}</p>
		</div>
	);
};

export default TaskTile;
