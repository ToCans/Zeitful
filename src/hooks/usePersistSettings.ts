// React Imports
import { useEffect, useRef } from 'react';
// Type Imports
import type {
	PersistedAppSettings,
	PersistedTabSettings,
} from '../types/types';

export function usePersistAppSettings(settings: PersistedAppSettings) {
	const settingsRef = useRef(settings);

	// Convert object to JSON string for comparison
	const settingsJson = JSON.stringify(settings);

	useEffect(() => {
		settingsRef.current = settings;
	}, [settingsJson]); // Compare stringified version

	useEffect(() => {
		const timeout = setTimeout(() => {
			localStorage.setItem('app_settings', JSON.stringify(settings));
		}, 300);

		return () => {
			clearTimeout(timeout);
			localStorage.setItem('app_settings', JSON.stringify(settingsRef.current));
		};
	}, [settingsJson]); // Compare stringified version
}

export function usePersistTabSettings(settings: PersistedTabSettings) {
	const settingsRef = useRef(settings);

	// Convert object to JSON string for comparison
	const settingsJson = JSON.stringify(settings);

	useEffect(() => {
		settingsRef.current = settings;
	}, [settingsJson]); // Compare stringified version

	useEffect(() => {
		const timeout = setTimeout(() => {
			localStorage.setItem('tab_settings', JSON.stringify(settings));
		}, 300);

		return () => {
			clearTimeout(timeout);
			localStorage.setItem('tab_settings', JSON.stringify(settingsRef.current));
		};
	}, [settingsJson]); // Compare stringified version
}
