// Component Imports
import WorkEntryTile from './workEntryTile';
// Utils Imports
import { useSettings } from '../../hooks/use-settings';

// Component Definition
const WorkEntryManager = () => {
	const settings = useSettings();

	return (
		<div className='flex flex-col h-full w-full'>
			<h2 className='font-semibold'>Work Entries</h2>
			<div className='flex flex-col w-full h-4/5 overflow-y-auto p-2'>
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

export default WorkEntryManager;
