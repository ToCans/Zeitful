// Component Imports
import TopicTile from './topicTile';
// Store Imports
import { useDataStore } from '../../stores/useDataStore';

// Component Definition
const TopicViewer = () => {
	const workTopics = useDataStore((state) => state.workTopics);

	const activeTopics = workTopics.filter((topic) => topic.last_action !== 3);

	return (
		<div className='flex flex-col w-full h-full space-y-2'>
			<h2 className='h-6 font-semibold py-1'>Work Topics</h2>
			<div className='flex flex-col flex-1 overflow-y-auto'>
				{activeTopics?.length !== 0 ? (
					activeTopics.map((workTopic) => (
						<TopicTile key={workTopic.id} workTopic={workTopic} />
					))
				) : (
					<div className='flex w-full h-full min-h-0 items-center justify-center'>
						<p className='text-sm p-2'>No Topics available.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default TopicViewer;