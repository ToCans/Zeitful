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
import { useSettings } from '../../hooks/use-settings';
import { handleAddTopic } from '../../api/database';

// Component Definition
const TopicManager = () => {
	const settings = useSettings();
	const [newTopicName, setNewTopicName] = useState<string>('');
	const [newTopicColor, setNewTopicColor] = useState<string>(getRandomHexColor());

	return (
		<div className='flex flex-col flex-1'>
			<div className='flex flex-row items-center gap-2'>
				<IconContext.Provider
					value={{
						className: 'fill-gray-600 size-6 m-2',
					}}
				>
					<PiPlus
						onClick={() =>
							handleAddTopic(settings, { name: newTopicName, color: newTopicColor })
						}
					/>
				</IconContext.Provider>

				<InputText
					id='newTopic'
					placeholder='Add a new topic'
					value={newTopicName}
					onChange={(e) => setNewTopicName(e.target.value)}
				/>

				<ColorPicker
					value={newTopicColor}
					onChange={(e) => setNewTopicColor(`#${e.value}`)}
				/>
			</div>
			<div className='overflow-auto'>
				<h2 className='mt-4 font-semibold'>Topics</h2>
				{settings.workTopics.map((topic) => (
					<TopicTile key={topic.id} topic={topic} />
				))}
			</div>
		</div>
	);
};

export default TopicManager;
