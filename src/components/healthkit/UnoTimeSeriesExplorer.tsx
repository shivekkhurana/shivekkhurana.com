import clsx from 'clsx';
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import {
  filterByPeriod,
  calculateAverage,
  transformMetricsForChart,
  formatNumber,
  getDateRangeString,
} from '@src/domain/healthkit';
import type { HealthMetricData, TimePeriod } from '@src/domain/healthkit.types';

type UnoTimeSeriesExplorerProps = {
  data: HealthMetricData;
  title: string;
  unit: string;
  color: string;
  yAxisDomain?: [number, number]; // Optional Y-axis domain
};

const PERIODS: { value: TimePeriod; label: string }[] = [
  { value: 'D', label: 'D' },
  { value: 'W', label: 'W' },
  { value: 'M', label: 'M' },
  { value: '6M', label: '6M' },
  { value: 'Y', label: 'Y' },
  { value: 'All', label: 'All' },
];

export default function UnoTimeSeriesExplorer({
  data,
  title,
  unit,
  color,
  yAxisDomain,
}: UnoTimeSeriesExplorerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('W');

  const filteredData = filterByPeriod(data, selectedPeriod);
  const chartData = transformMetricsForChart(filteredData);
  const average = calculateAverage(filteredData);
  const dateRange = getDateRangeString(filteredData, selectedPeriod);

  // Format X-axis labels based on period
  const formatXAxisLabel = (date: Date) => {
    if (selectedPeriod === 'D') {
      return format(date, 'HH:mm');
    }
    if (selectedPeriod === 'W') {
      return format(date, 'EEE');
    }
    if (selectedPeriod === 'M') {
      return format(date, 'd MMM');
    }
    return format(date, 'MMM yyyy');
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={clsx(
            'bg-black/80 backdrop-blur-sm',
            'border border-white/20',
            'rounded-lg',
            'px-3 py-2',
            'text-sm'
          )}
        >
          <p className={clsx('text-white/60 mb-1')}>
            {format(data.date, 'd MMM yyyy HH:mm')}
          </p>
          <p
            className={clsx('font-bold')}
            style={{ color }}
          >
            {formatNumber(data.value)} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className={clsx('text-sm opacity-60')}>
        No data available for the selected period
      </div>
    );
  }

  return (
    <div className={clsx('flex flex-col')}>
      {/* Period Selector */}
      <div className={clsx('flex items-center gap-2 mb-4')}>
        {PERIODS.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={clsx(
              'px-3 py-1',
              'text-xs font-medium',
              'rounded',
              'transition-colors',
              selectedPeriod === period.value
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            )}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Average Value and Date Range */}
      <div className={clsx('mb-4')}>
        <div className={clsx('text-xs uppercase opacity-60 mb-1')}>AVERAGE</div>
        <div className={clsx('flex items-baseline gap-2 mb-1')}>
          <span className={clsx('text-4xl font-bold text-white')}>
            {formatNumber(average)}
          </span>
          <span className={clsx('text-sm opacity-60')}>{unit}</span>
        </div>
        {dateRange && (
          <div className={clsx('text-xs opacity-60')}>{dateRange}</div>
        )}
      </div>

      {/* Chart */}
      <div className={clsx('h-64 md:h-80')}>
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.1)"
              vertical={selectedPeriod === 'W'}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisLabel}
              stroke="rgba(255, 255, 255, 0.4)"
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.4)"
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={yAxisDomain || ['auto', 'auto']}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
