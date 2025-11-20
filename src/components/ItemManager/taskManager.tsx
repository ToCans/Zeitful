// Component Imports
import { IconContext } from 'react-icons';
import { PiPlus } from 'react-icons/pi';
import TaskTile from './taskTile';
import { Dropdown } from 'primereact/dropdown';
// Hook Imports
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
// Utils Imports
import { useAppContext } from '../../hooks/useAppContext';
import { handleAddTask } from '../../api/tasks';
import type { WorkTopic } from '../../types/types';
import {
	selectedWorkTopicOptionTemplate,
	workTopicOptionTemplate,
} from './workTopicOptionTemplate';

// Component Definition
const TaskManager = () => {
	const settings = useAppContext();
	const [newTaskName, setNewTaskName] = useState<string>('');
	const [selectedTopic, setSelectedTopic] = useState<WorkTopic | null>(null);
	return (
		<div className='flex flex-col flex-1'>
			<div className='flex flex-row items-center gap-2 w-full'>
				<button
					className='m-2 cursor-pointer'
					onClick={() => {
						let selectedTopicName = selectedTopic?.id ?? selectedTopic;
						handleAddTask(settings, {
							topic_id: selectedTopicName,
							name: newTaskName,
						} as any);
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
				<div className='flex flex-col h-[90%] overflow-y-auto'>
					{settings.workTasks.map((task) => (
						<TaskTile key={task.id} task={task} topics={settings.workTopics} />
					))}
				</div>
			</div>
		</div>
	);
};

export default TaskManager;
