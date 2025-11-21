// Component Import
import ColorIcon from './colorIcon';
// Type Import
import type { WorkTopic } from '../../types/types';
import { useAppContext } from '../../hooks/useAppContext';
import { useState, useCallback } from 'react';
import { IconContext } from 'react-icons';
import { PiNotePencil } from 'react-icons/pi';
import { PiTrash } from 'react-icons/pi';
import { getTopics, deleteTopic } from '../../api/localDatabase';
import EditTopicModal from './editTopicModal';

// Interface Defintion
interface TopicTileProps {
	workTopic: WorkTopic;
}

// Component Defintion
const TopicTile = ({ workTopic }: TopicTileProps) => {
	const settings = useAppContext();
	const [editMode, setEditMode] = useState<boolean>(false);

	// Memorized handlers
	const handleDelete = useCallback(async () => {
		const response = await deleteTopic(workTopic.id, workTopic);
		console.log(response.status, response.message);
		settings.setWorkTopics((await getTopics()).item as WorkTopic[]);
	}, []);

	return (
		<div className='flex flex-row space-x-2 items-center w-full p-1'>
			<ColorIcon color={workTopic.color} />
			<div className='flex md:flex-row flex-col md:items-center flex-1 gap-1'>
				<p className='text-sm text-nowrap w-3/6'>{workTopic.name}</p>

			</div>
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

			{editMode ? <EditTopicModal setEditMode={setEditMode} workTopic={workTopic} /> : null}
		</div>
	);
};

export default TopicTile;
