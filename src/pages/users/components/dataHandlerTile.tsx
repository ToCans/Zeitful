// API Imports
import { getTopics } from '../../../api/topics';
import { getWorkEntries } from '../../../api/workEntries';
// DB Utils
import { getTasks, importDatabaseDataHelper, downloadDataJson } from '../../../api/localDatabase';
// Icon Imports
import { PiUpload, PiDownloadSimple } from 'react-icons/pi';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
import { IconContext } from 'react-icons';
// React Imports
import { useRef } from 'react';
import type { WorkTask } from '../../../types/types';

// Component Defintion
const DataHandlerTile = () => {
	const settings = useAppContext();
	const dataFileInputRef = useRef<HTMLInputElement>(null);

	async function handleDataImportClick() {
		dataFileInputRef.current?.click();
	}

	async function handleDataImport(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];

		if (!file) return;
		try {
			await importDatabaseDataHelper(file);
			settings.setWorkTopics(await getTopics());
			settings.setWorkTasks((await getTasks()).item as WorkTask[]);
			settings.setWorkEntries(await getWorkEntries());
		} catch (err) {
			console.error(err);
		}
	}

	async function handleDataDownloadClick() {
		await downloadDataJson();
	}
	return (
		<div className='flex gap-1'>
			<input
				type='file'
				accept='application/json'
				ref={dataFileInputRef}
				onChange={handleDataImport}
				className='hidden'
			/>
			<IconContext.Provider
				value={{
					className: `${settings.darkMode
						? 'fill-gray-200 hover:fill-gray-400'
						: 'fill-gray-600 hover:fill-gray-400'
						} size-5 custom-target-icon`,
				}}
			>
				<PiUpload onClick={handleDataImportClick} />
			</IconContext.Provider>
			<IconContext.Provider
				value={{
					className: `${settings.darkMode
						? 'fill-gray-200 hover:fill-gray-400'
						: 'fill-gray-600 hover:fill-gray-400'
						} size-5 custom-target-icon`,
				}}
			>
				<PiDownloadSimple onClick={handleDataDownloadClick} />
			</IconContext.Provider>
		</div>
	);
};

export default DataHandlerTile;
