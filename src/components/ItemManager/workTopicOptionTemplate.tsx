import type { WorkTopic } from '../../types/types';

export const workTopicOptionTemplate = (workTopic: WorkTopic) => {
	return (
		<div className='flex flex-row items-center justify-center focus:outline-none'>
			<div className='flex items-center justify-center'>
				<span
					className={`h-4 w-4 border-2 mr-2 border-slate-500 rounded-md`}
					style={{ backgroundColor: `${workTopic.color}` }}
				></span>
			</div>
			<p className='text-center justify-center'>{workTopic.name}</p>
		</div>
	);
};

export const selectedWorkTopicOptionTemplate = (workTopic: WorkTopic) => {
	if (workTopic) {
		return (
			<div className='flex flex-row items-center justify-center focus:outline-none'>
				<span
					className={`h-4 w-4 border-2 mr-2 border-slate-500 rounded-md`}
					style={{ backgroundColor: `${workTopic.color}` }}
				></span>
				<p className='text-center justify-center'>{workTopic.name}</p>
			</div>
		);
	}

	return <p>Select a Work Topic</p>;
};
