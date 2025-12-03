// DB Utils
import {
	importCloudDatabaseCredentials,
	syncLocalDataToSupabaseDatabase,
	getDataFromSupabaseDatabase,
} from '../../api/cloudDatabase';
import { getTasks, getTopics, getLocalDatabaseData, getWorkEntries, updataLocalDatabaseFromJson } from '../../api/localDatabase';

// Hook Imports
import { useAppContext } from '../../hooks/useAppContext';
// Icon Imports
import { PiArrowsClockwise, PiCloud } from 'react-icons/pi';
import { IconContext } from 'react-icons';
// Library Imports
import { createClient } from '@supabase/supabase-js';
// React Imports
import { useRef, useEffect } from 'react';
// Utils Imports
import { formatDate } from '../../utils/date';
import type { CloudDatabaseData, WorkEntry, WorkTask, WorkTopic } from '../../types/types';

// Component Definition
const CloudDatabaseTile = () => {
	const settings = useAppContext();
	const credentialsInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (settings.useCloudDatabase === true && settings.cloudDatabase !== null) {
			handleCloudDatabaseDataSync();
		}
	}, [settings.cloudDatabase, settings.useCloudDatabase]);

	async function handleCloudCredentialsImportClick() {
		credentialsInputRef.current?.click();
	}

	async function handleCloudDatabaseFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		try {
			const file = e.target.files?.[0];
			if (!file) {
				console.log("Error: Cloud Credentials File not found.");
				return;
			}
			const response = await importCloudDatabaseCredentials(file);
			console.log(response.status, response.message);
			const supabaseClient = createClient(
				response.cloudCredentials['database_url'],
				response.cloudCredentials['api_key']
			);
			settings.setCloudDatabase(supabaseClient);
		} catch (err) {
			console.error(err);
		}
	}

	async function handleCloudDatabaseDataSync() {
		if (settings.cloudDatabase) {
			try {
				// Syncing Mechanism
				const localData = await getLocalDatabaseData();
				// Syncing Local Data to the supabase (adding/updating missing entries)
				const syncReponse = await syncLocalDataToSupabaseDatabase(settings.cloudDatabase, localData);
				console.log(syncReponse.status, syncReponse.message);

				// Getting the most recent data from supabase
				const response = await getDataFromSupabaseDatabase(settings.cloudDatabase);
				if (response.status === "Success" && response.item) {
					await updataLocalDatabaseFromJson(response.item as CloudDatabaseData);
					settings.setLastCloudDatabaseSync(new Date().toISOString());

					// Setting All Items
					settings.setWorkTopics((await getTopics()).item as WorkTopic[]);
					settings.setWorkTasks((await getTasks()).item as WorkTask[]);
					settings.setWorkEntries((await getWorkEntries()).item as WorkEntry[]);
					console.log('Successful database sync');

				}

			} catch (e) {
				console.log('Experience error syncing databases', e);
			}
		}
	}

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
					className: `${settings.darkMode
						? 'fill-gray-200 hover:fill-gray-400'
						: 'fill-gray-600 hover:fill-gray-400'
						} size-5 custom-target-icon ${settings.cloudDatabase === null && settings.useCloudDatabase === true
							? 'animate-bounce'
							: ''
						}`,
				}}
			>
				<PiCloud
					onClick={async () => {
						await handleCloudCredentialsImportClick();
						await handleCloudDatabaseDataSync();
					}}
				/>
			</IconContext.Provider>
			<div className='flex flex-row space-x-1 items-center'></div>
			{settings.useCloudDatabase === true && settings.cloudDatabase !== null ? (
				<IconContext.Provider
					value={{
						className: `${settings.darkMode
							? 'fill-gray-200 hover:fill-gray-400'
							: 'fill-gray-600 hover:fill-gray-400'
							} size-5 custom-target-icon`,
					}}
				>
					<PiArrowsClockwise
						onClick={() => {
							handleCloudDatabaseDataSync();
						}}
					/>
				</IconContext.Provider>
			) : null}
			{settings.lastCloudDatabaseSync !== 'None' && settings.useCloudDatabase === true ? (
				<div className='flex flex-row space-x-1'>
					<p className='text-xs'>Last Synced:</p>
					<p className='text-xs'>{formatDate(settings.lastCloudDatabaseSync).date}</p>
					<p className='text-xs'>@ {formatDate(settings.lastCloudDatabaseSync).time}</p>
				</div>
			) : null}
		</div>
	);
};

export default CloudDatabaseTile;
