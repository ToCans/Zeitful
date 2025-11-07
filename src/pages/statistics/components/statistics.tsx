// Component Imports
import WorkEntryManager from '../../../components/ItemManager/workEntryManager';
// React Imports
import { useEffect, useState } from 'react';

// Component Definition
const Statistics = () => {
	const [isMounted, setIsMounted] = useState(false);

	// Animate on mount
	useEffect(() => {
		const timeout = setTimeout(() => setIsMounted(true), 10);
		return () => clearTimeout(timeout);
	}, []);

	return (
		<div
			className={`bg-white gap-1 flex flex-col relative p-4 w-4/5 md:w-3/5 xl:w-2/5 h-1/2 rounded-lg overflow-auto shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 duration ease-out ${
				isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
			}`}
		>
			<div className='flex flex-row w-full justify-between items-center'>
				<p className='text-2xl'>Work Entry Viewer</p>
				<p className='text-xs text-gray-600'>More features coming soon</p>
			</div>

			<WorkEntryManager />
		</div>
	);
};

export default Statistics;
