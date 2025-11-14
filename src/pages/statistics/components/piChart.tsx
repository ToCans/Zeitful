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
	}, []);

	if (chartData === null) {
		return null;
	}

	return (
		<Chart
			className='flex w-3/5 justify-center items-center'
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
