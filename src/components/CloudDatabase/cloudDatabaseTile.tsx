// DB Utils
import {
	importCloudDatabaseCredentialile,
	sendToSupabaseDatabase,
	getFromSupabaseDatabase,
} from '../../api/cloudDatabase';
import { gatherDatabaseData, importDatabaseHelper } from '../../api/database';
import { getTopics } from '../../api/topics';
import { getTasks } from '../../api/tasks';
import { getWorkEntries } from '../../api/workEntries';
// Hook Imports
import { useSettings } from '../../hooks/use-settings';
// Icon Imports
import { PiArrowsClockwise, PiCloud } from 'react-icons/pi';
import { IconContext } from 'react-icons';
// Library Imports
import { createClient } from '@supabase/supabase-js';
// React Imports
import { useRef } from 'react';

// Component Definition
const CloudDatabaseTile = () => {
	const settings = useSettings();
	const credentialsInputRef = useRef<HTMLInputElement>(null);

	async function handleCloudCredentialsImportClick() {
		credentialsInputRef.current?.click();
	}

	async function handleCloudDatabaseFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const cloudDatabaseCredentials = await importCloudDatabaseCredentialile(file);
			const supabaseClient = createClient(
				cloudDatabaseCredentials['database_url'],
				cloudDatabaseCredentials['api_key']
			);
			settings.setCloudDatabase(supabaseClient);
		} catch (err) {
			console.error(err);
		}
	}

	async function handleCloudDatabaseDataSync() {
		if (settings.cloudDatabase) {
			try {
				const localData = await gatherDatabaseData();
				await sendToSupabaseDatabase(settings.cloudDatabase, localData);
				const cloudData = await getFromSupabaseDatabase(settings.cloudDatabase);
				await importDatabaseHelper(cloudData);
				settings.setLastCloudDatabaseSync(new Date().toISOString());

				settings.setWorkTopics(await getTopics());
				settings.setWorkTasks(await getTasks());
				settings.setWorkEntries(await getWorkEntries());
				console.log('Successful database sync');
			} catch (e) {
				console.log('Experience error syncing databases', e);
			}
		}
	}

	return (
		<div className='flex flex-row '>
			<div className='flex flex-row items-center gap-1'>
				<input
					type='file'
					accept='application/json'
					ref={credentialsInputRef}
					onChange={handleCloudDatabaseFileUpload}
					className='hidden'
				/>
				<IconContext.Provider
					value={{
						className: `fill-gray-600 hover:fill-gray-400 size-5 custom-target-icon ${settings.cloudDatabase === null && settings.useCloudDatabase === true
							? 'animate-bounce'
							: ''
							}`,
					}}
				>
					<PiCloud
						onClick={() => {
							handleCloudCredentialsImportClick();
						}}
					/>
				</IconContext.Provider>
				{(settings.lastCloudDatabaseSync !== null && settings.useCloudDatabase === true) ? (
					<div className='flex flex-row gap-1'>
						<IconContext.Provider
							value={{
								className:
									'fill-gray-600 hover:fill-gray-400 size-5 custom-target-icon',
							}}
						>
							<PiArrowsClockwise
								onClick={() => {
									handleCloudDatabaseDataSync();
								}}
							/>
						</IconContext.Provider>
						<p className='text-gray-500 text-xs'>Last Synced:</p>
						<p className='text-gray-500 text-xs'>{settings.lastCloudDatabaseSync}</p>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default CloudDatabaseTile;
