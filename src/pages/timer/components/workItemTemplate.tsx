// Type Imports
import type { WorkItem } from '../../../types/work-item';

// Component Defintions
export const WorkItemColor = (option: WorkItem) => {
    return (
        <div className='flex items-center justify-center'>
            <span className={`h-4 w-4 border-2 mr-2 border-slate-500 rounded-md`} style={{ backgroundColor: `#${option.color}` }}></span>
        </div>
    );
};

export const workItemOptionTemplate = (option: WorkItem) => {
    return (
        <div className="flex flex-row items-center justify-center focus:outline-none">
            <WorkItemColor {...option} />
            <p className='text-center justify-center'>{option.work_item}</p>
        </div>
    );
};


export const selectedWorkItemTemplate = (option: WorkItem) => {
    if (option) {
        return (
            workItemOptionTemplate(option)
        );
    }

    return <span>Select a Focus Item</span>;
};