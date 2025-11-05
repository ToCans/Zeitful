// API Imports
import { handleAddTopic } from '../../../api/database';
// Component Imports
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ColorPicker } from 'primereact/colorpicker';
import { Dropdown } from 'primereact/dropdown';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import { OverlayPanel } from 'primereact/overlaypanel';
import { selectedWorkItemTemplate, workItemOptionTemplate } from './workItemTemplate';
// Hook Imports
import { useSettings } from '../../../hooks/use-settings';
// React Imports
import { useRef, useState } from 'react';

// Component Definition
const WorkFocus = () => {
	const settings = useSettings();
	const [topicText, setTopicText] = useState('');
	const [topicColor, setTopicColor] = useState('#FF0000');

	const op = useRef<OverlayPanel>(null);

	return (
		<div className='flex border-2 rounded-lg bg-white items-center justify-center opacity-70'>
			<Button
				icon='pi pi-plus'
				pt={{
					root: { className: 'outline-none focus:outline-none ring-0 focus:ring-0 ' },
				}}
				onClick={(e) => op.current?.toggle(e)}
			/>

			<Dropdown
				value={settings.activeWorkTask}
				onChange={(e: DropdownChangeEvent) => settings.setActiveWorkTask(e.value)}
				options={settings.workTopics}
				optionLabel='name'
				placeholder='Select a work topic'
				filter
				filterDelay={400}
				valueTemplate={selectedWorkItemTemplate}
				itemTemplate={workItemOptionTemplate}
				className='w-full'
				pt={{
					root: { className: 'outline-none focus:outline-none ring-0 focus:ring-0' },
					input: { className: 'outline-none focus:outline-none ring-0 focus:ring-0' },
					trigger: { className: 'outline-none focus:outline-none ring-0 focus:ring-0' },
				}}
			/>
			<OverlayPanel ref={op}>
				<div className='flex flex-col'>
					<div className='flex flex-row space-x-2'>
						<Dropdown
							value={settings.activeWorkTask}
							onChange={(e: DropdownChangeEvent) =>
								settings.setActiveWorkTask(e.value)
							}
							options={settings.workTopics}
							optionLabel='name'
							placeholder='Select a work topic'
							filter
							filterDelay={400}
							valueTemplate={selectedWorkItemTemplate}
							itemTemplate={workItemOptionTemplate}
							className='w-full'
							pt={{
								root: {
									className:
										'outline-none focus:outline-none ring-0 focus:ring-0',
								},
								input: {
									className:
										'outline-none focus:outline-none ring-0 focus:ring-0',
								},
								trigger: {
									className:
										'outline-none focus:outline-none ring-0 focus:ring-0',
								},
							}}
						/>

						<InputText
							value={topicText}
							onChange={(e) => setTopicText(e.target.value)}
							className='w-full outline-none focus:outline-none '
							placeholder='New Work Topic'
						/>
					</div>
					<div className='flex justify-end space-x-2 pt-2'>
						<Button
							label='Cancel'
							size='small'
							severity='secondary'
							onClick={() => op.current?.hide()}
						/>
						<Button
							label='Add'
							size='small'
							onClick={() => {
								handleAddTopic(settings, { topic: topicText, color: topicColor });
							}}
						/>
					</div>
				</div>
			</OverlayPanel>
		</div>
	);
};

export default WorkFocus;
