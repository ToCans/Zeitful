// Component Imports
import ColorIcon from './colorIcon';
// Hook Imports
import { useAppContext } from '../../hooks/useAppContext';
// Type Imports
import type { WorkTopic } from '../../types/types';

export const workTopicOptionTemplate = (workTopic: WorkTopic) => {
	const settings = useAppContext();
	return (
		<div className='flex flex-row items-center justify-center focus:outline-none'>
			<div className='flex items-center justify-center'>
				<ColorIcon color={workTopic.color} />
			</div>
			<p className={`text-center justify-center ${settings.darkMode ? 'text-zinc-100' : 'text-black'}`}>{workTopic.name}</p>
		</div>
	);
};

export const selectedWorkTopicOptionTemplate = (workTopic: WorkTopic) => {
	const settings = useAppContext();
	if (workTopic) {
		return (
			<div className='flex flex-row items-center justify-center focus:outline-none'>
				<ColorIcon color={workTopic.color} />
				<p className={`text-center justify-center ${settings.darkMode ? 'text-zinc-100' : 'text-black'}`}>{workTopic.name}</p>
			</div>
		);
	}

	return <p>Select a Work Topic</p>;
};
