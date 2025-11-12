import clsx from 'clsx';
import type { HealthMetricData } from '@src/domain/healthkit.types';
import type { WorkoutStats } from '@src/domain/workouts';
import config from '@src/config';
import UnoTimeSeriesSnapshot from '@src/components/healthkit/UnoTimeSeriesSnapshot';
import LinearProgress from '@src/components/healthkit/LinearProgress';

export type UnoTimeSeriesMetricConfig = {
  title: string;
  unit: string;
  color: string;
  endpoint: string;
};

export const unoTimeSeriesMetrics: Record<string, UnoTimeSeriesMetricConfig> = {
  restingHeartRate: {
    title: 'RHR',
    unit: 'BPM',
    color: config.colors.healthkit.restingHeartRate,
    endpoint: 'restingHeartRate',
  },
  hrv: {
    title: 'HRV',
    unit: 'ms',
    color: config.colors.healthkit.hrv,
    endpoint: 'hrv',
  },
  bodySurfaceTemp: {
    title: 'Temp',
    unit: '°C',
    color: config.colors.healthkit.bodySurfaceTemp,
    endpoint: 'bodySurfaceTemp',
  },
};

type SnapshotProps = {
  rhrData: HealthMetricData;
  hrvData: HealthMetricData;
  bodyTempData: HealthMetricData;
  workoutStats?: WorkoutStats;
};

export default function Snapshot({
  rhrData,
  hrvData,
  bodyTempData,
  workoutStats,
}: SnapshotProps) {
  // Calculate show-up rate for workouts
  const workoutShowUpRate =
    workoutStats?.latest && workoutStats.weekdaysPassed > 0
      ? (
          (workoutStats.latest.count / workoutStats.weekdaysPassed) *
          100
        ).toFixed(0) + '%'
      : undefined;

  return (
    <div className={clsx('flex flex-row gap-1.5 items-center')}>
      {workoutStats && workoutStats.latest && (
        <LinearProgress
          color={config.colors.healthkit.workouts}
          label="Workouts"
          month={workoutStats.currentMonth}
          lowestValue={0}
          targetValue={workoutStats.weekdays}
          currentValue={workoutStats.latest.count}
          className="w-24 h-24"
          showUpRate={workoutShowUpRate}
        />
      )}
      <UnoTimeSeriesSnapshot
        data={rhrData}
        title={unoTimeSeriesMetrics.restingHeartRate.title}
        unit={unoTimeSeriesMetrics.restingHeartRate.unit}
        color={unoTimeSeriesMetrics.restingHeartRate.color}
        className="w-24 h-24"
      />
      <UnoTimeSeriesSnapshot
        data={hrvData}
        title={unoTimeSeriesMetrics.hrv.title}
        unit={unoTimeSeriesMetrics.hrv.unit}
        color={unoTimeSeriesMetrics.hrv.color}
        className="w-24 h-24"
      />
      <UnoTimeSeriesSnapshot
        data={bodyTempData}
        title={unoTimeSeriesMetrics.bodySurfaceTemp.title}
        unit={unoTimeSeriesMetrics.bodySurfaceTemp.unit}
        color={unoTimeSeriesMetrics.bodySurfaceTemp.color}
        className="w-24 h-24"
      />
    </div>
  );
}
