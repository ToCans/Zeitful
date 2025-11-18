// Component Imports
import ColorIcon from './colorIcon';
// Hook Imports
import { useAppContext } from '../../hooks/useAppContext';
// Type Imports
import type { WorkTask } from '../../types/types';

export const workTaskOptionTemplate = (workTask: WorkTask) => {
	const settings = useAppContext();
	const matchedTopic = settings.workTopics.find((t) => t.id === workTask.topic_id);
	const tileColor = matchedTopic ? matchedTopic.color : '#DBDBDB';
	return (
		<div className='flex flex-row items-center justify-center focus:outline-none'>
			<div className='flex items-center justify-center'>
				<ColorIcon color={tileColor} />
			</div>
			<p className='text-center justify-center'>{workTask.name}</p>
		</div>
	);
};

export const selectedWorkTaskOptionTemplate = (workTask: WorkTask) => {
	const settings = useAppContext();
	if (workTask) {
		const matchedTopic = settings.workTopics.find((t) => t.id === workTask.topic_id);
		const tileColor = matchedTopic ? matchedTopic.color : '#DBDBDB';
		return (
			<div className='flex flex-row items-center justify-center focus:outline-none'>
				<ColorIcon color={tileColor} />
				<p className='text-center justify-center'>{workTask.name}</p>
			</div>
		);
	}

	return <p>Select a Work Task</p>;
};
