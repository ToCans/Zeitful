// Component Imports
import WorkEntryTile from './workEntryTile';
// Utils Imports
import { useSettings } from '../../hooks/use-settings';

// Component Definition
const WorkEntryManager = () => {
	const settings = useSettings();


	return (
		<div className="flex flex-col w-full">
			<h2 className="font-semibold p-2">Work Entries</h2>
			<div className="flex-1 overflow-y-auto">
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
