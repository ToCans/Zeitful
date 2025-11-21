
// Comopnent Imports
import ColorIcon from './colorIcon';
import EditTaskModal from './editTaskModal';
// Hook Imports
import { useAppContext } from '../../hooks/useAppContext';
// Icon Imports
import { PiNotePencil, PiTrash } from 'react-icons/pi';
import { IconContext } from 'react-icons';
// React Imports
import { useState, useCallback } from 'react';
// Type Imports
import type { WorkTask, WorkTopic } from '../../types/types';
import { getTasks, deleteTask } from '../../api/localDatabase';


// Interface Defintion
interface TaskTileProps {
	workTopics: WorkTopic[];
	workTask: WorkTask;
}

const TaskTile = ({ workTopics, workTask }: TaskTileProps) => {
	const settings = useAppContext();
	const [editMode, setEditMode] = useState<boolean>(false);

	const matchedTopic = workTopics.find((topic) => topic.id === workTask.topic_id);
	const tileColor = matchedTopic ? matchedTopic.color : '#DBDBDB';
	const topicName = matchedTopic ? matchedTopic.name : 'No Topic';

	// Memorized handlers
	const handleDelete = useCallback(async () => {
		const response = await deleteTask(workTask.id, workTask);
		console.log(response.status, response.message);
		settings.setWorkTasks((await getTasks()).item as WorkTask[]);
	}, []);

	return (
		<div className='flex flex-row space-x-2 items-center w-full p-1'>
			<ColorIcon color={tileColor} />
			<div className='flex md:flex-row flex-col md:items-center flex-1 gap-1'>
				<p className='text-sm text-nowrap w-3/6'>{workTask.name}</p>
				<p className='text-sm text-nowrap w-2/6'>{topicName}</p>

			</div>
			<p className='text-sm text-nowrap w-1/6'>{workTask.status}</p>
			<IconContext.Provider
				value={{
					className: `${settings.darkMode
						? 'fill-gray-200 hover:fill-gray-400'
						: 'fill-gray-600 hover:fill-gray-400'
						} size-5 custom-target-icon`,
				}}
			>
				<PiNotePencil onClick={() => setEditMode(true)} />
				<PiTrash onClick={async () => { handleDelete(); }} />
			</IconContext.Provider>

			{editMode ? <EditTaskModal setEditMode={setEditMode} workTask={workTask} /> : null}
		</div>

	);

};

export default TaskTile;
