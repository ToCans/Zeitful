// DB Utils
import { importCloudDatabaseCredentialile } from '../../api/cloudDatabase';
// Icon Imports
import { PiArrowsClockwise, PiCloud } from 'react-icons/pi';
import { IconContext } from 'react-icons';
// Hook Imports
import { useSettings } from '../../hooks/use-settings';
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
            settings.setCloudDatabase(cloudDatabaseCredentials);
        } catch (err) {
            console.error(err);
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
                        className:
                            'fill-gray-600 hover:fill-gray-400 size-5 custom-target-icon',
                    }}
                >
                    <PiCloud
                        onClick={() => {
                            handleCloudCredentialsImportClick();
                        }}
                    />
                </IconContext.Provider>
                <IconContext.Provider
                    value={{
                        className:
                            'fill-gray-600 hover:fill-gray-400 size-5 custom-target-icon',
                    }}
                >
                    <PiArrowsClockwise />
                </IconContext.Provider>
                <p className='text-gray-500 text-xs'>Last Synced:</p>


            </div>

        </div>


    );
};

export default CloudDatabaseTile;
