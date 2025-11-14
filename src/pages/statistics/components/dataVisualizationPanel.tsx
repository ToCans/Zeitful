// Component Imports
import ItemPercentageBreakdown from './itemPercentageBreakdown';
import OverallStats from './overallStats';
import PiChart from './piChart';
// Type Imports
import { type ItemData } from '../../../types/types';

// Interface Definition
interface DataVisualizationPanelProps {
	itemData: ItemData | null;
}

// Component Definition
const DataVisualizationPanel = ({ itemData }: DataVisualizationPanelProps) => {
	return (
		<div className='flex md:flex-row flex-col w-full h-full overflow-y-auto p-2 gap-2'>
			{/* Chart and Topic Breakdown */}
			<div className='flex flex-col md:w-1/2 w-full gap-4 items-center py-2'>
				<p className='font-semibold text-sm w-full '>Topic Breakdown</p>
				{itemData && <PiChart itemData={itemData} />}
				{itemData && <ItemPercentageBreakdown itemData={itemData} />}
			</div>
			<div className='md:h-full h-1 md:w-1 w-full bg-gray-200 rounded-b-lg'></div>
			<div className='flex flex-col md:w-1/2 w-full gap-1 items-center py-2'>
				<p className='font-semibold text-sm w-full'>Overall Statistics</p>
				{itemData && <OverallStats itemData={itemData} />}
			</div>
		</div>
	);
};

export default DataVisualizationPanel;
