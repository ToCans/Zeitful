import type { EditedWorkTopic, WorkTopic } from '../../types/types';
import { PiXBold, PiCheckBold } from 'react-icons/pi';
import { IconContext } from 'react-icons';
import { useAppContext } from '../../hooks/useAppContext';
import { InputText } from 'primereact/inputtext';
import { useState, useCallback, type SetStateAction } from 'react';
import { editTopic, getTopics } from '../../api/localDatabase';
import type { Dispatch } from 'react';
import { ColorPicker } from 'primereact/colorpicker';

interface EditTopicModalProps {
    setEditMode: Dispatch<SetStateAction<boolean>>;
    workTopic: WorkTopic;
}

const EditTopicModal = ({ setEditMode, workTopic }: EditTopicModalProps) => {
    const settings = useAppContext();
    const [editValues, setEditValues] = useState({
        name: workTopic.name,
        color: workTopic.color,
        last_action: workTopic.last_action
    });

    const handleConfirmEdit = useCallback(async (topicId: string, workTopic: EditedWorkTopic) => {
        const response = await editTopic(topicId, workTopic);
        console.log(response.status, response.message);
        settings.setWorkTopics((await getTopics()).item as WorkTopic[]);
        setEditMode(false);
    }, []);

    return (
        <div className="absolute top-0 left-0 flex flex-col h-full w-full bg-black/60 z-30 p-2 justify-center items-center">
            <div className='flex lg:size-96 size-80 rounded-lg p-4 flex-col items-center'>
                <div className='flex w-full justify-end space-x-1'>
                    <IconContext.Provider
                        value={{
                            className: `${settings.darkMode
                                ? 'fill-gray-200 hover:fill-gray-400'
                                : 'fill-gray-600 hover:fill-gray-400'
                                } size-6 custom-target-icon`,
                        }}
                    >
                        <PiXBold onClick={() => { setEditMode(false); }} />
                    </IconContext.Provider>
                    <IconContext.Provider
                        value={{
                            className: `${settings.darkMode
                                ? 'fill-gray-200 hover:fill-gray-400'
                                : 'fill-gray-600 hover:fill-gray-400'
                                } size-6 custom-target-icon`,
                        }}
                    >
                        <PiCheckBold onClick={() => { handleConfirmEdit(workTopic.id, editValues); }} />
                    </IconContext.Provider>
                </div>
                <div className='flex flex-1 items-center justify-center'>
                    <div className='flex flex-col items-center w-full '>
                        <div className='flex flex-col w-full'>
                            <p className='font-semibold'>Topic Color</p>
                            <ColorPicker
                                value={editValues.color}
                                onChange={(e) => setEditValues({ ...editValues, color: `#${e.value}` })}
                            />
                            <p className='font-semibold'>Topic Name</p>
                            <InputText
                                className={`${settings.darkMode
                                    ? 'dark-dropdown text-zinc-100'
                                    : 'light-dropdown text-black'
                                    }`}

                                value={editValues.name}
                                onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                                style={{
                                    backgroundColor: settings.darkMode ? '#52525B' : '#ffffff', // input background
                                    color: settings.darkMode ? '#F4F4F5' : '#000000',
                                    borderColor: settings.darkMode ? '#6b7280' : '#d1d5db', // border color
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default EditTopicModal;;