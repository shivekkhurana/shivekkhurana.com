import clsx from 'clsx';
import type { HealthMetricData, SleepData } from '@src/domain/healthkit.types';
import type { WorkoutStats } from '@src/domain/workouts';
import type { LocationData } from '@src/domain/location.types';
import Snapshot from '@src/components/healthkit/Snapshot';

type NavProps = {
  rhrData: HealthMetricData;
  hrvData: HealthMetricData;
  bodyTempData: HealthMetricData;
  workoutStats: WorkoutStats;
  locationData: LocationData;
  lastSleepData: SleepData;
};

function Nav({
  rhrData,
  hrvData,
  bodyTempData,
  workoutStats,
  locationData,
  lastSleepData,
}: NavProps) {
  return (
    <nav
      className={clsx(
        'sticky top-0 z-50',
        'w-full',
        'px-4 py-3',
        'backdrop-blur-md bg-white/70',
        'border-b border-gray-200/50',
        'flex items-center justify-between',
        'gap-4'
      )}
    >
      {/* Name on the left */}
      <div className="flex items-center">
        <a
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="font-medium">Shivek Khurana</span>
          <img
            src={'/img/logo.svg'}
            alt="Krim Labs Logo Purple"
            className="h-4"
          />
        </a>
      </div>

      {/* Links and Snapshot on the right */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Navigation links */}
        <div className="flex items-center gap-4 md:gap-6"></div>

        {/* Snapshot on the rightmost */}
        {rhrData && hrvData && bodyTempData && (
          <div className="flex items-center hidden md:flex">
            <Snapshot
              rhrData={rhrData}
              hrvData={hrvData}
              bodyTempData={bodyTempData}
              workoutStats={workoutStats}
              locationData={locationData}
              lastSleepData={lastSleepData}
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
