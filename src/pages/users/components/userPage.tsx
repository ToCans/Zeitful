//TODO: Cleanup Later
import { addTopic, addTask, getTopics, getTasks } from '../../../api/database';
import { useSettings } from '../../../hooks/use-settings';
import { v4 as uuidv4 } from 'uuid';
// React Imports
import { useEffect, useState } from 'react';

// Component Definition
const UserPage = () => {
	// TODO: Cleanup
	const settings = useSettings();

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

	const handleAddTopic = async () => {
		const id = uuidv4();
		const response = await addTopic({ id: id, topic: 'New Topic', color: '#FF9900' });
		console.log(response.status);
		console.log(response.message);
		settings.setWorkTopics(await getTopics());
	};

	const handleAddTask = async () => {
		// Active Topic Handling
		let topic;
		if (settings.activeWorkTask) {
			topic = settings.activeWorkTask["topic"];
		} else {
			topic = null;
		}

		const response = await addTask({
			topic,
			task_name: "testing",
			duration: settings.workingTime,
			completion_time: new Date(),
			status: 'Open',
		});
		console.log(response.status);
		console.log(response.message);
		settings.setWorkTasks(await getTasks());
	};

	return (
		<div
			className={`bg-white md:p-4 flex flex-col relative p-4 w-4/5 md:w-3/5 xl:w-2/5 h-1/2 rounded-lg overflow-auto shadow-[2px_2px_2px_rgba(0,0,0,0.3)] transform transition-transform duration-700 duration ease-out ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
			<div className="space-x-2">
				<button onClick={handleAddTopic} className="bg-blue-500 text-white px-3 py-1 rounded">
					Add Topic
				</button>
				<button onClick={handleAddTask} className="bg-green-500 text-white px-3 py-1 rounded">
					Add Task
				</button>
			</div>

			<h2 className="mt-4 font-semibold">Topics</h2>
			<pre>{JSON.stringify(settings.workTopics, null, 2)}</pre>

			<h2 className="mt-4 font-semibold">Tasks</h2>
			<pre>{JSON.stringify(settings.workTasks, null, 2)}</pre>

		</div>
	);
};

export default UserPage;
