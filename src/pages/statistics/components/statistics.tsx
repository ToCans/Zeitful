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
			className={`bg-white flex flex-col items-center p-4 w-4/5 md:w-3/5 xl:w-2/5 md:h-1/2 h-4/5 rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 ease-out ${
				isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
			}`}
		>
			<div className='flex flex-col justify-center items-center w-full h-full'>
				<p>Coming Soon</p>
			</div>
		</div>
	);
};

export default Statistics;
