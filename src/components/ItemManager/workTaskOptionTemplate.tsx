// Component Imports
import ColorIcon from './colorIcon';
// Hook Imports
import { useAppContext } from '../../hooks/useAppContext';
// Type Imports
import type { WorkTask } from '../../types/types';
// Utils Imports
import { intToColor } from '../../utils/colors';

export const workTaskOptionTemplate = (workTask: WorkTask) => {
	const settings = useAppContext();
	const matchedTopic = settings.workTopics.find((t) => t.id === workTask.topic_id);
	const tileColor = matchedTopic ? matchedTopic.color : 14408667;
	return (
		<div className={`flex flex-row items-center justify-center focus:outline-none ${settings.darkMode ? 'dark-mode' : 'light-mode'}`}>
			<ColorIcon color={intToColor(tileColor)} />
			<p className={`text-center justify-center ${settings.darkMode ? 'text-zinc-100' : 'text-black'}`}>{workTask.name}</p>
		</div>
	);
};

export const selectedWorkTaskOptionTemplate = (workTask: WorkTask) => {
	const settings = useAppContext();
	if (workTask) {
		const matchedTopic = settings.workTopics.find((t) => t.id === workTask.topic_id);
		const tileColor = matchedTopic ? matchedTopic.color : 14408667;
		return (
			<div className='flex flex-row items-center justify-center focus:outline-none'>
				<ColorIcon color={intToColor(tileColor)} />
				<p className={`text-center justify-center ${settings.darkMode ? 'text-zinc-100' : 'text-black'}`}>{workTask.name}</p>
			</div>
		);
	}

	return <p>Select a Work Task</p>;
};
