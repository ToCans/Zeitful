// API Imports
import { getTasks } from '../../api/tasks';
import { getTopics } from '../../api/topics';
import { getWorkEntries } from '../../api/workEntries';
// DB Utils
import { importJsonFile, downloadJson } from '../../api/database';
// Component Imports
import WorkEntryTile from './workEntryTile';
// Icon Imports
import { PiDownloadSimple, PiExport } from 'react-icons/pi';
import { IconContext } from 'react-icons';
// React Imports
import { useRef } from 'react';
// Utils Imports
import { useSettings } from '../../hooks/use-settings';

// Component Definition
const WorkEntryManager = () => {
	const settings = useSettings();
	const fileInputRef = useRef<HTMLInputElement>(null);

	async function handleImportClick() {
		fileInputRef.current?.click();
	}

	async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			await importJsonFile(file);
			settings.setWorkTopics(await getTopics());
			settings.setWorkTasks(await getTasks());
			settings.setWorkEntries(await getWorkEntries());
		} catch (err) {
			console.error(err);
		}
	}

	async function handleExportClick() {
		await downloadJson();
	}

	return (
		<div className='flex flex-col flex-1'>
			<div className='flex items-center justify-between mt-4'>
				<h2 className='font-semibold'>Work Entries</h2>
				<div className='flex gap-1'>
					{/* hidden file input */}
					<input
						type='file'
						accept='application/json'
						ref={fileInputRef}
						onChange={handleFileUpload}
						className='hidden'
					/>
					<IconContext.Provider
						value={{
							className:
								'fill-gray-600 hover:fill-gray-400 size-5 custom-target-icon',
						}}
					>
						<PiDownloadSimple
							onClick={() => {
								handleImportClick();
							}}
						/>
					</IconContext.Provider>
					<IconContext.Provider
						value={{
							className:
								'fill-gray-600 hover:fill-gray-400 size-5 custom-target-icon',
						}}
					>
						<PiExport
							onClick={() => {
								handleExportClick();
							}}
						/>
					</IconContext.Provider>
				</div>
			</div>
			<div className='overflow-y-scroll mt-2'>
				{settings.workEntries.map((workEntry) => (
					<WorkEntryTile
						key={workEntry.id}
						workEntry={workEntry}
						workTasks={settings.workTasks}
						workTopics={settings.workTopics}
					/>
				))}
			</div>
		</div>
	);
};

export default WorkEntryManager;
