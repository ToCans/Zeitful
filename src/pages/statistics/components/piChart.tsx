// Component Imports
import { Chart } from 'primereact/chart';
// Type Imports
import type { ItemData } from '../../../types/types';
// Utils Imports
import { piChartDataFormatter } from '../utils/utils';

// Interface Defintion
interface PiChartProps {
    itemData: ItemData | null,
}

// Component Defintion
const PiChart = ({ itemData }: PiChartProps) => {
    if (!itemData) {
        return null;
    }

    const chartData = piChartDataFormatter(itemData);

    return (
        <Chart
            className='flex w-11/12 h-1/2 justify-center items-center'
            type='doughnut'
            data={chartData}
            options={{
                plugins: {
                    legend: {
                        display: false, // <-- hides the legend
                    },
                },
            }}
        />);

};

export default PiChart;