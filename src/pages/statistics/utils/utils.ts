// Library Imports
import { format, startOfWeek, endOfWeek, addWeeks, startOfMonth, endOfMonth, addDays, startOfYear, endOfYear } from 'date-fns';
// Type Imports
import type { WorkTopic, WorkEntry, DurationByTopic, ItemData } from '../../../types/types';
// Type Defintion
export type PeriodOption = { label: string; value: Date | number; };


// Gathers the data for the most recent month
export const gatherMostRecentData = (timeFrame: 'W' | 'M' | 'Y') => {
    const periodOptions = generatePeriodOptions(timeFrame);
    const latestPeriod = periodOptions[periodOptions.length - 1]?.value ?? null;
    return { periodOptions, latestPeriod };
};

// Generates the Period options based on the timeframe
export const generatePeriodOptions = (timeframe: 'W' | 'M' | 'Y'): PeriodOption[] => {
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

function getWeekRange(date: Date) {
    // weekStartsOn: 0 = Sunday, 1 = Monday
    const startDate = startOfWeek(date, { weekStartsOn: 1 });
    const endDate = endOfWeek(date, { weekStartsOn: 1 });

    return { startDate, endDate };
}

function getMonthRange(month: number): { startDate: Date; endDate: Date; } {
    const year = new Date().getFullYear();

    // month in Date constructor is 0-based (Jan = 0)
    const firstDayOfMonth = new Date(year, month, 1);

    const startDate = startOfMonth(firstDayOfMonth);
    const endDate = endOfMonth(firstDayOfMonth);

    return { startDate, endDate };
}

function getYearRange(year: number): { startDate: Date; endDate: Date; } {
    // month in Date constructor is 0-based (Jan = 0)
    const firstDayOfMonth = new Date(year, 0, 1);

    const startDate = startOfYear(firstDayOfMonth);
    const endDate = endOfYear(firstDayOfMonth);

    return { startDate, endDate };
}

// Depending on the timeframe selected, a start and end date are generated
export const generateDateRange = (timeFrame: 'W' | 'M' | 'Y', selectedPeriod: any) => {
    let dateRange: { startDate: Date, endDate: Date; };

    // 🎯 Determine start and end date based on timeframe & selected period
    switch (timeFrame) {
        case 'W': {
            dateRange = getWeekRange(selectedPeriod);
            break;
        }
        case 'M': {
            dateRange = getMonthRange(selectedPeriod);
            break;
        }
        case 'Y': {
            dateRange = getYearRange(selectedPeriod);
            break;
        }
        default:
            throw new Error('Invalid timeframe');
    }

    return dateRange;
};

// Filters the work entries based on a range defined by the time frame
export const filterWorkEntriesByDateRange = (workEntries: WorkEntry[], dateRange: { startDate: Date, endDate: Date; }) => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    return workEntries.filter(workEntry => {
        const entryDate = new Date(workEntry.completion_time);
        return entryDate >= start && entryDate <= end;
    });
};

// Gets the total duration for each topic within a specific period
export const getTotalDurationByTopicForSelectedPeriod = (workEntries: WorkEntry[]): DurationByTopic => {
    return workEntries.reduce<DurationByTopic>((acc, workEntry) => {
        const key = workEntry.topic_id ?? "no_topic_id";
        acc[key] = (acc[key] || 0) + workEntry.duration;
        return acc;
    }, {});
};

// Matches the topic durations of existing workTopics to extracted topic durations
export const matchItemToTopics = (durationsPerItem: DurationByTopic, workTopics: WorkTopic[]): ItemData => {
    // Extract the labels and data values
    const itemIds = Object.keys(durationsPerItem);
    const itemDurations = Object.values(durationsPerItem);

    // Topic Name and Color Extraction
    let itemNames: string[] = [];
    let colors: string[] = [];
    itemIds.forEach(itemId => {
        const matchingWorkItem = workTopics.find(item => item.id === itemId);
        if (matchingWorkItem) {
            itemNames.push(matchingWorkItem.name);
            colors.push(matchingWorkItem.color);
        } else {
            itemNames.push("No Topic");
            colors.push('#888888'); // Default color if not found
        }
    });

    // Construct Topic Data
    const itemData: ItemData = {
        itemIds: itemIds,
        itemNames: itemNames,
        itemDurations: itemDurations,
        itemColors: colors
    };

    return itemData;
};

export function calculateTopicPercentages(itemData: ItemData): ItemData {
    const totalDuration = itemData.itemDurations.reduce((sum, dur) => sum + dur, 0);

    const topicPercentage = itemData.itemDurations.map(dur =>
        totalDuration === 0 ? 0 : (dur / totalDuration) * 100
    );

    return {
        ...itemData,
        topicPercentage
    };
}

// Extracts and formats the data for the Pi Chart
export const piChartDataFormatter = (itemData: ItemData) => {
    // Construct Chart Data
    const chartData = {
        labels: itemData.itemNames,
        datasets: [
            {
                data: itemData.itemDurations,
                backgroundColor: itemData.itemColors,
            }
        ]
    };

    return chartData;
};

export function getTotalTimeWorked(data: ItemData): number {
    return data.itemDurations.reduce((sum, duration) => sum + duration, 0);
}

/**
 * Returns the item with the most time worked on
 */
export function getMostWorkedOn(data: ItemData) {
    if (data.itemDurations.length === 0) return null;

    const maxDuration = Math.max(...data.itemDurations);
    const index = data.itemDurations.indexOf(maxDuration);

    return {
        id: data.itemIds[index],
        name: data.itemNames[index],
        color: data.itemColors[index],
        duration: maxDuration,
        percentage: data.topicPercentage?.[index] ?? null,
    };
}

/**
 * Returns the item with the least time worked on
 */
export function getLeastWorkedOn(data: ItemData) {
    if (data.itemDurations.length === 0) return null;

    const minDuration = Math.min(...data.itemDurations);
    const index = data.itemDurations.indexOf(minDuration);

    return {
        id: data.itemIds[index],
        name: data.itemNames[index],
        color: data.itemColors[index],
        duration: minDuration,
        percentage: data.topicPercentage?.[index] ?? null,
    };
}

