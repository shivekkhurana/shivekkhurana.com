import clsx from 'clsx';
import type { HealthMetricData, SleepData } from '@src/domain/healthkit.types';
import type { WorkoutStats } from '@src/domain/workouts';
import type { LocationData } from '@src/domain/location.types';
import Snapshot from '@src/components/healthkit/Snapshot';

type HealthProps = {
  rhrData: HealthMetricData;
  hrvData: HealthMetricData;
  bodyTempData: HealthMetricData;
  workoutStats?: WorkoutStats;
  locationData?: LocationData;
  lastSleepData: SleepData;
};

function Health({
  rhrData,
  hrvData,
  bodyTempData,
  workoutStats,
  locationData,
  lastSleepData,
}: HealthProps) {
  return (
    <div className={clsx('mb-16 font-mlm-roman')}>
      {/* Heading */}
      <h2 className="font-bold text-xl md:text-2xl mb-6">Health</h2>

      {/* Content */}
      <div className={clsx('')}>
        <div className="space-y-1 text-base">
          <p>Gym is my happy place. I train to gain muscle and flexibility.</p>
          <p className="opacity-70">
            Inspired by Bryan Johnson, I track my sleep, heart and workouts with
            the goal of longevity.
          </p>
          <p className="opacity-70">
            I learnt working out with Nike Training Center, Edison and the ATG
            Channel.
          </p>
        </div>

        {/* Snapshot inline */}
        <div className="font-sans my-8">
          <Snapshot
            rhrData={rhrData}
            hrvData={hrvData}
            bodyTempData={bodyTempData}
            workoutStats={workoutStats}
            locationData={locationData}
            lastSleepData={lastSleepData}
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
        </div>
      </div>
    </div>
  );
}

export default Health;
