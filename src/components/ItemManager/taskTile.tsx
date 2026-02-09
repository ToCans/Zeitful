// API Imports
import { getTasks, deleteTask } from '../../api/localDatabase';
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
// Utils Imports
import { intToColor } from '../../utils/colors';

// Interface Defintion
interface TaskTileProps {
	workTopics: WorkTopic[];
	workTask: WorkTask;
}

const TaskTile = ({ workTopics, workTask }: TaskTileProps) => {
	const settings = useAppContext();
	const [editMode, setEditMode] = useState<boolean>(false);

	const matchedTopic = workTopics.find(
		(topic) => topic.id === workTask.topic_id,
	);
	const tileColor = matchedTopic ? matchedTopic.color : 14408667;
	const topicName = matchedTopic ? matchedTopic.name : 'No Topic';

	const convertStatusToText = useCallback((statusNumber: number): string => {
		if (statusNumber === 1) {
			return 'Open';
		} else if (statusNumber === 2) {
			return 'Active';
		} else {
			return 'Closed';
		}
	}, []);

	const handleDelete = useCallback(async () => {
		const taskResponse = await deleteTask(
			workTask.id,
			workTask,
			new Date().toISOString(),
		);
		if (taskResponse.status == 'Failure') {
			settings.toast?.show({
				severity: 'error',
				summary: taskResponse.status,
				detail: taskResponse.message,
				life: 3000,
			});
		} else {
			settings.setWorkTasks((await getTasks()).item as WorkTask[]);
		}
	}, [settings, workTask]);

	return (
		<div className='flex flex-row space-x-2 items-center w-full p-1'>
			<ColorIcon color={intToColor(tileColor)} />
			<div className='flex md:flex-row flex-col md:items-center flex-1 gap-1'>
				<p className='text-sm text-nowrap w-3/6'>{workTask.name}</p>
				<p className='text-sm text-nowrap w-2/6'>{topicName}</p>
			</div>
			<p className='text-sm text-nowrap w-1/6'>
				{convertStatusToText(workTask.status)}
			</p>
			<IconContext.Provider
				value={{
					className: `${
						settings.appSettings.darkMode
							? 'fill-gray-200 hover:fill-gray-400'
							: 'fill-gray-600 hover:fill-gray-400'
					} size-5 custom-target-icon`,
				}}
			>
				<PiNotePencil onClick={() => setEditMode(true)} />
				<PiTrash
					onClick={async () => {
						handleDelete();
					}}
				/>
			</IconContext.Provider>

			{editMode ? (
				<EditTaskModal
					setEditMode={setEditMode}
					workTask={workTask}
				/>
			) : null}
		</div>
	);
};

export default TaskTile;
