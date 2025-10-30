// React Imports
import { useEffect, useState } from 'react';

// Interface Definition
export interface handleUserActionProps {
	event?: React.FormEvent<HTMLFormElement>;
	setLoading: (loading: boolean) => void;
	setShowMessage: (showMessage: boolean) => void;
	setAuthStatus: (authStatus: string) => void;
	setAuthMessage: (authMessage: string) => void;
}

// Component Definition
const AuthPage = () => {
	// Component States
	const [isMounted, setIsMounted] = useState<boolean>(false);

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

	return (
		<div
			className={`bg-white md:p-4 flex flex-col w-4/5 md:w-3/5 lg:w-2/5 h-3/5 md:h-2/5 rounded-lg overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 duration ease-out ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
			<p>In Progress</p>
		</div>
	);
};

export default AuthPage;
