// Component Imports
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { WorkItemColor } from '../../timer/components/workItemTemplate';

// React Imports
import React, { Dispatch } from 'react';

// Type Imports
import type { WorkItem } from '../../../types/work-item';
import { deleteWorkItem } from '../../../services/work-item';

// Interface Definitions
interface WorkItemsTableProps {
	session: Session | null;
	workItems: WorkItem[];
	setWorkItems: Dispatch<React.SetStateAction<WorkItem[]>>;
}

// Component Defintion
const WorkItemTable = ({ session, workItems, setWorkItems }: WorkItemsTableProps) => {
	// Delete row handler
	const handleDelete = async (rowData: WorkItem) => {
		await deleteWorkItem(session, setWorkItems, rowData.work_item);
	};

	// Delete button template
	const actionBodyTemplate = (rowData: WorkItem) => {
		return (
			<Button
				icon='pi pi-trash'
				className='p-button-rounded p-button-danger p-button-sm'
				onClick={() => handleDelete(rowData)}
			/>
		);
	};

	return (
		<DataTable
			value={workItems}
			editMode='row'
			dataKey='work_item'
			scrollable
			scrollHeight='flex'
			tableStyle={{ width: '100%', tableLayout: 'fixed', overflowX: 'hidden' }}
		>
			<Column field='work_item' header='Topic' />
			<Column field='color' header='Color' body={WorkItemColor} />
			<Column body={actionBodyTemplate} header='Actions' />
		</DataTable>
	);
};

export default WorkItemTable;
