// Component Imports
import ColorIcon from './colorIcon';
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
	try {
		const matchedTask = workTasks.find((workTask) => workTask.id === workEntry.task_id);
		const matchedTopic = workTopics.find((workTopic) => workTopic.id === workEntry.topic_id);

		let tileTaskName: string;
		if (matchedTask) {
			tileTaskName = matchedTask.name;
		} else if (workEntry.task_name !== null) {
			tileTaskName = workEntry.task_name;
		} else {
			tileTaskName = 'No Task';
		}

		let tileTopicName: string;
		if (matchedTopic) {
			tileTopicName = matchedTopic.name;
		} else if (workEntry.topic_name !== null) {
			tileTopicName = workEntry.topic_name;
		} else {
			tileTopicName = 'No Topic';
		}

		const tileColor = matchedTopic ? matchedTopic.color : '#DBDBDB';

		return (
			<div className='flex flex-row space-x-2 items-center w-full'>
				<ColorIcon color={tileColor} />
				<p className='min-w-30'>{tileTopicName}</p>
				<p className='min-w-30'>{tileTaskName}</p>
				<p className='min-w-10'>{formatMinutes(workEntry.duration)}</p>
				<p className='min-w-40'>{String(workEntry.completion_time)}</p>
			</div>
		);
	} catch (err) {
		console.error('Error rendering WorkEntryTile:', err, { workEntry, workTasks, workTopics });
		return <div className="text-red-500">Error rendering work entry</div>;
	}
};

export default WorkEntryTile;
