// API Imports
import { addTopic, getTopics } from '../../../api/database';
// Function Imports
import { v4 as uuidv4 } from 'uuid';
// Component Imports
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { ColorPicker } from "primereact/colorpicker";
import { Dropdown } from 'primereact/dropdown';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import { OverlayPanel } from 'primereact/overlaypanel';
import { selectedWorkItemTemplate, workItemOptionTemplate } from './workItemTemplate';
// Hook Imports
import { useSettings } from '../../../hooks/use-settings';
// React Imports
import { useRef, useState } from 'react';

// Component Definition
const TaskFocus = () => {
    const settings = useSettings();
    const [text, setText] = useState("");
    const [color, setColor] = useState("000000");
    const op = useRef<OverlayPanel>(null);

    const handleAddTopic = async () => {
        const id = uuidv4();
        const response = await addTopic({ id: id, topic: 'New Topic', color: '#FF9900' });
        console.log(response.status);
        console.log(response.message);
        settings.setWorkTopics(await getTopics());
    };

    return (
        <div className="flex border-2 rounded-lg bg-white items-center justify-center opacity-70">
            <Button icon="pi pi-plus" pt={{
                root: { className: 'outline-none focus:outline-none ring-0 focus:ring-0 ' },
            }} onClick={(e) => op.current?.toggle(e)} />
            <Dropdown value={settings.activeWorkTask} onChange={(e: DropdownChangeEvent) => settings.setActiveWorkItem(e.value)} options={settings.workItems} optionLabel="name" placeholder="Select a work item"
                filter filterDelay={400} valueTemplate={selectedWorkItemTemplate} itemTemplate={workItemOptionTemplate} className="w-full" pt={{
                    root: { className: 'outline-none focus:outline-none ring-0 focus:ring-0' },
                    input: { className: 'outline-none focus:outline-none ring-0 focus:ring-0' },
                    trigger: { className: 'outline-none focus:outline-none ring-0 focus:ring-0' }
                }} />
            <OverlayPanel ref={op}>
                <div className="flex flex-col">
                    <div className='flex flex-row space-x-2'>
                        <ColorPicker
                            className="outline-none focus:outline-none ring-0 focus:ring-0 focus:shadow-none"
                            onChange={(e) => setColor(e.value as string)}
                        />

                        <InputText
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full outline-none focus:outline-none "
                            placeholder="New Focus Item"
                        />

                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <Button
                            label="Cancel"
                            size="small"
                            severity="secondary"
                            onClick={() => op.current?.hide()}
                        />
                        <Button label="Add" size="small" onClick={() => { submitWorkItem({ op, text, color, session: settings.session, setColor, setText, setWorkItems: settings.setWorkItems }); }} />
                    </div>
                </div>
            </OverlayPanel>
        </div>
    );
};

export default TaskFocus;