// Component Imports
import { ColorPicker } from 'primereact/colorpicker';
// Icon Imports
import { HiOutlinePlusCircle, HiOutlineMinusCircle } from 'react-icons/hi';
// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
import { usePersistSettings } from '../../../hooks/usePersistSettings';
// React Imports
import { useEffect, useState } from 'react';
// Utils Imports
import { formatTime } from '../../../utils/utils';

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
			className={`bg-white flex flex-col p-4 2xl:w-1/3 xl:w-2/5 md:w-3/5 w-11/12 h-[50vh] rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 duration ease-out ${
				isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
			}`}
		>
			<h1 className='flex text-2xl select-none'>User Settings</h1>
			<div className='flex flex-col items-center justify-center space-y-2 flex-1'>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center w-full'>
					<p className='select-none text-md'>Timer Color:</p>
					<ColorPicker
						className='outline-none focus:outline-none ring-0 focus:ring-0 focus:shadow-none'
						inputClassName='h-5 w-5'
						onChange={(e) => settings.settimerColor(e.value as string)}
						defaultColor={`#${settings.timerColor}`}
					/>
				</div>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center w-full'>
					<HiOutlineMinusCircle
						className='size-6 sm:mt-1 hover:stroke-slate-600'
						onClick={() => {
							if (settings.workingTime > 60) {
								settings.setWorkingTime(settings.workingTime - 60);
							}
						}}
					/>
					<p className='text-center align-middle select-none w-3/5 lg:w-2/5 3xl:w-1/6'>
						Working Minutes: {Math.floor(settings.workingTime / 60)}
					</p>
					<HiOutlinePlusCircle
						className='size-6 sm:mt-1 hover:stroke-slate-600'
						onClick={() => settings.setWorkingTime(settings.workingTime + 60)}
					/>
				</div>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center  w-full'>
					<HiOutlineMinusCircle
						className='size-6 sm:mt-1 hover:stroke-slate-600'
						onClick={() => {
							if (settings.shortBreakTime > 60) {
								settings.setShortBreakTime(settings.shortBreakTime - 60);
							}
						}}
					/>
					<p className='text-center align-middle select-none w-3/5 lg:w-2/5 3xl:w-1/6'>
						Short Break Minutes: {Math.floor(settings.shortBreakTime / 60)}
					</p>
					<HiOutlinePlusCircle
						className='size-6 sm:mt-1 hover:stroke-slate-600'
						onClick={() => settings.setShortBreakTime(settings.shortBreakTime + 60)}
					/>
				</div>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center  w-full'>
					<HiOutlineMinusCircle
						className='size-6 sm:mt-1 hover:stroke-slate-600'
						onClick={() => {
							if (settings.longBreakTime > 60) {
								settings.setLongBreakTime(settings.longBreakTime - 60);
							}
						}}
					/>
					<p className='text-center align-middle select-none  w-3/5 lg:w-2/5 3xl:w-1/6'>
						Long Break Minutes: {Math.floor(settings.longBreakTime / 60)}
					</p>
					<HiOutlinePlusCircle
						className='size-6 sm:mt-1 hover:stroke-slate-600'
						onClick={() => settings.setLongBreakTime(settings.longBreakTime + 60)}
					/>
				</div>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center w-3/5 lg:w-2/5 3xl:w-1/6'>
					<p className='text-center align-middle select-none '>Show Timer in Tab</p>
					<label>
						<input
							type='checkbox'
							checked={settings.showTabTimer}
							onChange={handleTabCheckboxChange}
						/>
					</label>
				</div>
				<div className='flex flex-row space-x-2 xl:text-lg text-lg items-center justify-center w-3/5 lg:w-2/5 3xl:w-1/6'>
					<p className='text-center align-middle select-none'>Use Cloud Database</p>
					<label>
						<input
							type='checkbox'
							checked={settings.useCloudDatabase}
							onChange={handleCloudCheckboxChange}
						/>
					</label>
				</div>
			</div>
		</div>
	);
};

export default Settings;
