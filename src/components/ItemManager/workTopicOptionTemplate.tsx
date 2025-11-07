// Component Imports
import ColorIcon from './colorIcon';
// Type Imports
import type { WorkTopic } from '../../types/types';

export const workTopicOptionTemplate = (workTopic: WorkTopic) => {
	return (
		<div className='flex flex-row items-center justify-center focus:outline-none'>
			<div className='flex items-center justify-center'>
				<ColorIcon color={workTopic.color} />
			</div>
			<p className='text-center justify-center'>{workTopic.name}</p>
		</div>
	);
};

export const selectedWorkTopicOptionTemplate = (workTopic: WorkTopic) => {
	if (workTopic) {
		return (
			<div className='flex flex-row items-center justify-center focus:outline-none'>
				<ColorIcon color={workTopic.color} />
				<p className='text-center justify-center'>{workTopic.name}</p>
			</div>
		);
	}

	return <p>Select a Work Topic</p>;
};
