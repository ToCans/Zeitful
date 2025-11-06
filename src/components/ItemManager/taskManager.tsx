// Component Imports
import { IconContext } from 'react-icons';
import { PiPlus } from 'react-icons/pi';
import TaskTile from './taskTile';
import { Dropdown } from 'primereact/dropdown';
// Hook Imports
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
// Utils Imports
import { useSettings } from '../../hooks/use-settings';
import { handleAddTask } from '../../api/database';
import type { WorkTopic } from '../../types/types';
import {
	selectedWorkTopicOptionTemplate,
	workTopicOptionTemplate,
} from './workTopicOptionTemplate';

// Component Definition
const TaskManager = () => {
	const settings = useSettings();
	const [newTaskName, setNewTaskName] = useState<string>('');
	const [selectedTopic, setSelectedTopic] = useState<WorkTopic | null>(null);
	return (
		<div className='flex flex-col flex-1'>
			<div className='flex flex-row items-center gap-2'>
				<IconContext.Provider
					value={{
						className: 'fill-gray-600 size-6 m-2',
					}}
				>
					<PiPlus
						onClick={() => {
							let selectedTopicName = selectedTopic?.id ?? selectedTopic;
							handleAddTask(settings, {
								topic_id: selectedTopicName,
								task_name: newTaskName,
							} as any);
						}}
					/>
				</IconContext.Provider>

				<InputText
					id='newTask'
					placeholder='Add a new task'
					value={newTaskName}
					onChange={(e) => setNewTaskName(e.target.value)}
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
				/>
			</div>
			<div className='overflow-auto'>
				<h2 className='mt-4 font-semibold'>Tasks</h2>
				{settings.workTasks.map((task) => (
					<TaskTile key={task.id} task={task} topics={settings.workTopics} />
				))}
			</div>
		</div>
	);
};

export default TaskManager;
