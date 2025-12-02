// Component Imports
import TopicTile from './topicTile';
// Hook Imports
import { useAppContext } from '../../hooks/useAppContext';

// Component Definition
const TopicViewer = () => {
	const settings = useAppContext();

	return (
		<div className='flex flex-col w-full h-full space-y-2'>
			<h2 className='h-6 font-semibold'>Work Topics</h2>
			<div className='flex flex-col flex-1 overflow-y-auto'>
				{settings.workTopics.filter(topic => topic.last_action !== "Deleted").map((workTopic) => (
					<TopicTile key={workTopic.id} workTopic={workTopic} />
				))}
			</div>
		</div>
	);
};

export default TopicViewer;
