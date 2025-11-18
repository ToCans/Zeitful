// Hook Imports
import { useEffect } from 'react';
// Type Imports
import type { PersistedSettings } from '../types/types';

export function usePersistSettings(settings: PersistedSettings) {
	useEffect(() => {
		console.log('Saving settings to local storage');

		Object.entries(settings).forEach(([key, value]) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}, [settings]); // single dependency!
}
