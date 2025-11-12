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
import { handleAddTopic } from '../../api/topics';

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
						className: 'fill-gray-600 hover:fill-gray-500 size-6 m-2',
					}}
				>
					<PiPlus
						onClick={() =>
							handleAddTopic(settings, { name: newTopicName, color: newTopicColor })
						}
					/>
				</IconContext.Provider>

				<InputText
					className='w-2/5'
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
			<div className="flex flex-col w-full">
				<h2 className="font-semibold p-2">Topics</h2>
				<div className="flex-1 overflow-y-auto">
					{settings.workTopics.map((topic) => (
						<TopicTile key={topic.id} topic={topic} />
					))}
				</div>
			</div>
		</div>
	);
};

export default TopicManager;
