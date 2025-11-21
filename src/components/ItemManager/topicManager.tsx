// Component Imports
import { IconContext } from 'react-icons';
import { PiPlus } from 'react-icons/pi';
import TopicTile from './topicTile';

// Hook Imports
import { InputText } from 'primereact/inputtext';
import { ColorPicker } from 'primereact/colorpicker';
import { useState } from 'react';

// Utils Imports
import { getRandomHexColor } from '../../utils/utils';
import { useAppContext } from '../../hooks/useAppContext';
import { handleAddTopic } from '../../api/topics';

// Component Definition
const TopicManager = () => {
	const settings = useAppContext();
	const [newTopicName, setNewTopicName] = useState<string>('');
	const [newTopicColor, setNewTopicColor] = useState<string>(getRandomHexColor());

	return (
		<div className='flex flex-col flex-1'>
			<div className='flex flex-row items-center gap-2'>
				<button
					className='m-2 cursor-pointer'
					onClick={() => {
						console.log('Fixing Topic Manager');
						// const id = uuidv4();
						// handleAddTopic(settings, { name: newTopicName, color: newTopicColor });
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
					className={`w-2/5 ${
						settings.darkMode
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
					{settings.workTopics.map((topic) => (
						<TopicTile key={topic.id} topic={topic} />
					))}
				</div>
			</div>
		</div>
	);
};

export default TopicManager;
