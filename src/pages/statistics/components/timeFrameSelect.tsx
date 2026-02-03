// Component Imports
import { Button } from 'primereact/button';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
import { usePersistSettings } from '../../../hooks/usePersistSettings';
// Type Imports
import type { Dispatch } from 'react';

interface timeFrameSelectionProps {
    timeFrame: 'W' | 'M' | 'Y' | string;
    setTimeFrame: Dispatch<React.SetStateAction<'W' | 'M' | 'Y' | string>>;
}

const TimeFrameSelection = ({ timeFrame, setTimeFrame }: timeFrameSelectionProps) => {
    // Settings Context
    const settings = useAppContext();

    usePersistSettings({
        lastCloudDatabaseSync: settings.lastCloudDatabaseSync,
        useCloudDatabase: settings.useCloudDatabase,
        showTabTimer: settings.showTabTimer,
        workingTime: settings.workingTime,
        shortBreakTime: settings.shortBreakTime,
        longBreakTime: settings.longBreakTime,
        timerColor: settings.timerColor,
        darkMode: settings.darkMode,
        lastUsedPeriodTab: settings.lastUsedPeriodTab,
        lastUsedItemTab: settings.lastUsedItemTab,
    });

    return (<div className='flex flex-row justify-between w-full'>
        <p className='text-2xl font-normal'>
            {timeFrame === 'W'
                ? 'Weekly Stats'
                : timeFrame === 'M'
                    ? 'Monthly Stats'
                    : 'Yearly Stats'}
        </p>
        <div className='flex flex-row gap-2'>
            <Button
                className={`${timeFrame === 'W' ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                    }`}
                unstyled
                onClick={() => setTimeFrame('W')}
            >
                W
            </Button>
            <Button
                className={`${timeFrame === 'M' ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                    }`}
                unstyled
                onClick={() => setTimeFrame('M')}
            >
                M
            </Button>
            <Button
                className={`${timeFrame === 'Y' ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                    }`}
                unstyled
                onClick={() => setTimeFrame('Y')}
            >
                Y
            </Button>
        </div>
    </div>);

};

export default TimeFrameSelection;