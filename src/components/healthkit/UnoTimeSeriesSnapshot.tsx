import clsx from 'clsx';
import { format, startOfDay, eachDayOfInterval, subDays } from 'date-fns';
import {
  getLatestValue,
  formatNumber,
  parseHealthKitDate,
  transformMetricsForChart,
  formatDateShort,
  calculateAverage,
} from '@src/domain/healthkit';
import type { HealthMetricData } from '@src/domain/healthkit.types';
import config from '@src/config';
import { getGradientClasses } from '@src/utils/charts';

type UnoTimeSeriesSnapshotProps = {
  data: HealthMetricData;
  title: string;
  unit: string; // e.g., "BPM", "ms", "°C"
  color: string; // e.g., "#FF69B4" for pink, "#FF6B6B" for red, etc.
  className?: string; // For dimensions
};

type BarChartComponentProps = {
  data: Array<{
    date: Date;
    value: number;
    isMissing: boolean;
  }>;
  color: string;
};

// Helper function to convert hex color to rgba with opacity
function hexToRgba(hex: string, opacity: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex; // Return original if not a valid hex

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Helper function to get a darker color for text readability
function getTextColor(hex: string): string {
  // For teal/cyan colors, use a darker shade for better readability
  if (hex === config.colors.healthkit.bodySurfaceTemp) {
    return config.colors.healthkit.bodySurfaceTempText;
  }
  // For other colors, return as-is (they're already readable)
  return hex;
}

function BarChartComponent({ data, color }: BarChartComponentProps) {
  // Calculate the max and min values for scaling
  const allValues = data.map((d) => d.value);
  const rawMax = allValues.length > 0 ? Math.max(...allValues) : 0;
  const rawMin = allValues.length > 0 ? Math.min(...allValues) : 0;

  // Add buffer (10% padding) to min and max for better visual spacing
  const range = rawMax - rawMin;
  const bufferMultiplier = 0.8;
  const buffer =
    range > 0 ? range * bufferMultiplier : rawMax * bufferMultiplier || 1;
  const maxValue = rawMax + buffer;
  const minValue = Math.max(0, rawMin - buffer); // Don't go below 0

  return (
    <div className={clsx('w-full h-full flex items-end gap-0.5')}>
      {data.map((entry, index) => {
        const heightPercent =
          maxValue > minValue
            ? ((entry.value - minValue) / (maxValue - minValue)) * 100
            : 0;

        // Ensure missing bars have a minimum visible height (at least 2% or 1px)
        const minHeight = entry.isMissing
          ? Math.max(2, heightPercent)
          : heightPercent;

        const barStyle: React.CSSProperties = {
          height: `${minHeight}%`,
          backgroundColor: entry.isMissing ? hexToRgba(color, 0.5) : color,
          borderColor: entry.isMissing ? hexToRgba(color, 0.5) : color,
          minHeight: entry.isMissing ? '1px' : undefined,
        };

        return (
          <div
            key={`bar-${index}`}
            style={barStyle}
            className={clsx('w-1 flex-shrink-0 rounded-t-sm border')}
            title={
              entry.isMissing
                ? `Missing data for ${format(entry.date, 'yyyy-MM-dd')}`
                : `${format(entry.date, 'MMM d')}: ${entry.value.toFixed(1)}`
            }
          />
        );
      })}
    </div>
  );
}

export default function UnoTimeSeriesSnapshot({
  data,
  title,
  unit,
  color,
  className,
}: UnoTimeSeriesSnapshotProps) {
  const latest = getLatestValue(data);
  const allDataPoints = transformMetricsForChart(data);

  if (!latest || allDataPoints.length === 0) {
    return (
      <div
        className={clsx(
          className,
          'flex items-center justify-center text-sm opacity-60'
        )}
      >
        No data available
      </div>
    );
  }

  const latestValue = formatNumber(latest.qty);
  const latestDate = parseHealthKitDate(latest.date);
  const formattedDate = formatDateShort(latestDate);

  // Show last 14 days from the latest date
  const daysToShow = 14;
  const endDate = startOfDay(latestDate);
  const startDate = startOfDay(subDays(latestDate, daysToShow - 1));

  // Filter data points within the 14-day range
  const dataInRange = allDataPoints.filter(
    (point) =>
      startOfDay(point.date) >= startDate && startOfDay(point.date) <= endDate
  );

  // Calculate average for the 14-day period
  const averageValue =
    dataInRange.length > 0
      ? dataInRange.reduce((sum, point) => sum + point.value, 0) /
        dataInRange.length
      : 0;

  // Create a map of date -> value for quick lookup
  const dataMap = new Map(
    dataInRange.map((point) => [
      format(startOfDay(point.date), 'yyyy-MM-dd'),
      point.value,
    ])
  );

  // Generate bars for each day in the range (left to right, oldest to newest)
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const barData = days.map((day) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const value = dataMap.get(dateKey);
    const isMissing = value === undefined;
    // Use average value for missing days
    const finalValue = value ?? averageValue;

    return {
      date: day,
      value: finalValue,
      isMissing,
    };
  });

  return (
    <div
      className={clsx(
        className,
        // Layout & positioning
        'relative flex flex-col',
        // Spacing
        'px-2 pt-2 pb-0',
        // Appearance
        'rounded-lg overflow-hidden',
        // Gradient background
        getGradientClasses(color),
        // Cursor (must be last to ensure it's applied)
        'cursor-pointer'
      )}
    >
      {/* Top section: Label (left) and Value (right) */}
      <div className={clsx('flex justify-between items-start mb-1')}>
        <span
          className={clsx('text-xs font-medium')}
          style={{ color: getTextColor(color) }}
        >
          {title}
        </span>
        <span className={clsx('text-xs font-bold')}>{latestValue}</span>
      </div>

      {/* Middle section: Date (left) and Unit (right) */}
      <div className={clsx('flex justify-between items-start mb-2')}>
        <span className={clsx('text-[10px] opacity-70')}>{formattedDate}</span>
        <span className={clsx('text-[10px] opacity-70')}>{unit}</span>
      </div>

      {/* Bottom section: Bars filling remaining space */}
      <div className={clsx('flex-1 min-h-0')}>
        <BarChartComponent
          data={barData}
          color={color}
        />
      </div>
    </div>
  );
}
