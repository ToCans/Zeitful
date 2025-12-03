// Component Imports
import TaskFilterButton from '../../pages/timer/components/taskFilterButton';
import TaskTile from './taskTile';
// React Imports
import { useState } from 'react';
// Type Imports
import type { WorkTaskStatus } from '../../types/types';
// Utils Imports
import { useAppContext } from '../../hooks/useAppContext';



// Component Definition
const TaskViewer = () => {
	const settings = useAppContext();
	const [workTaskStatus, setWorkTaskStatus] = useState<WorkTaskStatus>(1);

	return (
		<div className='flex flex-col w-full h-full space-y-2'>
			<div className='flex flex-row h-6 space-x-2'>
				<h2 className='font-semibold'>Work Tasks</h2>
				<div className='flex flex-row space-x-1'>
					<TaskFilterButton isActive={workTaskStatus === 1} value={1} setWorkTaskStatus={setWorkTaskStatus} />
					<TaskFilterButton isActive={workTaskStatus === 2} value={2} setWorkTaskStatus={setWorkTaskStatus} />
					<TaskFilterButton isActive={workTaskStatus === 3} value={3} setWorkTaskStatus={setWorkTaskStatus} />
				</div>
			</div>
			<div className='flex flex-col flex-1 overflow-y-auto'>
				{settings.workTasks.filter(task => task.status === workTaskStatus && task.last_action !== 3).map((task) => (
					<TaskTile key={task.id} workTask={task} workTopics={settings.workTopics} />
				))}

			</div>
		</div>
	);
};

export default TaskViewer;
