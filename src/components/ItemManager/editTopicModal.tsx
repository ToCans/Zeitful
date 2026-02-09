// API Imports
import { editTopic, getTopics } from '../../api/localDatabase';
// Component Imports
import { ColorPicker } from 'primereact/colorpicker';
import { InputText } from 'primereact/inputtext';
// Icon Imports
import { PiXBold, PiCheckBold } from 'react-icons/pi';
import { IconContext } from 'react-icons';
// Hook Imports
import { useAppContext } from '../../hooks/useAppContext';
// React Imports
import { useState, useCallback } from 'react';
// Type Imports
import type { Dispatch } from 'react';
import type { EditedWorkTopic, WorkTopic } from '../../types/types';
// Utils Imports
import { colorToInt, intToColor } from '../../utils/colors';

// Interface Definition
interface EditTopicModalProps {
	setEditMode: Dispatch<React.SetStateAction<boolean>>;
	workTopic: WorkTopic;
}

// Component Definition
const EditTopicModal = ({ setEditMode, workTopic }: EditTopicModalProps) => {
	const settings = useAppContext();
	const [editValues, setEditValues] = useState({
		name: workTopic.name,
		color: workTopic.color,
		last_action: workTopic.last_action,
		last_action_date: new Date().toISOString(),
	});

	const handleConfirmEdit = useCallback(
		async (topicId: string, workTopic: EditedWorkTopic) => {
			const topicResponse = await editTopic(topicId, workTopic);

			if (topicResponse.status == 'Failure') {
				settings.toast?.show({
					severity: 'error',
					summary: topicResponse.status,
					detail: topicResponse.message,
					life: 3000,
				});
			} else {
				settings.setWorkTopics((await getTopics()).item as WorkTopic[]);
			}
			setEditMode(false);
		},
		[settings, setEditMode],
	);

	return (
		<div className='absolute top-0 left-0 flex flex-col h-full w-full bg-black/60 z-30 p-2 justify-center items-center'>
			<div
				className={`${
					settings.darkMode ? 'bg-zinc-700' : 'bg-zinc-100'
				} flex lg:size-96 size-80 rounded-lg p-4 flex-col items-center`}
			>
				<div className='flex w-full justify-end space-x-1'>
					<IconContext.Provider
						value={{
							className: `${
								settings.darkMode
									? 'fill-gray-200 hover:fill-gray-400'
									: 'fill-gray-600 hover:fill-gray-400'
							} size-6 custom-target-icon`,
						}}
					>
						<PiXBold
							onClick={() => {
								setEditMode(false);
							}}
						/>
					</IconContext.Provider>
					<IconContext.Provider
						value={{
							className: `${
								settings.darkMode
									? 'fill-gray-200 hover:fill-gray-400'
									: 'fill-gray-600 hover:fill-gray-400'
							} size-6 custom-target-icon`,
						}}
					>
						<PiCheckBold
							onClick={() => {
								handleConfirmEdit(workTopic.id, editValues);
							}}
						/>
					</IconContext.Provider>
				</div>
				<div className='flex flex-1 items-center justify-center'>
					<div className='flex flex-col items-center w-full '>
						<div className='flex flex-col w-full space-y-2'>
							<p className='font-semibold'>Topic Color</p>
							<ColorPicker
								value={intToColor(editValues.color)}
								onChange={(e) =>
									setEditValues({
										...editValues,
										color: colorToInt('#' + e.value),
									})
								}
							/>
							<p className='font-semibold'>Topic Name</p>
							<InputText
								className={`${
									settings.darkMode
										? 'dark-dropdown text-zinc-100'
										: 'light-dropdown text-black'
								}`}
								value={editValues.name}
								onChange={(e) =>
									setEditValues({
										...editValues,
										name: e.target.value,
									})
								}
								style={{
									backgroundColor: settings.darkMode
										? '#52525B'
										: '#ffffff', // input background
									color: settings.darkMode
										? '#F4F4F5'
										: '#000000',
									borderColor: settings.darkMode
										? '#6b7280'
										: '#d1d5db', // border color
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditTopicModal;
