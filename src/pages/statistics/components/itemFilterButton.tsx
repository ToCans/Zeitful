// Hook Imports
import { useAppContext } from '../../../hooks/useAppContext';
// Type Imports
import type { Dispatch } from 'react';

interface ItemFilterButtonProps {
    isActive: boolean,
    name: 'Task' | 'Topic';
    setItemFilter: Dispatch<React.SetStateAction<string>>;
}

const ItemFilterButton = ({ isActive, name, setItemFilter }: ItemFilterButtonProps) => {
    const settings = useAppContext();

    return (
        <button className={`h-6 rounded-lg border-2 ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-100'} ${settings.darkMode ? 'border-zinc-500 text-zinc-100' : 'border-zinc-200 text-black'} px-1`} onClick={() => (setItemFilter(name))}>
            <p className='text-xs font-semibold'>{name}</p>
        </button>
    );
};

export default ItemFilterButton;;