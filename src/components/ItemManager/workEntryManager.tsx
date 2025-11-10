// Component Imports
import WorkEntryTile from './workEntryTile';
// Utils Imports
import { useSettings } from '../../hooks/use-settings';

// Component Definition
const WorkEntryManager = () => {
	const settings = useSettings();


	return (
		<div className='flex flex-col flex-1'>
			<div className='flex items-center justify-between mt-4'>
				<h2 className='font-semibold'>Work Entries</h2>

			</div>
			<div className='overflow-y-scroll mt-2'>
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
