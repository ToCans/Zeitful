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
			className='flex 2xl:size-80 lg:size-60 size-52 justify-center items-center border-0'
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
