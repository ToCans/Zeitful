// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';

// Interface Definition
interface ItemNavigationBarProps {
	itemManagement: string;
}

// Component Definition
const ItemNavigationBar = ({ itemManagement }: ItemNavigationBarProps) => {
	const settings = useAppContext();

	return (
		<div className='flex flex-row gap-2'>
			<button
				className={`${
					itemManagement == 'Task'
						? 'opacity-85'
						: 'opacity-50 hover:opacity-75'
				}`}
				onClick={() => {
					settings.setTabSettings((prev) => ({
						...prev,
						lastUsedUserPageTab: 'Task',
					}));
				}}
			>
				Task
			</button>
			<button
				className={`${
					itemManagement == 'Topic'
						? 'opacity-85'
						: 'opacity-50 hover:opacity-75'
				}`}
				onClick={() => {
					settings.setTabSettings((prev) => ({
						...prev,
						lastUsedUserPageTab: 'Topic',
					}));
				}}
			>
				Topic
			</button>
			<button
				className={`${
					itemManagement == 'Entries'
						? 'opacity-85'
						: 'opacity-50 hover:opacity-75'
				}`}
				onClick={() => {
					settings.setTabSettings((prev) => ({
						...prev,
						lastUsedUserPageTab: 'Entries',
					}));
				}}
			>
				Entries
			</button>
		</div>
	);
};

export default ItemNavigationBar;
