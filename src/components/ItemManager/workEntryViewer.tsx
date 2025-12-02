// Component Imports
import WorkEntryTile from './workEntryTile';
// Utils Imports
import { useAppContext } from '../../hooks/useAppContext';

// Component Definition
const WorkEntryViewer = () => {
	const settings = useAppContext();

	return (
		<div className='flex flex-col w-full h-full space-y-2'>
			<h2 className='h-6 font-semibold'>Work Entries</h2>
			<div className='flex flex-col flex-1 overflow-y-auto'>
				{settings.workEntries.map((workEntry) => (
					<WorkEntryTile
						key={workEntry.id}
						workEntry={workEntry}
						workTasks={settings.workTasks}
						workTopics={settings.workTopics}
					/>
				))}
			</div>
		</div>
	);
};

export default WorkEntryViewer;
