// Component Imports
import DataHandlerTile from './dataHandlerTile';
import ItemNavigationBar from './itemNavigationBar';
import TaskAdder from '../../../components/ItemManager/taskAdder';
import TaskViewer from '../../../components/ItemManager/taskViewer';
import TopicAdder from '../../../components/ItemManager/topicAdder';
import TopicViewer from '../../../components/ItemManager/topicViewer';
import CloudDatabaseTile from './cloudDatabaseTile';
import WorkEntryViewer from '../../../components/ItemManager/workEntryViewer';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
import { usePersistSettings } from '../../../hooks/usePersistSettings';
// React Imports
import { useEffect, useState } from 'react';
// Type Imports
import type { Item } from '../../../types/types';


// Component Defintion
const UserPage = () => {
	const settings = useAppContext();
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [itemManagement, setItemManagement] = useState<Item>('Task');

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

	usePersistSettings({
		lastCloudDatabaseSync: settings.lastCloudDatabaseSync,
		useCloudDatabase: settings.useCloudDatabase,
		showTabTimer: settings.showTabTimer,
		workingTime: settings.workingTime,
		shortBreakTime: settings.shortBreakTime,
		longBreakTime: settings.longBreakTime,
		timerColor: settings.timerColor,
		darkMode: settings.darkMode,
	});

	return (
		<div
			className={`${settings.darkMode ? 'bg-zinc-700' : 'bg-white'
				} gap-1 flex flex-col relative p-4 3xl:w-1/3 xl:w-2/5 lg:w-3/5 md:w-4/5 w-11/12 md:h-[50vh] h-[70vh] rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 ease-out ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
				}`}
		>
			<div className={`flex flex-col w-full ${settings.useCloudDatabase ? 'h-20' : 'h-14'}`}>
				<p className='w-full text-2xl'>{itemManagement} Management</p>
				<div className='flex flex-row justify-between'>
					<ItemNavigationBar
						itemManagement={itemManagement}
						setItemManagement={setItemManagement}
					/>
					<DataHandlerTile />
				</div>
				{settings.useCloudDatabase && <CloudDatabaseTile />}
			</div>
			{itemManagement !== 'Entries' ? (
				<div className='flex w-full h-14'>
					{itemManagement === 'Task' && <TaskAdder />}
					{itemManagement === 'Topic' && <TopicAdder />}
				</div>
			) : null}
			<div className={`flex w-full flex-1 min-h-0`}>
				{itemManagement === 'Task' && <TaskViewer />}
				{itemManagement === 'Topic' && <TopicViewer />}
				{itemManagement === 'Entries' && <WorkEntryViewer />}
			</div>
		</div>
	);
};

export default UserPage;
