import clsx from 'clsx';
import type { HealthMetricData, SleepData } from '@src/domain/healthkit.types';
import type { WorkoutStats } from '@src/domain/workouts';
import type { LocationData } from '@src/domain/location.types';
import type { DietLogData } from '@src/domain/diet.types';
import config from '@src/config';
import UnoTimeSeriesSnapshot from '@src/components/healthkit/UnoTimeSeriesSnapshot';
import LinearProgress from '@src/components/healthkit/LinearProgress';
import LocationPin from '@src/components/spotlight/LocationPin';
import SleepCard from '@src/components/healthkit/SleepCard';
import CaloriesCard from '@src/components/healthkit/CaloriesCard';
import ProteinCard from '@src/components/healthkit/ProteinCard';

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
  locationData?: LocationData;
  lastSleepData: SleepData;
  dietLogData?: DietLogData | null;
  proteinData?: DietLogData | null;
};

export default function Snapshot({
  rhrData,
  hrvData,
  bodyTempData,
  workoutStats,
  locationData,
  lastSleepData,
  dietLogData,
  proteinData,
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
    <div
      className={clsx(
        'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-1 sm:gap-2 md:gap-3 lg:gap-4 items-center'
      )}
    >
      {locationData && (
        <LocationPin
          locationData={locationData}
          className="w-full aspect-square"
        />
      )}
      {workoutStats && workoutStats.latest && (
        <a
          href="/workouts"
          className="w-full aspect-square"
          aria-label="View workout stats"
        >
          <LinearProgress
            color={config.colors.healthkit.workouts}
            label="Workouts"
            month={workoutStats.currentMonth}
            lowestValue={0}
            targetValue={workoutStats.weekdays}
            currentValue={workoutStats.latest.count}
            className="w-full h-full"
            showUpRate={workoutShowUpRate}
          />
        </a>
      )}
      <a
        href="/sleep"
        className="w-full aspect-square"
        aria-label="View resting heart rate charts"
      >
        <UnoTimeSeriesSnapshot
          data={rhrData}
          title={unoTimeSeriesMetrics.restingHeartRate.title}
          unit={unoTimeSeriesMetrics.restingHeartRate.unit}
          color={unoTimeSeriesMetrics.restingHeartRate.color}
          className="w-full h-full"
        />
      </a>
      <a
        href="/sleep"
        className="w-full aspect-square"
        aria-label="View heart rate variability charts"
      >
        <UnoTimeSeriesSnapshot
          data={hrvData}
          title={unoTimeSeriesMetrics.hrv.title}
          unit={unoTimeSeriesMetrics.hrv.unit}
          color={unoTimeSeriesMetrics.hrv.color}
          className="w-full h-full"
        />
      </a>
      <a
        href="/sleep"
        className="w-full aspect-square"
        aria-label="View body surface temperature charts"
      >
        <UnoTimeSeriesSnapshot
          data={bodyTempData}
          title={unoTimeSeriesMetrics.bodySurfaceTemp.title}
          unit={unoTimeSeriesMetrics.bodySurfaceTemp.unit}
          color={unoTimeSeriesMetrics.bodySurfaceTemp.color}
          className="w-full h-full"
        />
      </a>
      {lastSleepData && (
        <a
          href="/sleep"
          className="w-full aspect-square"
          aria-label="View sleep charts"
        >
          <SleepCard
            lastSleepData={lastSleepData}
            color={config.colors.healthkit.sleep}
            className="w-full h-full"
          />
        </a>
      )}
      {dietLogData && (
        <div
          className="w-full aspect-square"
          aria-label="Latest calorie intake"
        >
          <CaloriesCard
            data={dietLogData}
            color={config.colors.healthkit.calories}
            className="w-full h-full"
          />
        </div>
      )}
      {proteinData && (
        <div
          className="w-full aspect-square"
          aria-label="Latest protein intake"
        >
          <ProteinCard
            data={proteinData}
            color={config.colors.healthkit.protein}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
