import type { EditedWorkTask, WorkTask } from '../../types/types';
import { PiXBold, PiCheckBold } from 'react-icons/pi';
import { IconContext } from 'react-icons';
import { useAppContext } from '../../hooks/useAppContext';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useState, useCallback, type SetStateAction } from 'react';
import { workTopicOptionTemplate, selectedWorkTopicOptionTemplate } from './workTopicOptionTemplate';
import { editTask, getTasks } from '../../api/localDatabase';
import type { Dispatch } from 'react';
// API Imports


interface EditTaskModalProps {
    setEditMode: Dispatch<SetStateAction<boolean>>;
    workTask: WorkTask;
}

const EditTaskModal = ({ setEditMode, workTask }: EditTaskModalProps) => {
    const settings = useAppContext();
    const [editValues, setEditValues] = useState({
        name: workTask.name,
        topic_id: workTask.topic_id,
        status: workTask.status,
        last_action: workTask.last_action
    });

    const handleConfirmEdit = useCallback(async (taskId: string, workTask: EditedWorkTask) => {
        const response = await editTask(taskId, workTask);
        console.log(response.status, response.message);
        settings.setWorkTasks((await getTasks()).item as WorkTask[]);
        setEditMode(false);
    }, []);

    const matchedTopic = settings.workTopics.find((workTopic) => workTopic.id === editValues.topic_id);

    return (
        <div className="absolute top-0 left-0 flex flex-col h-full w-full bg-black/60 z-30 p-2 justify-center items-center">
            <div className='flex lg:size-96 size-80 rounded-lg bg-zinc-100 p-4 flex-col items-center'>
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
                        <PiCheckBold onClick={() => { handleConfirmEdit(workTask.id, editValues); }} />
                    </IconContext.Provider>
                </div>
                <div className='flex flex-1 items-center justify-center'>
                    <div className='flex flex-col items-center w-full '>
                        <div className='flex flex-col w-full'>
                            <p className='font-semibold'>Task Name</p>
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
                        <div className='flex flex-col w-full'>
                            <p className='font-semibold'>Assigned Topic</p>
                            <Dropdown
                                value={matchedTopic}
                                onChange={(e) => setEditValues({ ...editValues, topic_id: e.target.value.id })}
                                options={settings.workTopics}
                                placeholder='None' // Hacky way of triggering default option without having it in options
                                itemTemplate={workTopicOptionTemplate}
                                valueTemplate={selectedWorkTopicOptionTemplate}
                                className={`${settings.darkMode ? 'dark-dropdown' : 'light-dropdown'}`}
                                style={{
                                    backgroundColor: settings.darkMode ? '#52525B' : '#ffffff',
                                    borderColor: settings.darkMode ? '#6b7280' : '#d1d5db',
                                }}
                                panelClassName={settings.darkMode ? 'dark-dropdown-panel' : 'light-dropdown-panel'}
                                panelStyle={{ backgroundColor: settings.darkMode ? '#52525B' : '#ffffff' }}
                            />
                        </div>

                        <div className='flex flex-col w-full'>
                            <p className='font-semibold'>Task Status</p>
                            <Dropdown
                                value={editValues.status}
                                onChange={(e) => setEditValues({ ...editValues, status: e.value })}
                                options={['Open', 'Closed']}
                                optionLabel='name'
                                className={`${settings.darkMode ? 'dark-dropdown' : 'light-dropdown'}`}
                                style={{
                                    backgroundColor: settings.darkMode ? '#52525B' : '#ffffff',
                                    borderColor: settings.darkMode ? '#6b7280' : '#d1d5db',
                                }}
                                panelClassName={
                                    settings.darkMode ? 'dark-dropdown-panel' : 'light-dropdown-panel'
                                }
                                panelStyle={{ backgroundColor: settings.darkMode ? '#52525B' : '#ffffff' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default EditTaskModal;;