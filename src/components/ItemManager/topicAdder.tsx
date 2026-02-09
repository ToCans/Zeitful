// API Imports
import { addTopic, getTopics } from '../../api/localDatabase';
import { addWorkTopicSupabaseDatabase } from '../../api/cloudDatabase';
// Component Imports
import { IconContext } from 'react-icons';
import { PiPlus } from 'react-icons/pi';
import { ColorPicker } from 'primereact/colorpicker';
import { InputText } from 'primereact/inputtext';
// Hook Imports
import { useState, useCallback } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
// Library Imports
import { v4 as uuidv4 } from 'uuid';
// Type Imports
import type { WorkTopic } from '../../types/types';
import type { SettingsContextType } from '../../types/context';
// Utils Imports
import { colorToInt, getRandomHexColor } from '../../utils/colors';

// Component Definition
const TopicAdder = () => {
	const settings = useAppContext();
	const [newTopicName, setNewTopicName] = useState<string>('');
	const [newTopicColor, setNewTopicColor] =
		useState<string>(getRandomHexColor());

	const handleAddTopic = useCallback(
		async (settings: SettingsContextType, workTopic: WorkTopic) => {
			if (workTopic.name !== '') {
				const topicResponse = await addTopic(workTopic);
				if (topicResponse.status == 'Failure') {
					settings.toast?.show({
						severity: 'error',
						summary: topicResponse.status,
						detail: topicResponse.message,
						life: 3000,
					});
				} else {
					settings.setWorkTopics(
						(await getTopics()).item as WorkTopic[],
					);
				}
			} else {
				settings.toast?.show({
					severity: 'error',
					summary: 'Error',
					detail: 'Please enter a topic name.',
					life: 3000,
				});
			}
		},
		[],
	);

	const handleAddTopicToCloudDatabase = useCallback(
		async (settings: SettingsContextType, workTopic: WorkTopic) => {
			if (workTopic.name !== '') {
				if (settings.cloudDatabase) {
					const response = await addWorkTopicSupabaseDatabase(
						settings.cloudDatabase,
						workTopic,
					);
					console.log(response.status, response.message);
					settings.setWorkTopics(
						(await getTopics()).item as WorkTopic[],
					);
				} else {
					console.log('Please enter a task name');
				}
			}
		},
		[],
	);

	return (
		<div className='flex flex-row items-center gap-2 w-full'>
			<button
				className='m-2 cursor-pointer group'
				onClick={async () => {
					const id = uuidv4();
					await handleAddTopic(settings, {
						id: id,
						name: newTopicName,
						color: colorToInt(newTopicColor),
						last_action: 1,
						last_action_date: new Date().toISOString(),
					});
					if (settings.cloudDatabase) {
						await handleAddTopicToCloudDatabase(settings, {
							id: id,
							name: newTopicName,
							color: colorToInt(newTopicColor),
							last_action: 1,
							last_action_date: new Date().toISOString(),
						});
					}
				}}
			>
				<IconContext.Provider
					value={{
						className:
							'size-6 group-hover:text-zinc-400 transition-colors duration-200',
					}}
				>
					<PiPlus />
				</IconContext.Provider>
			</button>
			<InputText
				className={`w-2/5 ${
					settings.appSettings.darkMode
						? 'dark-dropdown text-zinc-100'
						: 'light-dropdown text-black'
				}`}
				id='newTopic'
				placeholder='Add a new topic'
				value={newTopicName}
				onChange={(e) => setNewTopicName(e.target.value)}
				style={{
					backgroundColor: settings.appSettings.darkMode
						? '#52525B'
						: '#ffffff', // input background
					color: settings.appSettings.darkMode
						? '#F4F4F5'
						: '#000000', // input text color
					borderColor: settings.appSettings.darkMode
						? '#6b7280'
						: '#d1d5db', // border color
				}}
			/>
			<ColorPicker
				value={newTopicColor}
				onChange={(e) => setNewTopicColor(`#${e.value}`)}
			/>
		</div>
	);
};

export default TopicAdder;
