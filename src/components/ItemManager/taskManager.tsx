// Component Imports
import { IconContext } from 'react-icons';
import { PiPlus } from 'react-icons/pi';
import TaskTile from './taskTile';
import { Dropdown } from 'primereact/dropdown';

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
import type { WorkTask, WorkTopic } from '../../types/types';
import {
	selectedWorkTopicOptionTemplate,
	workTopicOptionTemplate,
} from './workTopicOptionTemplate';
import type { SettingsContextType } from '../../types/context';
import { addWorkTaskSupabaseDatabase } from '../../api/cloudDatabase';

// Component Definition
const TaskManager = () => {
	const settings = useAppContext();
	const [newTaskName, setNewTaskName] = useState<string>('');
	const [selectedTopic, setSelectedTopic] = useState<WorkTopic | null>(null);

	const handleAddTask = useCallback(
		async (
			settings: SettingsContextType,
			workTask: WorkTask
		) => {
			if (workTask.name !== '') {
				const response = await addTask(workTask);
				console.log(response.status, response.message);
				settings.setWorkTasks((await getTasks()).item as WorkTask[]);
			} else {
				console.log('Please enter a task name');
			}
		},
		[]
	);

	const handleAddTaskToCloudDatabase = useCallback(
		async (
			settings: SettingsContextType,
			workTask: WorkTask
		) => {
			if (workTask.name !== '') {
				if (settings.cloudDatabase) {
					const response = await addWorkTaskSupabaseDatabase(settings.cloudDatabase, workTask);
					console.log(response.status, response.message);
					settings.setWorkTasks((await getTasks()).item as WorkTask[]);
				} else {
					console.log('Please enter a task name');
				}
			}
		},
		[]
	);

	return (
		<div className='flex flex-col flex-1'>
			<div className='flex flex-row items-center gap-2 w-full'>
				<button
					className='m-2 cursor-pointer'
					onClick={async () => {
						const id = uuidv4();
						const selectedTopicId = selectedTopic?.id ?? null;
						await handleAddTask(settings, {
							id: id,
							topic_id: selectedTopicId,
							name: newTaskName,
							status: 'Open',
							last_action: 'Added'
						});
						if (settings.cloudDatabase) {
							await handleAddTaskToCloudDatabase(settings, {
								id: id,
								topic_id: selectedTopicId,
								name: newTaskName,
								status: 'Open',
								last_action: 'Added'
							});
						}
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
					className={`w-2/5 ${settings.darkMode
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
					options={settings.workTopics.filter(topic => topic.last_action !== "Deleted")}
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
					{settings.workTasks.filter(task => task.last_action !== "Deleted").map((task) => (
						<TaskTile key={task.id} workTask={task} workTopics={settings.workTopics} />
					))}

				</div>
			</div>
		</div >
	);
};

export default TaskManager;
