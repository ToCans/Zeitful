// Component Imports
import { IconContext } from 'react-icons';
import { PiPlus } from 'react-icons/pi';
import TaskTile from './taskTile';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import type { DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColorPicker } from 'primereact/colorpicker';
import type { ColumnEditorOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
// Hook Imports
import { useState } from 'react';
// Library Imports
import { v4 as uuidv4 } from 'uuid';
// React Imports
import { useCallback } from 'react';
import { addTask, getTasks } from '../../api/localDatabase';
// Utils Imports
import { useAppContext } from '../../hooks/useAppContext';
import type { NewWorkTask, WorkTask, WorkTopic } from '../../types/types';
import {
	selectedWorkTopicOptionTemplate,
	workTopicOptionTemplate,
} from './workTopicOptionTemplate';
import type { SettingsContextType } from '../../types/context';

// Component Definition
const TaskManager = () => {
	const settings = useAppContext();
	const [newTaskName, setNewTaskName] = useState<string>('');
	const [selectedTopic, setSelectedTopic] = useState<WorkTopic | null>(null);

	const handleAddTask = useCallback(
		async (
			settings: SettingsContextType,
			task: Omit<WorkTask, 'id' | 'status' | 'last_action'>
		) => {
			if (task.name !== '') {
				const id = uuidv4();
				const response = await addTask(id, {
					topic_id: task.topic_id,
					name: task.name,
				});
				console.log(response.status, response.message);
				settings.setWorkTasks((await getTasks()).item as WorkTask[]);
			} else {
				console.log('Please enter a task name');
			}
		},
		[]
	);

	const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
		let _workTasks = [...settings.workTasks];
		let { newData, index } = e;

		_workTasks[index] = newData as WorkTask;

		console.log(_workTasks[index]);
	};

	const textEditor = (options: ColumnEditorOptions) => {
		return (
			<InputText
				style={{ width: '20%' }}
				type='text'
				value={options.value}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					options.editorCallback!(e.target.value)
				}
			/>
		);
	};

	return (
		<div className='flex flex-col flex-1'>
			<div className='flex flex-row items-center gap-2 w-full'>
				<button
					className='m-2 cursor-pointer'
					onClick={async () => {
						let selectedTopiId = selectedTopic?.id ?? selectedTopic;
						await handleAddTask(settings, {
							topic_id: selectedTopiId,
							name: newTaskName,
						} as NewWorkTask);
					}}
				>
					<IconContext.Provider
						value={{
							className: 'size-6',
						}}
					>
						<PiPlus />
					</IconContext.Provider>
				</button>
				<InputText
					className={`w-2/5 ${
						settings.darkMode
							? 'dark-dropdown text-zinc-100'
							: 'light-dropdown text-black'
					}`}
					id='newTask'
					placeholder='Add a new task'
					value={newTaskName}
					onChange={(e) => setNewTaskName(e.target.value)}
					style={{
						backgroundColor: settings.darkMode ? '#52525B' : '#ffffff', // input background
						color: settings.darkMode ? '#F4F4F5' : '#000000',
						borderColor: settings.darkMode ? '#6b7280' : '#d1d5db', // border color
					}}
				/>
				<p>under</p>
				<Dropdown
					value={selectedTopic}
					onChange={(e) => {
						setSelectedTopic(e.value);
					}}
					placeholder='"Select a Work Topic'
					options={settings.workTopics}
					optionLabel='name'
					itemTemplate={workTopicOptionTemplate}
					valueTemplate={selectedWorkTopicOptionTemplate}
					className={`w-2/5 ${settings.darkMode ? 'dark-dropdown' : 'light-dropdown'}`}
					style={{
						backgroundColor: settings.darkMode ? '#52525B' : '#ffffff',
						borderColor: settings.darkMode ? '#6b7280' : '#d1d5db',
					}}
					panelClassName={
						settings.darkMode ? 'dark-dropdown-panel' : 'light-dropdown-panel'
					}
					panelStyle={{ backgroundColor: settings.darkMode ? '#52525B' : '#ffffff' }}
				/>
			</div>
			<div className='flex flex-col w-full h-full py-2'>
				<h2 className='font-semibold'>Work Tasks</h2>
				<div className='flex flex-col md:h-7/8 h-7/10 overflow-y-auto'>
					{settings.workTasks.map((task) => (
						<TaskTile key={task.id} task={task} topics={settings.workTopics} />
					))}

					<DataTable
						value={settings.workTasks}
						editMode='row'
						dataKey='id'
						onRowEditComplete={onRowEditComplete}
						tableStyle={{ minWidth: '100%' }}
					>
						<Column
							field='name'
							header='Code'
							editor={(options) => textEditor(options)}
							style={{ width: '20%' }}
						></Column>
						<Column
							field='name'
							header='Name'
							editor={(options) => textEditor(options)}
							style={{ width: '20%' }}
						></Column>

						<Column
							rowEditor={true}
							headerStyle={{ width: '10%', minWidth: '5%' }}
							bodyStyle={{ textAlign: 'center' }}
						></Column>
					</DataTable>
				</div>
			</div>
		</div>
	);
};

export default TaskManager;
