// API Imports
import { getTasks } from '../../../api/tasks';
import { getTopics } from '../../../api/topics';
import { getWorkEntries } from '../../../api/workEntries';
// DB Utils
import { importJsonFile, downloadDataJson } from '../../../api/database';
// Component Imports
import TaskManager from '../../../components/ItemManager/taskManager';
import TopicManager from '../../../components/ItemManager/topicManager';
import WorkEntryManager from '../../../components/ItemManager/workEntryManager';
// Hook Imports
import { useSettings } from '../../../hooks/use-settings';
// Icon Imports
import { PiUpload, PiDownloadSimple } from 'react-icons/pi';
import { IconContext } from 'react-icons';
// React Imports
import { useEffect, useRef, useState } from 'react';
// Type Imports
import type { Item } from '../../../types/types';
import CloudDatabaseTile from '../../../components/CloudDatabase/cloudDatabaseTile';


// Component Defintion
const UserPage = () => {
	const settings = useSettings();
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [itemManagement, setItemManagement] = useState<Item>('Task');
	const dataFileInputRef = useRef<HTMLInputElement>(null);

	// Trigger the slide-in animation on component mount
	useEffect(() => {
		// Delay to ensure the component mounts first, then triggers animation
		const timeout = setTimeout(() => {
			setIsMounted(true);
		}, 10); // Small delay, e.g., 10ms, to ensure transition triggers

		return () => {
			clearTimeout(timeout);
			setIsMounted(false);
		};
	}, []);

	async function handleDataImportClick() {
		dataFileInputRef.current?.click();
	}

	async function handleDataImport(e: React.ChangeEvent<HTMLInputElement>) {
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

	async function handleDataDownloadClick() {
		await downloadDataJson();
	}

	return (
		<div
			className={`bg-white gap-1 flex flex-col relative p-4 w-4/5 md:w-3/5 xl:w-2/5 h-1/2 rounded-lg overflow-auto shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 duration ease-out ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
				}`}
		>
			<div className='flex flex-row w-full justify-between items-center'>
				<p className='text-2xl'>Work {itemManagement} Management</p>
			</div>
			<div className='flex flex-row justify-between'>
				<div className='flex flex-row gap-2'>
					<button
						className={`${itemManagement == 'Task' ? 'opacity-85' : 'opacity-50 hover:opacity-75'
							}`}
						onClick={() => setItemManagement('Task')}
					>
						Task
					</button>
					<button
						className={`${itemManagement == 'Topic' ? 'opacity-85' : 'opacity-50 hover:opacity-75'
							}`}
						onClick={() => setItemManagement('Topic')}
					>
						Topic
					</button>
					<button
						className={`${itemManagement == 'User' ? 'opacity-85' : 'opacity-50 hover:opacity-75'
							}`}
						onClick={() => setItemManagement('User')}
					>
						User
					</button>
				</div>
				<div className='flex gap-1'>
					{/* hidden file input */}

					<input
						type='file'
						accept='application/json'
						ref={dataFileInputRef}
						onChange={handleDataImport}
						className='hidden'
					/>
					<IconContext.Provider
						value={{
							className:
								'fill-gray-600 hover:fill-gray-400 size-5 custom-target-icon',
						}}
					>
						<PiUpload
							onClick={() => {
								handleDataImportClick();
							}}
						/>
					</IconContext.Provider>
					<IconContext.Provider
						value={{
							className:
								'fill-gray-600 hover:fill-gray-400 size-5 custom-target-icon',
						}}
					>
						<PiDownloadSimple
							onClick={() => {
								handleDataDownloadClick();
							}}
						/>
					</IconContext.Provider>
				</div>
			</div>
			{settings.useCloudDatabase && <CloudDatabaseTile />}
			<div className='h-2/3'>
				{itemManagement === 'Task' && <TaskManager />}
				{itemManagement === 'Topic' && <TopicManager />}
				{itemManagement === 'User' && <WorkEntryManager />}
			</div>
		</div>
	);
};

export default UserPage;
