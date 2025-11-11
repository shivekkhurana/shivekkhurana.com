import clsx from 'clsx';
import { format } from 'date-fns';
import {
  getLatestValue,
  getWeeklyData,
  formatNumber,
} from '@src/domain/healthkit';
import type { HealthMetricData } from '@src/domain/healthkit.types';

type UnoTimeSeriesSnapshotProps = {
  data: HealthMetricData;
  title: string;
  unit: string; // e.g., "BPM", "ms", "°C"
  color: string; // e.g., "#FF69B4" for pink, "#FF6B6B" for red, etc.
};

type BarChartComponentProps = {
  data: Array<{
    date: Date;
    value: number;
    isMissing: boolean;
  }>;
  color: string;
};

function BarChartComponent({ data, color }: BarChartComponentProps) {
  // Calculate the max and min values for scaling
  const allValues = data.filter((d) => !d.isMissing).map((d) => d.value);
  const rawMax = allValues.length > 0 ? Math.max(...allValues) : 0;
  const rawMin = allValues.length > 0 ? Math.min(...allValues) : 0;

  // Add buffer (10% padding) to min and max for better visual spacing
  const range = rawMax - rawMin;
  const buffer = range > 0 ? range * 0.5 : rawMax * 0.5 || 1;
  const maxValue = rawMax + buffer;
  const minValue = Math.max(0, rawMin - buffer); // Don't go below 0

  // Calculate average value for missing data bars
  const avgValue =
    allValues.length > 0
      ? allValues.reduce((sum, val) => sum + val, 0) / allValues.length
      : 0;

  return (
    <div className={clsx('relative w-12 h-8 flex items-end gap-[1px]')}>
      {data.map((entry, index) => {
        // Use average value for missing data, actual value for existing data
        const value = entry.isMissing ? avgValue : entry.value;
        const heightPercent =
          maxValue > minValue
            ? ((value - minValue) / (maxValue - minValue)) * 100
            : 0;

        const barStyle: React.CSSProperties = {
          height: `${heightPercent}%`,
          backgroundColor: entry.isMissing ? 'transparent' : color,
          borderTopLeftRadius: '2px',
          borderTopRightRadius: '2px',
          flex: 1,
          minWidth: 0,
          border: entry.isMissing
            ? `1.5px dashed ${color}`
            : `1px solid ${color}`,
        };

        return (
          <div
            key={`bar-${index}`}
            style={barStyle}
            className={clsx('flex-shrink-0')}
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
}: UnoTimeSeriesSnapshotProps) {
  const latest = getLatestValue(data);
  const weeklyData = getWeeklyData(data);

  if (!latest || weeklyData.length === 0) {
    return <div className={clsx('text-sm opacity-60')}>No data available</div>;
  }

  const latestValue = formatNumber(latest.qty);

  // For bar charts, ensure we always show exactly 7 bars
  // Create a map of date -> value for quick lookup
  const dataMap = new Map(
    weeklyData.map((point) => [format(point.date, 'yyyy-MM-dd'), point.value])
  );

  // Generate 7 days of data
  const now = new Date();
  const barData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i)); // Last 7 days, most recent last
    const dateKey = format(date, 'yyyy-MM-dd');
    const value = dataMap.get(dateKey);
    const isMissing = value === undefined;
    return {
      date,
      value: value ?? 0, // Use 0 as placeholder, won't be rendered when missing
      isMissing,
    };
  });

  return (
    <div className={clsx('flex items-center gap-2')}>
      <div className={clsx('flex flex-col min-w-[60px]')}>
        <div
          className={clsx('text-xs font-medium')}
          style={{ color }}
        >
          {title}
        </div>
        <div className={clsx('flex items-baseline gap-1')}>
          <span className={clsx('text-lg font-bold')}>{latestValue}</span>
          <span className={clsx('text-[10px] opacity-60')}>{unit}</span>
        </div>
      </div>
      {barData.length > 0 ? (
        <BarChartComponent
          data={barData}
          color={color}
        />
      ) : (
        <div className={clsx('w-12 h-8 bg-white/5 rounded')} />
      )}
    </div>
  );
}
