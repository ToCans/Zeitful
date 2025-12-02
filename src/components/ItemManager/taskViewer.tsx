// Component Imports
import TaskTile from './taskTile';
// Utils Imports
import { useAppContext } from '../../hooks/useAppContext';



// Component Definition
const TaskViewer = () => {
	const settings = useAppContext();

	return (
		<div className='flex flex-col w-full h-full space-y-2'>
			<h2 className='h-6 font-semibold'>Work Tasks</h2>
			<div className='flex flex-col flex-1 overflow-y-auto'>
				{settings.workTasks.filter(task => task.last_action !== "Deleted").map((task) => (
					<TaskTile key={task.id} workTask={task} workTopics={settings.workTopics} />
				))}

			</div>
		</div>
	);
};

export default TaskViewer;
