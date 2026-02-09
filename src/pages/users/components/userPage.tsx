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
import { usePersistTabSettings } from '../../../hooks/usePersistSettings';
// React Imports
import { useEffect, useState } from 'react';

// Component Defintion
const UserPage = () => {
	const settings = useAppContext();
	const [isMounted, setIsMounted] = useState<boolean>(false);

	// Persist Settings
	usePersistTabSettings({
		lastUsedPeriodTab: settings.tabSettings.lastUsedPeriodTab,
		lastUsedStatisticsTab: settings.tabSettings.lastUsedStatisticsTab,
		lastUsedUserPageTab: settings.tabSettings.lastUsedUserPageTab,
	});

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

	return (
		<div
			className={`${
				settings.appSettings.darkMode ? 'bg-zinc-700' : 'bg-white'
			} gap-1 flex flex-col relative p-4 flex-1 short-laptop:h-75per md:max-h-[60vh] md:h-[60vh] max-h-[80vh] h-[80vh] xl:w-1/2 md:w-2/3 w-11/12 rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 ease-out ${
				isMounted
					? 'translate-y-0 opacity-100'
					: '-translate-y-full opacity-0'
			}`}
		>
			<div
				className={`flex flex-col w-full ${settings.appSettings.useCloudDatabase ? 'h-auto' : 'h-auto'}`}
			>
				<p className='w-full text-2xl'>
					{settings.tabSettings.lastUsedUserPageTab as string}{' '}
					Management
				</p>
				<div className='flex flex-row justify-between'>
					<ItemNavigationBar
						itemManagement={
							settings.tabSettings.lastUsedUserPageTab as string
						}
					/>
					<DataHandlerTile />
				</div>
				{(settings.appSettings.useCloudDatabase as boolean) && (
					<CloudDatabaseTile />
				)}
			</div>
			{settings.tabSettings.lastUsedUserPageTab !== 'Entries' ? (
				<div className='flex w-full h-auto'>
					{settings.tabSettings.lastUsedUserPageTab === 'Task' && (
						<TaskAdder />
					)}
					{settings.tabSettings.lastUsedUserPageTab === 'Topic' && (
						<TopicAdder />
					)}
				</div>
			) : null}
			<div className={`flex w-full flex-1 min-h-0`}>
				{settings.tabSettings.lastUsedUserPageTab === 'Task' && (
					<TaskViewer />
				)}
				{settings.tabSettings.lastUsedUserPageTab === 'Topic' && (
					<TopicViewer />
				)}
				{settings.tabSettings.lastUsedUserPageTab === 'Entries' && (
					<WorkEntryViewer />
				)}
			</div>
		</div>
	);
};

export default UserPage;
