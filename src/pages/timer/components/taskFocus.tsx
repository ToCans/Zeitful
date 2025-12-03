// Component Imports
import { Dropdown } from 'primereact/dropdown';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import {
	workTaskOptionTemplate,
	selectedWorkTaskOptionTemplate,
} from '../../../components/ItemManager/workTaskOptionTemplate';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
// Utils Imports
import { sortWorkTasks } from '../../../utils/items';

// Component Definition
const TaskFocus = () => {
	const settings = useAppContext();
	const sortedWorkTasks = sortWorkTasks(settings.workEntries, settings.workTasks);

	return (
		<div className='flex rounded-lg items-center justify-center'>
			<Dropdown
				value={settings.activeWorkTask}
				onChange={(e: DropdownChangeEvent) => settings.setActiveWorkTask(e.value)}
				options={sortedWorkTasks.filter(task => task.last_action !== 3)}
				optionLabel='name'
				placeholder='Select a Work Task'
				valueTemplate={selectedWorkTaskOptionTemplate}
				itemTemplate={workTaskOptionTemplate}
				className={`w-full ${settings.darkMode ? 'dark-dropdown' : 'light-dropdown'}`}
				style={{
					backgroundColor: settings.darkMode ? '#52525B' : '#ffffff',
					borderColor: settings.darkMode ? '#6b7280' : '#d1d5db',
				}}
				panelClassName={settings.darkMode ? 'dark-dropdown-panel' : 'light-dropdown-panel'}
				panelStyle={{ backgroundColor: settings.darkMode ? '#52525B' : '#ffffff' }}
			/>
		</div>
	);
};

export default TaskFocus;
