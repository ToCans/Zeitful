// Component Imports
import { Dropdown } from 'primereact/dropdown';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import {
	workTaskOptionTemplate,
	selectedWorkTaskOptionTemplate,
} from '../../../components/ItemManager/workTaskOptionTemplate';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';

// Component Definition
const TaskFocus = () => {
	const settings = useAppContext();
	return (
		<div className='flex rounded-lg bg-white items-center justify-center opacity-70'>
			<Dropdown
				value={settings.activeWorkTask}
				onChange={(e: DropdownChangeEvent) => settings.setActiveWorkTask(e.value)}
				options={settings.workTasks}
				optionLabel='name'
				placeholder='Select a Work Task'
				valueTemplate={selectedWorkTaskOptionTemplate}
				itemTemplate={workTaskOptionTemplate}
				className='w-full'
				pt={{
					root: { className: 'outline-none focus:outline-none ring-0 focus:ring-0' },
					input: { className: 'outline-none focus:outline-none ring-0 focus:ring-0' },
					trigger: { className: 'outline-none focus:outline-none ring-0 focus:ring-0' },
				}}
			/>
		</div>
	);
};

export default TaskFocus;
