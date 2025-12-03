// Type Immports
import type { Item } from '../../../types/types';
import type { Dispatch } from 'react';

// Interface Definition
interface ItemNavigationBarProps {
	itemManagement: Item;
	setItemManagement: Dispatch<React.SetStateAction<Item>>;
}

// Component Definition
const ItemNavigationBar = ({ itemManagement, setItemManagement }: ItemNavigationBarProps) => {
	return (
		<div className='flex flex-row gap-2'>
			<button
				className={`${itemManagement == 'Task' ? 'opacity-85' : 'opacity-50 hover:opacity-75'
					}`}
				onClick={() => setItemManagement('Task')}
			>
				Task
			</button>
			<button
				className={`${itemManagement == 'Topic' ? 'opacity-85' : 'opacity-50 hover:opacity-75'
					}`}
				onClick={() => setItemManagement('Topic')}
			>
				Topic
			</button>
			<button
				className={`${itemManagement == 'Entries' ? 'opacity-85' : 'opacity-50 hover:opacity-75'
					}`}
				onClick={() => setItemManagement('Entries')}
			>
				Entries
			</button>
		</div>
	);
};

export default ItemNavigationBar;
