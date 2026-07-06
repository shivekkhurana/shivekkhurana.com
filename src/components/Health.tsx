import clsx from 'clsx';
import type { HealthMetricData, SleepData } from '@src/domain/healthkit.types';
import type { WorkoutStats } from '@src/domain/workouts';
import type { LocationData } from '@src/domain/location.types';
import type { DietLogSummary } from '@src/domain/diet';
import Snapshot from '@src/components/healthkit/Snapshot';

type HealthProps = {
  rhrData: HealthMetricData;
  hrvData: HealthMetricData;
  bodyTempData: HealthMetricData;
  workoutStats?: WorkoutStats;
  locationData?: LocationData;
  lastSleepData: SleepData;
  dietLog?: DietLogSummary | null;
  updatedAt: string;
};

function Health({
  rhrData,
  hrvData,
  bodyTempData,
  workoutStats,
  locationData,
  lastSleepData,
  dietLog,
  updatedAt,
}: HealthProps) {
  return (
    <div className={clsx('mb-16 font-mlm-roman')}>
      {/* Heading */}
      <h2 className="font-bold text-lg mb-6">Health</h2>

      {/* Snapshot inline */}
      <div className="font-sans mb-8">
        <Snapshot
          rhrData={rhrData}
          hrvData={hrvData}
          bodyTempData={bodyTempData}
          workoutStats={workoutStats}
          locationData={locationData}
          lastSleepData={lastSleepData}
          dietLog={dietLog}
        />
      </div>

      {/* Source link */}
      <div className="text-sm opacity-70">
        Health, sleep and location data and workflows are available at{' '}
        <a
          href="https://github.com/krimlabs/state-of-being"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/shivekkhurana/state-of-being
        </a>
        . Last updated at {updatedAt}
      </div>
    </div>
  );
}

export default Health;
