// Interface Definition
interface TopicData {
	topics: string[];
	formattedTime: string[];
	percentages: number[];
	topicColors: string[];
}

interface TopicBreakDownItemProps {
	index: number;
	backgroundColor: string;
	topic: string;
	formattedTime: string;
	percentage: string;
}

// Component Definition
const TopicBreakDownItem = ({
	index,
	backgroundColor,
	topic,
	formattedTime,
	percentage,
}: TopicBreakDownItemProps) => {
	return (
		<div
			key={index}
			className='flex items-center justify-between py-1 px-2 hover:bg-gray-100 rounded'
		>
			{/* Color icon + topic name */}
			<div className='flex items-center gap-2'>
				<span
					className={`h-3 w-3 border-2 border-slate-500 rounded-md`}
					style={{ backgroundColor: backgroundColor }}
				></span>
				<span className='font-medium'>{topic}</span>
			</div>

			{/* Minutes and percentage */}
			<div className='flex items-center gap-4'>
				<span className='text-sm text-gray-600'>{formattedTime}</span>
				<span className='text-sm text-gray-500'>{percentage}%</span>
			</div>
		</div>
	);
};

// Component Definition
export const TopicList = (breakDownData: TopicData) => {
	return (
		<div className='overflow-y-scroll rounded-md w-full h-1/3'>
			{breakDownData.topics.map((topic, index) => (
				<TopicBreakDownItem
					index={index}
					backgroundColor={breakDownData.topicColors[index]}
					topic={topic}
					formattedTime={breakDownData.formattedTime[index]}
					percentage={breakDownData.percentages[index].toFixed(2)}
				/>
			))}
		</div>
	);
};
export default TopicList;
