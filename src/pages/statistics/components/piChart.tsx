// Component Imports
import { Chart } from 'primereact/chart';
// Type Imports
import type { PiChartData, TopicData } from '../../../types/types';
// Utils Imports
import { piChartDataFormatter } from '../utils/utils';
import { useEffect, useState } from 'react';

// Interface Defintion
interface PiChartProps {
	topicData: TopicData | null;
}

// Component Defintion
const PiChart = ({ topicData }: PiChartProps) => {
	const [piChartData, setPiChartData] = useState<PiChartData | null>(null);

	useEffect(() => {
		if (topicData) {
			const formattedData = piChartDataFormatter(topicData);
			setPiChartData(formattedData);
		}
	}, [topicData]);

	if (piChartData === null) {
		return null;
	}

	return (
		<div className='flex justify-center items-center w-full h-1/2'>
			<Chart
				className='flex 5xl:size-72 4xl:size-52 size-48 justify-center items-center border-0'
				type='doughnut'
				data={piChartData}
				options={{
					plugins: {
						legend: {
							display: false,
						},
					},
				}}
			/>
		</div>
	);
};

export default PiChart;
