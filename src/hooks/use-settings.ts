// Context Imports
import SettingsContext from '../context/settingsContext';
// React Imports
import { useContext } from 'react';
// Type Imports
import type { SettingsContextType } from '../types/context';

export const useSettings = (): SettingsContextType => {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error('useSettings must be used within a SettingsContext.Provider');
	}
	return context;
};
