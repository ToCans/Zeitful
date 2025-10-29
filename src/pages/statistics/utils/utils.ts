// Library Imports
import { format, startOfWeek, addWeeks, startOfMonth, addDays } from 'date-fns';

// Type Imports
import type { StudyData } from '../../../types/study-data';
import type { WorkItem } from '../../../types/work-item';

// Type Defintion
export type PeriodOption = { label: string; value: Date | number; };


// Utility function to convert minutes → "Xh Ym"
const formatMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};

// Generates the Period options based on the timeframe
export const generatePeriods = (timeframe: 'W' | 'M' | 'Y'): PeriodOption[] => {
    const now = new Date();

    switch (timeframe) {
        case 'W': {
            const weeks: PeriodOption[] = [];
            const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
            let weekStart = currentWeekStart;

            while (weekStart.getFullYear() === now.getFullYear()) {
                const weekEnd = addDays(addWeeks(weekStart, 1), -1); // Sunday (end of the week)
                const label = `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d')}`;

                weeks.push({ label, value: weekStart });
                weekStart = addWeeks(weekStart, -1); // Go back 1 week
            }

            return weeks.reverse(); // oldest → newest
        }

        case 'M': {
            const months: PeriodOption[] = [];
            const currentMonth = now.getMonth();

            // 📆 Only include months up to the current one
            for (let i = 0; i <= currentMonth; i++) {
                const monthDate = startOfMonth(new Date(now.getFullYear(), i));
                months.push({
                    label: format(monthDate, 'MMMM yyyy'),
                    value: i,
                });
            }

            return months;
        }

        case 'Y': {
            // 📆 Generate the last 5 years (including current)
            const currentYear = now.getFullYear();
            const years: PeriodOption[] = Array.from({ length: 5 }, (_, i) => {
                const year = currentYear - (4 - i); // e.g., 2021 → 2025
                return {
                    label: `${year}`,
                    value: year, // number
                };
            });
            return years;
        }

        default:
            return [];
    }
};

// Extracts and formats the data for the Pi Chart
export const piChartDataExtraction = (studyData: StudyData[], workItems: WorkItem[]) => {

    // Calculate the totals for each topic
    const topicTotals = studyData.reduce((acc, curr) => {
        acc[curr.topic] = (acc[curr.topic] || 0) + curr.minutes_studied;
        return acc;
    }, {} as Record<string, number>);

    // Extract the labels and data values
    const labels = Object.keys(topicTotals);
    const dataValues = Object.values(topicTotals);

    // Color Extraction
    let backgroundColors: string[] = [];
    labels.forEach(label => {
        const workItem = workItems.find(item => item.work_item === label);
        if (workItem) {
            backgroundColors.push('#' + workItem.color);
        } else {
            backgroundColors.push('#888888'); // Default color if not found
        }
    });

    // Construct Chart Data
    const chartData = {
        labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: backgroundColors,
            }
        ]
    };

    return chartData;
};

// Breaks down the data for each specific topic
export const topicBreakDownDataExtraction = (studyData: StudyData[], workItems: WorkItem[]) => {

    // Calculate the totals for each topic
    const topicTotals = studyData.reduce((acc, curr) => {
        acc[curr.topic] = (acc[curr.topic] || 0) + curr.minutes_studied;
        return acc;
    }, {} as Record<string, number>);

    // Extract the labels and data values
    const topics = Object.keys(topicTotals);
    const minutes = Object.values(topicTotals);
    const minutesTotal = minutes.reduce((sum, val) => sum + val, 0);

    // Format total minutes to "Xh Ym"
    let formattedTime: string[] = [];
    minutes.forEach(minute => {
        formattedTime.push(formatMinutes(minute));
    });

    // Color Extraction
    let topicColors: string[] = [];
    topics.forEach(topics => {
        const workItem = workItems.find(item => item.work_item === topics);
        if (workItem) {
            topicColors.push('#' + workItem.color);
        } else {
            topicColors.push('#888888'); // Default color if not found
        }
    });

    // Percentage Calculation
    let percentages: number[] = [];
    minutes.forEach(minute => {
        const percentage = (minute / minutesTotal) * 100;
        percentages.push(Math.round(percentage * 100) / 100); // Round to 2 decimal places
    });

    // Breakdown Data
    const breakDownData = {
        topics,
        formattedTime,
        percentages,
        topicColors
    };

    return breakDownData;
};

export const overallStatsExtraction = (studyData: StudyData[]) => {
    const totalWorkTime = studyData.reduce((sum, entry) => sum + entry.minutes_studied, 0);

    // Calculate the totals for each topic
    const topicTotals = studyData.reduce((acc, curr) => {
        acc[curr.topic] = (acc[curr.topic] || 0) + curr.minutes_studied;
        return acc;
    }, {} as Record<string, number>);

    // Determine most and least worked-on topics
    const topics = Object.keys(topicTotals);
    let mostWorkedOnTopic = "";
    let leastWorkedOnTopic = "";
    let maxMinutes = -Infinity;
    let minMinutes = Infinity;

    topics.forEach(topic => {
        const minutes = topicTotals[topic];
        if (minutes > maxMinutes) {
            maxMinutes = minutes;
            mostWorkedOnTopic = topic;
        }
        if (minutes < minMinutes) {
            minMinutes = minutes;
            leastWorkedOnTopic = topic;
        }
    });

    return {
        totalWorkTime: formatMinutes(totalWorkTime),
        mostWorkedOnTopic,
        leastWorkedOnTopic
    };
};
