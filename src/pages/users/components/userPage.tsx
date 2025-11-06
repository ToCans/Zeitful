// Component Imports
import TaskManager from '../../../components/ItemManager/taskManager';
import TopicManager from '../../../components/ItemManager/topicManager';
// React Imports
import { useEffect, useState } from 'react';
// Type Imports
import type { Item } from '../../../types/types';

// Component Defintion
const UserPage = () => {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [itemManagement, setItemManagement] = useState<Item>('Task');

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
			className={`bg-white gap-1 flex flex-col relative p-4 w-4/5 md:w-3/5 xl:w-2/5 h-1/2 rounded-lg overflow-auto shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 duration ease-out ${
				isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
			}`}
		>
			<div className='flex flex-row w-full justify-between items-center'>
				<p className='text-2xl'>Work {itemManagement} Management</p>
			</div>
			<div className='flex flex-row gap-2'>
				<button
					className={`${
						itemManagement == 'Task' ? 'opacity-85' : 'opacity-50 hover:opacity-75'
					}`}
					onClick={() => setItemManagement('Task')}
				>
					Task
				</button>
				<button
					className={`${
						itemManagement == 'Topic' ? 'opacity-85' : 'opacity-50 hover:opacity-75'
					}`}
					onClick={() => setItemManagement('Topic')}
				>
					Topic
				</button>
			</div>
			<div className='h-2/3'>
				{itemManagement === 'Task' && <TaskManager />}
				{itemManagement === 'Topic' && <TopicManager />}
			</div>
		</div>
	);
};

export default UserPage;
