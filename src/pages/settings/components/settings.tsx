// Component Imports
import { ColorPicker } from 'primereact/colorpicker';
// Icon Imports
import { HiOutlinePlusCircle, HiOutlineMinusCircle } from 'react-icons/hi';
// Hook Imports
import { useSettings } from '../../../hooks/use-settings';
// React Imports
import { useEffect, useState } from 'react';
// Utils Imports
import { formatTime } from '../../../utils/utils';

// Component Definition
const Settings = () => {
	const settings = useSettings();
	const [isMounted, setIsMounted] = useState(false);

	const handleCheckboxChange = () => {
		settings.setTabTimer(!settings.showTabTimer);
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
	useEffect(() => {
		console.log('Saving settings to local storage');
		localStorage.setItem('showTabTimer', JSON.stringify(settings.showTabTimer));
		localStorage.setItem('workingTime', JSON.stringify(settings.workingTime));
		localStorage.setItem('shortBreakTime', JSON.stringify(settings.shortBreakTime));
		localStorage.setItem('longBreakTime', JSON.stringify(settings.longBreakTime));
		localStorage.setItem('timerColor', JSON.stringify(settings.timerColor));
	}, [
		settings.showTabTimer,
		settings.workingTime,
		settings.shortBreakTime,
		settings.longBreakTime,
		settings.timerColor,
	]);

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
			className={`bg-white flex flex-col p-4 w-4/5 md:w-3/5 h-1/2 md:h-2/5 rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 duration ease-out ${
				isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
			}`}
		>
			<h1 className='flex text-2xl select-none'>User Settings</h1>
			<div className='flex flex-col items-center justify-center space-y-2 flex-1'>
				<div className='flex flex-row space-x-2 sm:text-2xl items-center justify-center w-full'>
					<p className='select-none text-lg'>Timer Color:</p>
					<ColorPicker
						className='outline-none focus:outline-none ring-0 focus:ring-0 focus:shadow-none'
						inputClassName='h-5 w-5'
						onChange={(e) => settings.settimerColor(e.value as string)}
						defaultColor={`#${settings.timerColor}`}
					/>
				</div>
				<div className='flex flex-row space-x-2 sm:text-2xl items-center justify-center w-full'>
					<HiOutlineMinusCircle
						className='size-6 sm:mt-1 hover:stroke-slate-600'
						onClick={() => {
							if (settings.workingTime > 60) {
								settings.setWorkingTime(settings.workingTime - 60);
							}
						}}
					/>
					<p className='text-center align-middle select-none text-lg w-3/5 lg:w-2/5 3xl:w-1/5'>
						Working Minutes: {Math.floor(settings.workingTime / 60)}
					</p>
					<HiOutlinePlusCircle
						className='size-6 sm:mt-1 hover:stroke-slate-600'
						onClick={() => settings.setWorkingTime(settings.workingTime + 60)}
					/>
				</div>
				<div className='flex flex-row space-x-2 sm:text-2xl items-center justify-center  w-full'>
					<HiOutlineMinusCircle
						className='size-6 sm:mt-1 hover:stroke-slate-600'
						onClick={() => {
							if (settings.shortBreakTime > 60) {
								settings.setShortBreakTime(settings.shortBreakTime - 60);
							}
						}}
					/>
					<p className='text-center align-middle select-none text-lg w-3/5 lg:w-2/5 3xl:w-1/5'>
						Short Break Minutes: {Math.floor(settings.shortBreakTime / 60)}
					</p>
					<HiOutlinePlusCircle
						className='size-6 sm:mt-1 hover:stroke-slate-600'
						onClick={() => settings.setShortBreakTime(settings.shortBreakTime + 60)}
					/>
				</div>
				<div className='flex flex-row space-x-2 sm:text-2xl items-center justify-center  w-full'>
					<HiOutlineMinusCircle
						className='size-6 sm:mt-1 hover:stroke-slate-600'
						onClick={() => {
							if (settings.longBreakTime > 60) {
								settings.setLongBreakTime(settings.longBreakTime - 60);
							}
						}}
					/>
					<p className='text-center align-middle select-none text-lg w-3/5 lg:w-2/5 3xl:w-1/5'>
						Long Break Minutes: {Math.floor(settings.longBreakTime / 60)}
					</p>
					<HiOutlinePlusCircle
						className='size-6 sm:mt-1 hover:stroke-slate-600'
						onClick={() => settings.setLongBreakTime(settings.longBreakTime + 60)}
					/>
				</div>
				<div className='flex flex-row space-x-2 sm:text-2xl items-center justify-center w-3/5 lg:w-2/5 3xl:w-1/5'>
					<p className='text-center align-middle select-none text-lg '>
						Show Timer in Tab
					</p>
					<label>
						<input
							type='checkbox'
							checked={settings.showTabTimer}
							onChange={handleCheckboxChange}
						/>
					</label>
				</div>
			</div>
		</div>
	);
};

export default Settings;
