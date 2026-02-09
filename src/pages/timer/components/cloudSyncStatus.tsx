// Icon Imports
import { IconContext } from 'react-icons';
import { PiCloudSlash, PiCloudCheck } from 'react-icons/pi';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';

const CloudSyncStatusTile = () => {
	// Settings Context
	const settings = useAppContext();
	if (settings.appSettings.useCloudDatabase && !settings.cloudDatabase) {
		return (
			<IconContext.Provider
				value={{
					className: `${
						settings.appSettings.darkMode
							? 'fill-gray-200'
							: 'fill-gray-600'
					} size-6 custom-target-icon`,
				}}
			>
				<PiCloudSlash />
			</IconContext.Provider>
		);
	} else {
		return (
			<IconContext.Provider
				value={{
					className: `${
						settings.appSettings.darkMode
							? 'fill-gray-200'
							: 'fill-gray-600'
					} size-6 custom-target-icon`,
				}}
			>
				<PiCloudCheck />
			</IconContext.Provider>
		);
	}
};

export default CloudSyncStatusTile;
