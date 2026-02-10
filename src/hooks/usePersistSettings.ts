// React Imports
import { useEffect, useRef } from 'react';
// Type Imports
import type {
	PersistedAppSettings,
	PersistedTabSettings,
} from '../types/types';

export function usePersistAppSettings(settings: PersistedAppSettings) {
	const settingsRef = useRef(settings);

	useEffect(() => {
		settingsRef.current = settings;
	}, [settings]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			localStorage.setItem('app_settings', JSON.stringify(settings));
			console.log('Saved app settings');
		}, 300);

		return () => {
			clearTimeout(timeout);
			// Save immediately on unmount with latest settings
			localStorage.setItem('app_settings', JSON.stringify(settingsRef.current));
		};
	}, [settings]);
}

export function usePersistTabSettings(settings: PersistedTabSettings) {
	const settingsRef = useRef(settings);

	useEffect(() => {
		settingsRef.current = settings;
	}, [settings]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			localStorage.setItem('tab_settings', JSON.stringify(settings));
			console.log('Saved tab settings');
		}, 300);

		return () => {
			clearTimeout(timeout);
			// Save immediately on unmount with latest settings
			localStorage.setItem('tab_settings', JSON.stringify(settingsRef.current));
		};
	}, [settings]);
}
