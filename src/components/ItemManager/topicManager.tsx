// API Imports
import { addTopic, getTopics } from '../../api/localDatabase';
// Component Imports
import { IconContext } from 'react-icons';
import { PiPlus } from 'react-icons/pi';
import TopicTile from './topicTile';

// Hook Imports
import { InputText } from 'primereact/inputtext';
import { ColorPicker } from 'primereact/colorpicker';
import { useState, useCallback } from 'react';

// Utils Imports
import { getRandomHexColor } from '../../utils/utils';
import { useAppContext } from '../../hooks/useAppContext';

// Library Imports
import { v4 as uuidv4 } from 'uuid';
import type { WorkTopic } from '../../types/types';
import type { SettingsContextType } from '../../types/context';
import { addWorkTopicSupabaseDatabase } from '../../api/cloudDatabase';

// Component Definition
const TopicManager = () => {
	const settings = useAppContext();
	const [newTopicName, setNewTopicName] = useState<string>('');
	const [newTopicColor, setNewTopicColor] = useState<string>(getRandomHexColor());

	const handleAddTopic = useCallback(
		async (
			settings: SettingsContextType,
			workTopic: WorkTopic
		) => {
			if (workTopic.name !== '') {
				const response = await addTopic(workTopic);
				console.log(response.status, response.message);
				settings.setWorkTopics((await getTopics()).item as WorkTopic[]);
			} else {
				console.log('Please enter a task name');
			}
		},
		[]
	);

	const handleAddTopicToCloudDatabase = useCallback(
		async (
			settings: SettingsContextType,
			workTopic: WorkTopic
		) => {
			if (workTopic.name !== '') {
				if (settings.cloudDatabase) {
					const response = await addWorkTopicSupabaseDatabase(settings.cloudDatabase, workTopic);
					console.log(response.status, response.message);
					settings.setWorkTopics((await getTopics()).item as WorkTopic[]);
				} else {
					console.log('Please enter a task name');
				}
			}
		},
		[]
	);

	return (
		<div className='flex flex-col flex-1'>
			<div className='flex flex-row items-center gap-2'>
				<button
					className='m-2 cursor-pointer'
					onClick={async () => {
						const id = uuidv4();
						await handleAddTopic(settings, { id: id, name: newTopicName, color: newTopicColor, last_action: "Added" });
						if (settings.cloudDatabase) {
							await handleAddTopicToCloudDatabase(settings, { id: id, name: newTopicName, color: newTopicColor, last_action: "Added" });
						}
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
					className={`w-2/5 ${settings.darkMode
						? 'dark-dropdown text-zinc-100'
						: 'light-dropdown text-black'
						}`}
					id='newTopic'
					placeholder='Add a new topic'
					value={newTopicName}
					onChange={(e) => setNewTopicName(e.target.value)}
					style={{
						backgroundColor: settings.darkMode ? '#52525B' : '#ffffff', // input background
						color: settings.darkMode ? '#F4F4F5' : '#000000', // input text color
						borderColor: settings.darkMode ? '#6b7280' : '#d1d5db', // border color
					}}
				/>
				<ColorPicker
					value={newTopicColor}
					onChange={(e) => setNewTopicColor(`#${e.value}`)}
				/>
			</div>
			<div className='flex flex-col h-full w-full py-2'>
				<h2 className='font-semibold'>Work Topics</h2>
				<div className='flex flex-col md:h-7/8 h-7/10 overflow-y-auto'>
					{settings.workTopics.filter(topic => topic.last_action !== "Deleted").map((workTopic) => (
						<TopicTile key={workTopic.id} workTopic={workTopic} />
					))}
				</div>
			</div>
		</div>
	);
};

export default TopicManager;
