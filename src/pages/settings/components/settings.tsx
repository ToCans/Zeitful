// Component Imports
import { ColorPicker } from 'primereact/colorpicker';
import { InputSwitch } from 'primereact/inputswitch';
import SettingsTimeTile from './settingsTimeTile';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
import { usePersistAppSettings } from '../../../hooks/usePersistSettings';
// React Imports
import { useEffect, useState } from 'react';
// Type Imports
import type { PersistedAppSettings } from '../../../types/types';
// Utils Imports
import { formatTime } from '../../../utils/time';

// Component Definition
const Settings = () => {
	const settings = useAppContext();
	const [isMounted, setIsMounted] = useState(false);


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
	usePersistAppSettings(settings.appSettings);

	// For Showing Timer in Tab Info
	useEffect(() => {
		let timeRemaining;
		if (settings.appSettings.showTabTimer === true) {
			if (settings.cycleNumber % 8 === 0) {
				timeRemaining = settings.appSettings.longBreakTime as number;
			} else if (settings.cycleNumber % 2 === 0) {
				timeRemaining = settings.appSettings.shortBreakTime as number;
			} else {
				timeRemaining = settings.appSettings.workingTime as number;
			}
			document.title = `${formatTime(timeRemaining)} - Zeitful`;
		} else {
			document.title = 'Zeitful';
		}
	}, [settings, settings.appSettings.showTabTimer]);

	return (
		<div
			className={`${settings.appSettings.darkMode ? 'bg-zinc-700' : 'bg-white'
				} flex flex-col p-4 short-laptop:h-75per md:max-h-[60vh] md:h-[60vh] max-h-[80vh] h-[80vh] xl:w-1/2 md:w-2/3 w-11/12 rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 duration ease-out ${isMounted
					? 'translate-y-0 opacity-100'
					: '-translate-y-full opacity-0'
				}`}
		>
			<h1 className='flex text-2xl select-none'>User Settings</h1>
			<div className='flex flex-col items-center justify-center space-y-3 flex-1'>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center w-full'>
					<p className='select-none text-md'>Timer Color</p>
					<ColorPicker
						className='outline-none focus:outline-none ring-0 focus:ring-0 focus:shadow-none'
						inputClassName='h-5 w-5'
						onChange={(e) =>
							settings.setAppSettings(
								(prev: PersistedAppSettings) => ({
									...prev,
									timerColor: e.value as string,
								}),
							)
						}
						defaultColor={`#${settings.appSettings.timerColor}`}
					/>
				</div>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center w-full'>
					<p className='select-none text-md'>Dark Mode</p>
					<InputSwitch
						checked={settings.appSettings.darkMode}
						onChange={(e) =>
							settings.setAppSettings(
								(prev: PersistedAppSettings) => ({
									...prev,
									darkMode: e.value,
								}),
							)
						}
					/>
				</div>
				<SettingsTimeTile
					label='Working Minutes'
					value={settings.appSettings.workingTime}
					setter={(newValue) =>
						settings.setAppSettings(
							(prev: PersistedAppSettings) => ({
								...prev,
								workingTime: newValue as number,
							}),
						)
					}
				/>

				<SettingsTimeTile
					label='Short Break Minutes'
					value={settings.appSettings.shortBreakTime}
					setter={(newValue) =>
						settings.setAppSettings(
							(prev: PersistedAppSettings) => ({
								...prev,
								shortBreakTime: newValue as number,
							}),
						)
					}
				/>
				<SettingsTimeTile
					label='Long Break Minutes'
					value={settings.appSettings.longBreakTime}
					setter={(newValue) =>
						settings.setAppSettings(
							(prev: PersistedAppSettings) => ({
								...prev,
								longBreakTime: newValue as number,
							}),
						)
					}
				/>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center w-full'>
					<p className='select-none text-md'>Show Timer in Tab</p>
					<InputSwitch
						checked={settings.appSettings.showTabTimer}
						onChange={(e) =>
							settings.setAppSettings(
								(prev: PersistedAppSettings) => ({
									...prev,
									showTabTimer: e.value,
								}),
							)
						}
					/>
				</div>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center w-full'>
					<p className='select-none text-md'>Use Cloud Database</p>
					<InputSwitch
						checked={settings.appSettings.useCloudDatabase}
						onChange={(e) =>
							settings.setAppSettings(
								(prev: PersistedAppSettings) => ({
									...prev,
									useCloudDatabase: e.value,
								}),
							)
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default Settings;
