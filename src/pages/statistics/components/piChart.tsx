// Component Imports
import { Chart } from 'primereact/chart';
// React Imports
import { useEffect, useState } from 'react';
// Type Imports
import type { PiChartData, TaskData, TopicData } from '../../../types/types';
// Utils Imports
import { piChartDataFormatter } from '../utils/utils';
import { formatMinutes } from '../../../utils/time';

// Interface Defintion
interface PiChartProps {
	itemData: TaskData | TopicData | null;
}

// Component Defintion
const PiChart = ({ itemData }: PiChartProps) => {
	const [piChartData, setPiChartData] = useState<PiChartData | null>(null);

	useEffect(() => {
		if (itemData) {
			const formattedData = piChartDataFormatter(itemData);
			setPiChartData(formattedData);
		}
	}, [itemData]);

	if (piChartData === null) {
		return null;
	}

	return (
		<div className='flex justify-center items-center w-full h-3/5'>
			<Chart
				className='flex 5xl:size-72 xl:size-40 size-36 justify-center items-center border-0'
				type='doughnut'
				data={piChartData}
				options={{
					plugins: {
						legend: {
							display: false,
						},
						tooltip: {
							callbacks: {
								label: function (tooltipItem: any) {
									const dataset = tooltipItem.dataset;
									const index = tooltipItem.dataIndex;
									const rawValue = dataset.data[index] as number;
									return `${formatMinutes(rawValue)}`;
								},
							},
						},
					},
				}}
			/>
		</div>
	);
};

export default PiChart;
