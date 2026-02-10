// Hook Imports
import { useAppContext } from '../../hooks/useAppContext';
// React Imports
import { useEffect, useState } from 'react';
// Type Imports
import type { Page } from '../../types/types';

interface ConfirmationModalProps {
    timerWorker: React.RefObject<Worker | null>;
    togglePage: (targetPage: Page) => void;
    setTimerRunning: (timerRunning: boolean) => void;
    setShowConfirm: (showConfirm: boolean) => void;
    sendTimerWorkerMessage: (message: {
        timerWorker: Worker | null;
        runningBoolean: boolean;
        timeRemaining: number | null;
    }) => void;
}

// Component Definition
const ConfirmationModal = ({ timerWorker, togglePage, setTimerRunning, setShowConfirm, sendTimerWorkerMessage }: ConfirmationModalProps) => {
    const settings = useAppContext();
    const [isMounted, setIsMounted] = useState(false);

    // Animate on mount
    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 10);
        return () => clearTimeout(timeout);
    }, []);

    // Handle fade out then close
    const handleClose = (callback?: () => void) => {
        setIsMounted(false);
        setTimeout(() => {
            if (callback) callback();
            setShowConfirm(false);
        }, 300); // Match transition duration
    };

    // Confirm Settings Navigation
    const confirmSettingsNavigation = () => {
        handleClose(() => {
            togglePage('Settings');
            setTimerRunning(false);
            sendTimerWorkerMessage({
                timerWorker: timerWorker.current,
                runningBoolean: false,
                timeRemaining: null,
            });
        });
    };

    // Cancel Settings Navigation
    const cancelSettingsNavigation = () => {
        handleClose();
    };

    return (
        <div className={`fixed inset-0 ${settings.appSettings.darkMode ? "bg-zinc-800" : "bg-zinc-500"} bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-out ${isMounted ? 'opacity-100' : 'opacity-0'
            }`}>
            <div className={`${settings.appSettings.darkMode ? "bg-zinc-700" : "bg-white"} rounded-lg p-6 max-w-sm mx-4 shadow-xl transition-all duration-300 ${isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                <h3 className={`${settings.appSettings.darkMode ? "text-zinc-100" : "text-zinc-700"} text-lg font-semibold mb-2`}>Switch to Settings?</h3>
                <p className={`${settings.appSettings.darkMode ? "text-zinc-100" : "text-zinc-700"} mb-6`}>
                    This will reset and stop the current timer. Do you want to continue?
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={cancelSettingsNavigation}
                        className={`px-4 py-2 rounded ${settings.appSettings.darkMode ? "bg-zinc-500 hover:bg-zinc-600" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmSettingsNavigation}
                        className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;