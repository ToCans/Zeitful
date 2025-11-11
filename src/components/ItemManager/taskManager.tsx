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
import { handleAddTask } from '../../api/tasks';
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
								name: newTaskName,
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
			<div className="flex flex-col w-full">
				<h2 className="font-semibold p-2">Tasks</h2>
				<div className="flex-1 overflow-y-auto">
					{settings.workTasks.map((task) => (
						<TaskTile key={task.id} task={task} topics={settings.workTopics} />
					))}
				</div>
			</div>
		</div>
	);
};

export default TaskManager;
