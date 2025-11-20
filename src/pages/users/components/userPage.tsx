// Component Imports
import DataHandlerTile from './dataHandlerTile';
import ItemNavigationBar from './itemNavigationBar';
import TaskManager from '../../../components/ItemManager/taskManager';
import TopicManager from '../../../components/ItemManager/topicManager';
import WorkEntryManager from '../../../components/ItemManager/workEntryManager';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
import { usePersistSettings } from '../../../hooks/usePersistSettings';
// React Imports
import { useEffect, useState } from 'react';
// Type Imports
import type { Item } from '../../../types/types';
import CloudDatabaseTile from '../../../components/CloudDatabase/cloudDatabaseTile';

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
			className={`${
				settings.darkMode ? 'bg-zinc-700' : 'bg-white'
			} gap-1 flex flex-col relative p-4 3xl:w-1/3 xl:w-2/5 lg:w-3/5 md:w-4/5 w-11/12 md:h-[50vh] h-[70vh] rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 ease-out ${
				isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
			}`}
		>
			<p className='w-full text-2xl'>Work {itemManagement} Management</p>
			<div className='flex flex-row justify-between'>
				<ItemNavigationBar
					itemManagement={itemManagement}
					setItemManagement={setItemManagement}
				/>
				<DataHandlerTile />
			</div>

			{settings.useCloudDatabase && <CloudDatabaseTile />}
			{itemManagement === 'Task' && <TaskManager />}
			{itemManagement === 'Topic' && <TopicManager />}
			{itemManagement === 'User' && <WorkEntryManager />}
		</div>
	);
};

export default UserPage;
