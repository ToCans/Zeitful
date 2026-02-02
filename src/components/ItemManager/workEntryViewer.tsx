// Component Imports
import WorkEntryTile from './workEntryTile';
// Icon Imports
import { PiSortAscending, PiSortDescending } from 'react-icons/pi';
import { IconContext } from 'react-icons';
// Hook Imports
import { useAppContext } from '../../hooks/useAppContext';
// React Imports
import { useMemo, useState } from 'react';
// Utils Imports
import { sortWorkEntriesByCompletionTime } from '../../utils/items';

// Component Definition
const WorkEntryViewer = () => {
	const settings = useAppContext();
	const [sortMethod, setSortMethod] = useState<'dsc' | 'asc'>('dsc');

	const sortedWorkEntries = useMemo(() => {
		return sortWorkEntriesByCompletionTime(settings.workEntries, sortMethod);
	}, [settings.workEntries, sortMethod]);

	return (
		<div className='flex flex-col w-full h-full space-y-2'>
			<div className='flex flex-row h-6 space-x-2 justify-between'>
				<h2 className='font-semibold'>Work Entries</h2>
				<div className='flex flex-row items-center space-x-1'>
					<IconContext.Provider
						value={{
							className: `${settings.darkMode
								? 'fill-gray-200 hover:fill-gray-400'
								: 'fill-black hover:fill-gray-600'
								} ${sortMethod === 'asc' ? 'opacity-100' : 'opacity-50'} 
								size-4 custom-target-icon`,
						}}
					>
						<PiSortAscending onClick={() => { setSortMethod('asc'); }} />
					</IconContext.Provider>
					<IconContext.Provider
						value={{
							className: `${settings.darkMode
								? 'fill-gray-200 hover:fill-gray-400'
								: 'fill-black hover:fill-gray-600'
								} ${sortMethod === 'dsc' ? 'opacity-100' : 'opacity-50'} 
								size-4 custom-target-icon`,
						}}
					>
						<PiSortDescending onClick={() => { setSortMethod('dsc'); }} />
					</IconContext.Provider>
				</div>
			</div>

			<div className='flex flex-col flex-1 min-h-0 overflow-y-auto'>
				{sortedWorkEntries.map((workEntry) => (
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
