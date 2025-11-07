// Component Imports
import WorkEntryTile from './workEntryTile';
// Utils Imports
import { useSettings } from '../../hooks/use-settings';

// Component Definition
const WorkEntryManager = () => {
	const settings = useSettings();
	return (
		<div className='flex flex-col flex-1'>
			<div className='overflow-auto'>
				<h2 className='mt-4 font-semibold'>Work Entries</h2>
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
