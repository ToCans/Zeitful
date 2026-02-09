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
	updataLocalDatabaseFromJson,
} from '../../../api/localDatabase';

// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
// Icon Imports
import { PiArrowsClockwise, PiCloud } from 'react-icons/pi';
import { IconContext } from 'react-icons';
// Library Imports
import { createClient } from '@supabase/supabase-js';
// React Imports
import { useRef, useEffect, useState, useCallback } from 'react';
// Utils Imports
import { formatDate } from '../../../utils/date';
import type {
	CloudDatabaseData,
	WorkEntry,
	WorkTask,
	WorkTopic,
	PersistedAppSettings,
} from '../../../types/types';

// Component Definition
const CloudDatabaseTile = () => {
	const settings = useAppContext();
	const credentialsInputRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function handleCloudCredentialsImportClick() {
		credentialsInputRef.current?.click();
	}

	async function handleCloudDatabaseFileUpload(
		e: React.ChangeEvent<HTMLInputElement>,
	) {
		try {
			const file = e.target.files?.[0];
			if (!file) {
				console.log('Error: Cloud Credentials File not found.');
				return;
			}
			const credentialResponse =
				await importCloudDatabaseCredentials(file);
			if (credentialResponse.status == 'Failure') {
				settings.toast?.show({
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
				settings.setCloudDatabase(supabaseClient);
			}
		} catch (err) {
			settings.toast?.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Incorrect credentials provided.',
				life: 3000,
			});
			console.error(err);
		}
	}

	const handleCloudDatabaseDataSync = useCallback(async () => {
		if (!settings.cloudDatabase) return;

		try {
			setIsLoading(true);

			// Syncing Mechanism
			const localData = await getLocalDatabaseData();

			// Sync local data to Supabase
			const syncResponse = await syncLocalDataToSupabaseDatabase(
				settings.cloudDatabase,
				localData,
			);
			console.log(syncResponse.status, syncResponse.message);

			// Get latest data from Supabase
			const response = await getDataFromSupabaseDatabase(
				settings.cloudDatabase,
			);

			if (response.status === 'Success' && response.item) {
				await updataLocalDatabaseFromJson(
					response.item as CloudDatabaseData,
				);

				settings.setAppSettings((prev: PersistedAppSettings) => ({
					...prev,
					lastCloudDatabaseSync: new Date().toISOString(),
				}));

				// Refresh state
				settings.setWorkTopics((await getTopics()).item as WorkTopic[]);
				settings.setWorkTasks((await getTasks()).item as WorkTask[]);
				settings.setWorkEntries(
					(await getWorkEntries()).item as WorkEntry[],
				);

				console.log('Successful database sync');
			}
			if (response.status == 'Failure') {
				settings.toast?.show({
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
		}
	}, [settings, setIsLoading]);

	useEffect(() => {
		if (
			settings.appSettings.useCloudDatabase === true &&
			settings.cloudDatabase !== null &&
			!settings.hasSyncedRef.current
		) {
			handleCloudDatabaseDataSync();
			settings.hasSyncedRef.current = true; // mark as synced
		}
	}, [
		handleCloudDatabaseDataSync,
		settings.hasSyncedRef,
		settings.cloudDatabase,
		settings.appSettings.useCloudDatabase,
	]);

	return (
		<div className='flex flex-row items-center gap-1 p-1'>
			<input
				type='file'
				accept='application/json'
				ref={credentialsInputRef}
				onChange={handleCloudDatabaseFileUpload}
				className='hidden'
			/>
			<IconContext.Provider
				value={{
					className: `${
						settings.appSettings.darkMode
							? 'fill-gray-200 hover:fill-gray-400'
							: 'fill-gray-600 hover:fill-gray-400'
					} size-5 custom-target-icon ${
						settings.cloudDatabase === null &&
						settings.appSettings.useCloudDatabase === true
							? 'animate-bounce'
							: ''
					}`,
				}}
			>
				<PiCloud
					onClick={async () => {
						await handleCloudCredentialsImportClick();
					}}
				/>
			</IconContext.Provider>
			<div className='flex flex-row space-x-1 items-center'></div>
			{settings.appSettings.useCloudDatabase === true &&
			settings.cloudDatabase !== null ? (
				<IconContext.Provider
					value={{
						className: `${
							settings.appSettings.darkMode
								? 'fill-gray-200 hover:fill-gray-400'
								: 'fill-gray-600 hover:fill-gray-400'
						} size-5 custom-target-icon`,
					}}
				>
					<PiArrowsClockwise
						className={isLoading ? 'animate-spin' : ''}
						onClick={() => {
							handleCloudDatabaseDataSync();
						}}
					/>
				</IconContext.Provider>
			) : null}
			{settings.appSettings.lastCloudDatabaseSync !== 'None' &&
			settings.appSettings.useCloudDatabase === true ? (
				<div className='flex flex-row space-x-1'>
					<p className='text-xs'>Last Synced:</p>
					<p className='text-xs'>
						{
							formatDate(
								settings.appSettings.lastCloudDatabaseSync,
							).date
						}
					</p>
					<p className='text-xs'>
						@{' '}
						{
							formatDate(
								settings.appSettings.lastCloudDatabaseSync,
							).time
						}
					</p>
				</div>
			) : null}
		</div>
	);
};

export default CloudDatabaseTile;
