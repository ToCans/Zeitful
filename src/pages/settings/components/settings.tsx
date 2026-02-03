// Component Imports
import { ColorPicker } from 'primereact/colorpicker';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import SettingsTimeTile from './settingsTimeTile';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
import { usePersistSettings } from '../../../hooks/usePersistSettings';
// React Imports
import { useEffect, useState } from 'react';
// Utils Imports
import { formatTime } from '../../../utils/time';

// Component Definition
const Settings = () => {
	const settings = useAppContext();
	const [isMounted, setIsMounted] = useState(false);

	const handleTabCheckboxChange = () => {
		settings.setTabTimer(!settings.showTabTimer);
	};

	const handleCloudCheckboxChange = () => {
		settings.setUseCloudDatabase(!settings.useCloudDatabase);
	};

	// Trigger the slide-in animation on component mount
	useEffect(() => {
		// Delay to ensure the component mounts first, then triggers animation
		const timeout = setTimeout(() => {
			setIsMounted(true);
		}, 10); // Small delay, e.g., 10ms, to ensure transition triggers

		return () => {
			clearTimeout(timeout);
			setIsMounted(false);
		};
	}, []);

	// Handling for when the user changes any of the settings
	usePersistSettings({
		lastCloudDatabaseSync: settings.lastCloudDatabaseSync,
		useCloudDatabase: settings.useCloudDatabase,
		showTabTimer: settings.showTabTimer,
		workingTime: settings.workingTime,
		shortBreakTime: settings.shortBreakTime,
		longBreakTime: settings.longBreakTime,
		timerColor: settings.timerColor,
		darkMode: settings.darkMode,
	});

	// For Showing Timer in Tab Info
	useEffect(() => {
		let timeRemaining;
		if (settings.showTabTimer === true) {
			if (settings.cycleNumber % 8 === 0) {
				timeRemaining = settings.longBreakTime;
			} else if (settings.cycleNumber % 2 === 0) {
				timeRemaining = settings.shortBreakTime;
			} else {
				timeRemaining = settings.workingTime;
			}
			document.title = `${formatTime(timeRemaining)} - Zeitful`;
		} else {
			document.title = 'Zeitful';
		}
	}, [settings, settings.showTabTimer]);

	return (
		<div
			className={`${settings.darkMode ? 'bg-zinc-700' : 'bg-white'
				} flex flex-col p-4 short-laptop:h-4/5 md:max-h-[66vh] md:h-[66vh] max-h-[80vh] h-[80vh] xl:w-1/2 md:w-2/3 w-11/12 rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 duration ease-out ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
				}`}
		>
			<h1 className='flex text-2xl select-none'>User Settings</h1>
			<div className='flex flex-col items-center justify-center space-y-2 flex-1'>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center w-full'>
					<p className='select-none text-md'>Timer Color</p>
					<ColorPicker
						className='outline-none focus:outline-none ring-0 focus:ring-0 focus:shadow-none'
						inputClassName='h-5 w-5'
						onChange={(e) => settings.setTimerColor(e.value as string)}
						defaultColor={`#${settings.timerColor}`}
					/>
				</div>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center w-full'>
					<p className='select-none text-md'>Dark Mode</p>
					<InputSwitch
						checked={settings.darkMode}
						onChange={(e) => settings.setDarkMode(e.value)}
					/>
				</div>
				<SettingsTimeTile
					label='Working Minutes'
					value={settings.workingTime}
					setter={settings.setWorkingTime}
				/>
				<SettingsTimeTile
					label='Short Break Minutes'
					value={settings.shortBreakTime}
					setter={settings.setShortBreakTime}
				/>
				<SettingsTimeTile
					label='Long Break Minutes'
					value={settings.longBreakTime}
					setter={settings.setLongBreakTime}
				/>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center w-full'>
					<p className='text-center align-middle select-none'>Show Timer in Tab</p>
					<Checkbox checked={settings.showTabTimer} onChange={handleTabCheckboxChange} />
				</div>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center w-full'>
					<p className='text-center align-middle select-none'>Use Cloud Database</p>
					<Checkbox
						checked={settings.useCloudDatabase}
						onChange={handleCloudCheckboxChange}
					/>
				</div>
			</div>
		</div>
	);
};

export default Settings;
