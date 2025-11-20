// Component Imports
import { Chart } from 'primereact/chart';
// Type Imports
import type { ChartData, ItemData } from '../../../types/types';
// Utils Imports
import { piChartDataFormatter } from '../utils/utils';
import { useEffect, useState } from 'react';

// Interface Defintion
interface PiChartProps {
	itemData: ItemData | null;
}

// Component Defintion
const PiChart = ({ itemData }: PiChartProps) => {
	const [chartData, setChartData] = useState<ChartData | null>(null);

	useEffect(() => {
		if (itemData) {
			const formattedData = piChartDataFormatter(itemData);
			setChartData(formattedData);
		}
	}, [itemData]);

	if (chartData === null) {
		return null;
	}

	return (
		<Chart
			className='flex 3xl:size-72 size-48 justify-center items-center border-0'
			type='doughnut'
			data={chartData}
			options={{
				plugins: {
					legend: {
						display: false,
					},
				},
			}}
		/>
	);
};

export default PiChart;
