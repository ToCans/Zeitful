// DB Utils
import {
	importCloudDatabaseCredentials,
	syncLocalDataToSupabaseDatabase,
	getDataFromSupabaseDatabase,
} from '../../../api/cloudDatabase';
import {
	getTasks,
	getTopics,
	getLocalDatabaseData,
	getWorkEntries,
	updateLocalDatabaseFromJson,
} from '../../../api/localDatabase';
// Icon Imports
import { PiArrowsClockwise, PiCloud } from 'react-icons/pi';
import { IconContext } from 'react-icons';
// Library Imports
import { createClient } from '@supabase/supabase-js';
// React Imports
import { useRef, useEffect, useState, useCallback } from 'react';
// Store Imports
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { useDataStore } from '../../../stores/useDataStore';
import { useCloudStore } from '../../../stores/useCloudStore';
import { useRefsStore } from '../../../stores/useRefsStore';
// Utils Imports
import { formatDate } from '../../../utils/date';
// Type Imports
import type {
	CloudDatabaseData,
	WorkEntry,
	WorkTask,
	WorkTopic,
} from '../../../types/types';

// Component Definition
const CloudDatabaseTile = () => {
	const darkMode = useSettingsStore((state) => state.appSettings.darkMode);
	const useCloudDatabase = useSettingsStore((state) => state.appSettings.useCloudDatabase);
	const lastCloudDatabaseSync = useSettingsStore((state) => state.appSettings.lastCloudDatabaseSync);
	const setAppSettings = useSettingsStore((state) => state.setAppSettings);

	const setWorkTopics = useDataStore((state) => state.setWorkTopics);
	const setWorkTasks = useDataStore((state) => state.setWorkTasks);
	const setWorkEntries = useDataStore((state) => state.setWorkEntries);

	const cloudDatabase = useCloudStore((state) => state.cloudDatabase);
	const setCloudDatabase = useCloudStore((state) => state.setCloudDatabase);
	const hasSynced = useCloudStore((state) => state.hasSynced);
	const setHasSynced = useCloudStore((state) => state.setHasSynced);
	const isSyncingRef = useRef(false);

	const toast = useRefsStore((state) => state.toast);

	const credentialsInputRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleCloudCredentialsImportClick = () => {
		credentialsInputRef.current?.click();
	};

	const handleCloudDatabaseFileUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		try {
			const file = e.target.files?.[0];
			if (!file) {
				console.log('Error: Cloud Credentials File not found.');
				return;
			}

			const credentialResponse = await importCloudDatabaseCredentials(file);

			if (credentialResponse.status === 'Failure') {
				toast?.show({
					severity: 'error',
					summary: credentialResponse.status,
					detail: credentialResponse.message,
					life: 3000,
				});
			} else {
				const supabaseClient = createClient(
					credentialResponse.cloudCredentials['database_url'],
					credentialResponse.cloudCredentials['api_key'],
					{
						auth: {
							persistSession: false,
							autoRefreshToken: false,
							detectSessionInUrl: false,
						},
					},
				);
				setCloudDatabase(supabaseClient);
			}
		} catch (err) {
			toast?.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Incorrect credentials provided.',
				life: 3000,
			});
			console.error(err);
		}
	};

	const handleCloudDatabaseDataSync = useCallback(async () => {
		if (!cloudDatabase) return;

		// Prevent concurrent syncs
		if (isSyncingRef.current) {
			console.log('Sync already in progress, skipping...');
			return;
		}

		isSyncingRef.current = true;

		try {
			setIsLoading(true);

			// Syncing Mechanism
			const localData = await getLocalDatabaseData();

			// Sync local data to Supabase
			const syncResponse = await syncLocalDataToSupabaseDatabase(
				cloudDatabase,
				localData,
			);
			console.log(syncResponse.status, syncResponse.message);

			// Get latest data from Supabase
			const response = await getDataFromSupabaseDatabase(cloudDatabase);

			if (response.status === 'Success' && response.item) {
				await updateLocalDatabaseFromJson(
					response.item as CloudDatabaseData,
				);

				setAppSettings((prev) => ({
					...prev,
					lastCloudDatabaseSync: new Date().toISOString(),
				}));

				// Refresh state
				const [topics, tasks, entries] = await Promise.all([
					getTopics(),
					getTasks(),
					getWorkEntries(),
				]);

				if (topics.item) setWorkTopics(topics.item as WorkTopic[]);
				if (tasks.item) setWorkTasks(tasks.item as WorkTask[]);
				if (entries.item) setWorkEntries(entries.item as WorkEntry[]);

				console.log('Successful database sync');
			}

			if (response.status === 'Failure') {
				toast?.show({
					severity: 'error',
					summary: response.status,
					detail: response.message,
					life: 3000,
				});
			}
		} catch (e) {
			console.log('Experienced error syncing databases', e);
		} finally {
			setIsLoading(false);
			isSyncingRef.current = false;
		}
	}, [cloudDatabase, setAppSettings, setWorkTopics, setWorkTasks, setWorkEntries, toast]);

	useEffect(() => {
		if (useCloudDatabase && cloudDatabase !== null && !hasSynced) {
			handleCloudDatabaseDataSync();
			setHasSynced(true);
		}
	}, [handleCloudDatabaseDataSync, cloudDatabase, useCloudDatabase, hasSynced, setHasSynced]);

	const getIconClassName = (bounce: boolean = false) =>
		`${darkMode ? 'fill-gray-200 hover:fill-gray-400' : 'fill-gray-600 hover:fill-gray-400'} size-5 custom-target-icon cursor-pointer ${bounce ? 'animate-bounce' : ''
		}`;

	const shouldShowSyncButton = useCloudDatabase && cloudDatabase !== null;
	const shouldShowLastSync = lastCloudDatabaseSync !== 'None' && useCloudDatabase;
	const shouldBounce = cloudDatabase === null && useCloudDatabase;

	return (
		<div className='flex flex-row items-center gap-1 p-1'>
			<input
				type='file'
				accept='application/json'
				ref={credentialsInputRef}
				onChange={handleCloudDatabaseFileUpload}
				className='hidden'
			/>

			<IconContext.Provider value={{ className: getIconClassName(shouldBounce) }}>
				<PiCloud
					className={isLoading ? 'opacity-50 pointer-events-none' : ''}
					onClick={handleCloudCredentialsImportClick} />
			</IconContext.Provider>

			{shouldShowSyncButton && (
				<IconContext.Provider value={{ className: getIconClassName() }}>
					<PiArrowsClockwise
						className={isLoading ? 'animate-spin opacity-50 pointer-events-none' : ''}
						onClick={() => {
							if (!isLoading) handleCloudDatabaseDataSync();
						}}
					/>
				</IconContext.Provider>
			)}

			{shouldShowLastSync && (
				<div className='flex flex-row space-x-1'>
					<p className='text-xs'>Last Synced:</p>
					<p className='text-xs'>{formatDate(lastCloudDatabaseSync).date}</p>
					<p className='text-xs'>@ {formatDate(lastCloudDatabaseSync).time}</p>
				</div>
			)}
		</div>
	);
};

export default CloudDatabaseTile;