import { useContext } from 'react';
import SettingsContext from '../context/settingsContext'; // adjust path to where your context is defined
import type { SettingsContextType } from '../types/context'; // if you're using a type

export const useSettings = (): SettingsContextType => {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error('useSettings must be used within a SettingsContext.Provider');
	}
	return context;
};
