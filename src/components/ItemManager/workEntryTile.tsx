// Type Imports
import type { WorkEntry, WorkTask, WorkTopic } from '../../types/types';
// Utils Imports
import { formatMinutes } from '../../utils/time';

interface WorkEntryTileProps {
	workEntry: WorkEntry;
	workTasks: WorkTask[];
	workTopics: WorkTopic[];
}

const WorkEntryTile = ({ workEntry, workTasks, workTopics }: WorkEntryTileProps) => {
	// Matching Entries
	const matchedTask = workTasks.find((workTask) => workTask.id === workEntry.task_id);
	const matchedTopic = workTopics.find((workTopic) => workTopic.id === workEntry.topic_id);

	// Handling three cases for task assignment
	let tileTaskName: string;
	if (matchedTask) {
		tileTaskName = matchedTask.name;
	} else if (workEntry.task_name !== null) {
		tileTaskName = workEntry.task_name;
	} else {
		tileTaskName = 'No Task';
	}

	// Handling three cases for topic assignment
	let tileTopicName: string;
	if (matchedTopic) {
		tileTopicName = matchedTopic.name;
	} else if (workEntry.topic_name !== null) {
		tileTopicName = workEntry.topic_name;
	} else {
		tileTopicName = 'No Topic';
	}

	// Defining Component Aspects
	const tileColor = matchedTopic ? matchedTopic.color : '#DBDBDB';

	return (
		<div className='flex flex-row space-x-2 items-center w-full'>
			<span
				className={`h-4 w-4 border-2 mr-2 border-slate-500 rounded-md`}
				style={{ backgroundColor: `${tileColor}` }}
			></span>
			<p className='min-w-30'>{tileTopicName}</p>
			<p className='min-w-30'>{tileTaskName}</p>
			<p className='min-w-10'>{formatMinutes(workEntry.duration)}</p>
			<p className='min-w-40'>{String(workEntry.completion_time)}</p>
		</div>
	);
};

export default WorkEntryTile;
