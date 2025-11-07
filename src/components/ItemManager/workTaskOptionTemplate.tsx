import { useSettings } from '../../hooks/use-settings';
import type { WorkTask } from '../../types/types';

export const workTaskOptionTemplate = (workTask: WorkTask) => {
	const settings = useSettings();
	const matchedTopic = settings.workTopics.find((t) => t.id === workTask.topic_id);
	const tileColor = matchedTopic ? matchedTopic.color : '#DBDBDB';
	return (
		<div className='flex flex-row items-center justify-center focus:outline-none'>
			<div className='flex items-center justify-center'>
				<span
					className={`h-4 w-4 border-2 mr-2 border-slate-500 rounded-md`}
					style={{ backgroundColor: `${tileColor}` }}
				></span>
			</div>
			<p className='text-center justify-center'>{workTask.name}</p>
		</div>
	);
};

export const selectedWorkTaskOptionTemplate = (workTask: WorkTask) => {
	const settings = useSettings();
	if (workTask) {
		const matchedTopic = settings.workTopics.find((t) => t.id === workTask.topic_id);
		const tileColor = matchedTopic ? matchedTopic.color : '#DBDBDB';
		return (
			<div className='flex flex-row items-center justify-center focus:outline-none'>
				<span
					className={`h-4 w-4 border-2 mr-2 border-slate-500 rounded-md`}
					style={{ backgroundColor: `${tileColor}` }}
				></span>
				<p className='text-center justify-center'>{workTask.name}</p>
			</div>
		);
	}

	return <p>Select a Work Task</p>;
};
