// Component Imports
import TaskFilterButton from '../../pages/timer/components/taskFilterButton';
import TaskTile from './taskTile';
// React Imports
import { useState } from 'react';
// Store Imports
import { useDataStore } from '../../stores/useDataStore';
// Type Imports
import type { WorkTaskStatus } from '../../types/types';

// Interface Definition
interface TaskViewerProps {
	itemAddedSuccess: boolean;
}

// Component Definition
const TaskViewer = ({ itemAddedSuccess }: TaskViewerProps) => {
	const workTasks = useDataStore((state) => state.workTasks);
	const workTopics = useDataStore((state) => state.workTopics);

	const [workTaskStatus, setWorkTaskStatus] = useState<WorkTaskStatus>(2);

	const filteredTasks = workTasks.filter(
		(task) => task.status === workTaskStatus && task.last_action !== 3,
	);

	const workTaskMapping: Record<WorkTaskStatus, string> = {
		1: 'Open',
		2: 'Active',
		3: 'Closed',
	};

	return (
		<div className='flex flex-col w-full h-full space-y-2'>
			<div className='flex flex-row h-6 space-x-2 py-1'>
				<h2 className='font-semibold'>Work Tasks</h2>
				<div className='flex flex-row space-x-1'>
					<TaskFilterButton
						isActive={workTaskStatus === 2}
						value={2}
						setWorkTaskStatus={setWorkTaskStatus}
					/>
					<TaskFilterButton
						isActive={workTaskStatus === 1}
						value={1}
						setWorkTaskStatus={setWorkTaskStatus}
					/>
					<TaskFilterButton
						isActive={workTaskStatus === 3}
						value={3}
						setWorkTaskStatus={setWorkTaskStatus}
					/>
				</div>
				<p className={`text-zinc-500 text-sm transition-all duration-300 ${itemAddedSuccess
					? 'opacity-100 translate-y-0'
					: 'opacity-0 translate-y-4 pointer-events-none h-0'
					}`}>
					Task was added successfully to "Open" tasks.
				</p>
			</div>

			<div className='flex flex-col flex-1 overflow-y-auto'>
				{filteredTasks?.length !== 0 ? (
					filteredTasks.map((task) => (
						<TaskTile
							key={task.id}
							workTask={task}
							workTopics={workTopics}
						/>
					))
				) : (
					<div className='flex w-full h-full min-h-0 items-center justify-center'>
						<p className='text-sm p-2'>No {workTaskMapping[workTaskStatus]} Tasks found.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default TaskViewer;