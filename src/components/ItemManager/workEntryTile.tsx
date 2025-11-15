// Component Imports
import ColorIcon from './colorIcon';
// Type Imports
import type { WorkEntry, WorkTask, WorkTopic } from '../../types/types';
// Utils Imports
import { formatMinutes } from '../../utils/time';
import { formatDate } from '../../utils/date';

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
		const { date, time } = formatDate(String(workEntry.completion_time));

		return (
			<div className='flex flex-row space-x-2 items-center w-full p-0.5'>
				<ColorIcon color={tileColor} />
				<div className='flex flex-row justify-between items-center w-full'>
					<div className='flex md:flex-row flex-col md:w-3/5 md:items-center'>
						<p className='text-sm text-nowrap md:w-2/5'>{tileTaskName}</p>
						<p className='text-sm text-nowrap md:w-2/5'>{tileTopicName}</p>
					</div>
					<div className='flex flex-row md:w-2/5 justify-between'>
						<p className='text-gray-500 text-sm'>{formatMinutes(workEntry.duration)}</p>
						<div className='flex md:flex-row flex-col md:space-x-1 md:items-center'>
							<p className='text-gray-500 text-sm'>{date}</p>
							<p className='text-gray-500 text-sm'>@</p>
							<p className='text-gray-500 text-sm'>{time}</p>
						</div></div>

				</div>
			</div>
		);
	} catch (err) {
		console.error('Error rendering WorkEntryTile:', err, { workEntry, workTasks, workTopics });
		return <div className='text-red-500'>Error rendering work entry</div>;
	}
};

export default WorkEntryTile;
