// Hook Imports
import { useEffect } from 'react';
// Type Imports
import type {
	PersistedAppSettings,
	PersistedTabSettings,
} from '../types/types';

export function usePersistAppSettings(settings: PersistedAppSettings) {
	useEffect(() => {
		const timeout = setTimeout(() => {
			localStorage.setItem('app_settings', JSON.stringify(settings));
			console.log('Saved app settings');
		}, 300);

		return () => clearTimeout(timeout);
	}, [settings]);
}

export function usePersistTabSettings(settings: PersistedTabSettings) {
	useEffect(() => {
		const timeout = setTimeout(() => {
			localStorage.setItem('tab_settings', JSON.stringify(settings));
			console.log('Saved tab settings');
		}, 300);

		return () => clearTimeout(timeout);
	}, [settings]);
}
