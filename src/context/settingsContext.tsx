import React from 'react';
import type { SettingsContextType } from '../types/context';

const SettingsContext = React.createContext<SettingsContextType | null>(null);

export default SettingsContext;
