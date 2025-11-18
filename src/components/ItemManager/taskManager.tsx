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
				<IconContext.Provider
					value={{
						className: 'fill-gray-600 hover:fill-gray-500 size-6 m-2',
					}}
				>
					<PiPlus
						onClick={() => {
							let selectedTopicName = selectedTopic?.id ?? selectedTopic;
							handleAddTask(settings, {
								topic_id: selectedTopicName,
								name: newTaskName,
							} as any);
						}}
					/>
				</IconContext.Provider>

				<InputText
					className='w-2/5'
					id='newTask'
					placeholder='Add a new task'
					value={newTaskName}
					onChange={(e) => setNewTaskName(e.target.value)}
				/>
				<p>under</p>
				<Dropdown
					className='w-2/5'
					value={selectedTopic}
					onChange={(e) => {
						setSelectedTopic(e.value);
					}}
					placeholder='"Select a Work Topic'
					options={settings.workTopics}
					optionLabel='name'
					itemTemplate={workTopicOptionTemplate}
					valueTemplate={selectedWorkTopicOptionTemplate}
				/>
			</div>
			<div className='flex flex-col w-full h-full py-2'>
				<h2 className='font-semibold'>Work Tasks</h2>
				<div className='flex flex-col h-7/8 overflow-y-auto p-1'>
					{settings.workTasks.map((task) => (
						<TaskTile key={task.id} task={task} topics={settings.workTopics} />
					))}
				</div>
			</div>
		</div>
	);
};

export default TaskManager;
