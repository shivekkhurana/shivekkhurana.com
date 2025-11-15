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
      <h2 className="font-bold text-lg mb-6">Health</h2>

      {/* Content */}
      <div className={clsx('opacity-80')}>
        <div className="text-base">
          <p>
            I train for mental balance. Muscle gain, flexibility and joint
            strength is a side effect.
          </p>
          <p className="">
            My fitness journey started as a football player. After school, I
            pursued sports as a hobby, but trained with{' '}
            <a
              href="https://www.nike.com/in/ntc-app"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nike Training Center
            </a>
            . After logging 22k minutes, 690 workouts, and unlocking every
            trophy in the app, I moved to other modalities. My current workout
            strategy comes from{' '}
            <a
              href="https://www.instagram.com/edisondudoit/"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Edison
            </a>{' '}
            and{' '}
            <a
              href="https://www.atgonlinecoaching.com/"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ATG Coaching
            </a>
            .
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
