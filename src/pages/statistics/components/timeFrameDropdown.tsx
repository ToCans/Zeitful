// Component Imports
import { Dropdown } from 'primereact/dropdown';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
// Type Imports
import type { Dispatch } from 'react';

// Interface Definition
interface TimeFrameDropdownProps {
	selectedPeriod: any;
	periodOptions: any[];
	timeFrame: 'W' | 'M' | 'Y';
	setSelectedPeriod: Dispatch<React.SetStateAction<any>>;
}

// Component Defintion
const TimeFrameDropdown = ({
	selectedPeriod,
	periodOptions,
	timeFrame,
	setSelectedPeriod,
}: TimeFrameDropdownProps) => {
	const settings = useAppContext();

	return (
		<Dropdown
			value={selectedPeriod}
			options={periodOptions}
			onChange={(e) => setSelectedPeriod(e.value)}
			placeholder={`Select ${
				timeFrame === 'W'
					? 'week'
					: timeFrame === 'M'
					? 'month'
					: 'year'
			}`}
			className={`w-full ${
				settings.darkMode ? 'dark-dropdown' : 'light-dropdown'
			}`}
			style={{
				backgroundColor: settings.darkMode ? '#52525B' : '#ffffff',
				borderColor: settings.darkMode ? '#6b7280' : '#d1d5db',
			}}
			panelClassName={
				settings.darkMode
					? 'dark-dropdown-panel'
					: 'light-dropdown-panel'
			}
			panelStyle={{
				backgroundColor: settings.darkMode ? '#52525B' : '#ffffff',
			}}
		/>
	);
};

export default TimeFrameDropdown;
