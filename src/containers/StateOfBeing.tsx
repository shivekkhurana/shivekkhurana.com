import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

import { getMonthName } from '@src/utils/time';
import FrappeChart from '@src/components/FrappeChart';
import UnoTimeSeriesExplorer from '@src/components/healthkit/UnoTimeSeriesExplorer';
import type { WorkoutStats } from '@src/domain/workouts';
import type { MeditationAggregates } from '@src/domain/meditations';
import type { SleepAggregates } from '@src/domain/sleep';
import type { HealthMetricData } from '@src/domain/healthkit.types';

function MeasurmentUnit({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col">
      <div className="text-xs uppercase">{label}</div>
      <div className={clsx('text-xl')}>
        {typeof value === 'number' ? value.toFixed(0) : value || 0}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className={'mb-6'}>
      <h2 className={clsx('text-md', 'bold')}>{title}</h2>
      <p className="text-xs mb-4 opacity-60">{description}</p>
    </div>
  );
}

function CurrentMonthWorkoutGlance(
  props: PropsWithChildren<{ workoutStats: WorkoutStats }>
) {
  const { latest, currentMonth, weekdays, weekdaysPassed } = props.workoutStats;
  const currentMonthName = getMonthName(currentMonth);

  return (
    <div className={clsx('flex', '')}>
      <div className={clsx('flex justify-between w-full')}>
        <MeasurmentUnit
          label={'Month'}
          value={currentMonthName}
        />
        <MeasurmentUnit
          label={'Target'}
          value={weekdays}
        />
        <MeasurmentUnit
          label={'Completed'}
          value={latest?.count}
        />
        <MeasurmentUnit
          label={'Show up %'}
          value={latest?.showUpRate}
        />
      </div>
    </div>
  );
}

function WorkoutCountBarChartByMonth(
  props: PropsWithChildren<{ workoutStats: WorkoutStats }>
) {
  const { byYearMonth, currentYear } = props.workoutStats;
  const thisYear = byYearMonth[currentYear];
  const monthlyCounts = Object.entries(thisYear).map(([, { count }]) => count);
  const monthlyTargets = Object.entries(thisYear).map(
    ([, { target }]) => target
  );
  const monthlyShowUpRates = Object.entries(thisYear).map(
    ([, { showUpRate }]) => parseInt(showUpRate)
  );

  return (
    <div className="border mt-4 rounded h-[240px]">
      <FrappeChart
        title={`${currentYear}`}
        animate={0}
        colors={['#8cd187', '#FFC2CE', '#bab7ea']}
        axisOptions={{ xAxisMode: 'tick', xIsSeries: 1 }}
        height={250}
        data={{
          labels: Object.entries(thisYear).map(([m]) => getMonthName(m)),
          datasets: [
            { name: 'Completed', values: monthlyCounts, chartType: 'bar' },
            { name: 'Target', values: monthlyTargets, chartType: 'bar' },
            {
              name: 'Show up %',
              values: monthlyShowUpRates,
              chartType: 'line',
            },
          ],
        }}
      />
    </div>
  );
}

function WorkoutsCard(
  props: PropsWithChildren<{ workoutStats: WorkoutStats }>
) {
  return (
    <div className={clsx('w-full')}>
      <SectionHeader
        title={'Workouts'}
        description={
          'I target to workout 5 times a week. This graph shows how many times I showed up to the gym.'
        }
      />

      <CurrentMonthWorkoutGlance workoutStats={props.workoutStats} />
      <WorkoutCountBarChartByMonth workoutStats={props.workoutStats} />
    </div>
  );
}

function CurrentMonthSleepGlance(
  props: PropsWithChildren<{ sleepAggregates: SleepAggregates }>
) {
  const { latest, currentMonth } = props.sleepAggregates;
  const currentMonthName = getMonthName(currentMonth);

  return (
    <div className={clsx('flex', '')}>
      <div className={clsx('flex justify-between w-full')}>
        <MeasurmentUnit
          label={'Month'}
          value={currentMonthName}
        />
        <MeasurmentUnit
          label={'Sleep Index'}
          value={latest?.sleepIndex || 0}
        />
        <MeasurmentUnit
          label={'Recovery Index'}
          value={latest?.recoveryIndex}
        />
        <MeasurmentUnit
          label={'HR Drop'}
          value={latest?.contributorAverages['HR Drop'] || 'Missing'}
        />
        <MeasurmentUnit
          label={'Timing'}
          value={latest?.contributorAverages.Timing || 'Missing'}
        />
      </div>
    </div>
  );
}

function SleepAndRecoveryBarChartByMonth(
  props: PropsWithChildren<{ sleepAggregates: SleepAggregates }>
) {
  const { currentYear } = props.sleepAggregates;
  const thisYear = props.sleepAggregates[currentYear];

  const monthlySleep = Object.entries(thisYear).map(
    ([, { sleepIndex }]) => sleepIndex
  );
  const monthlyHRDrop = Object.entries(thisYear)
    .map(([, { contributorAverages }]) => contributorAverages['HR Drop'] || 0)
    .map(Math.ceil);
  const monthlyTiming = Object.entries(thisYear)
    .map(([, { contributorAverages }]) => contributorAverages.Timing || 0)
    .map(Math.ceil);

  return (
    <div className="border mt-4 rounded h-[240px]">
      <FrappeChart
        title={`${currentYear} - Sleep Markers`}
        animate={0}
        colors={['#8cd187', '#FFC2CE', '#bab7ea', '#cbe1e9']}
        axisOptions={{ xAxisMode: 'tick', xIsSeries: 1 }}
        height={250}
        data={{
          labels: Object.entries(thisYear).map(([m]) => getMonthName(m)),
          datasets: [
            { name: 'Sleep', values: monthlySleep, chartType: 'line' },
            { name: 'HR Drop', values: monthlyHRDrop, chartType: 'bar' },
            { name: 'Timing', values: monthlyTiming, chartType: 'bar' },
          ],
        }}
      />
    </div>
  );
}

function Sleep(
  props: PropsWithChildren<{
    sleepAggregates: SleepAggregates;
    className?: string;
  }>
) {
  return (
    <div className={clsx('w-full', props.className)}>
      <SectionHeader
        title={'Sleep'}
        description={
          'Measured using Ultrahuman R1. This graph shows my quality of sleep and helps me figure out if my stress levels are out of order.'
        }
      />

      <CurrentMonthSleepGlance sleepAggregates={props.sleepAggregates} />
      <SleepAndRecoveryBarChartByMonth
        sleepAggregates={props.sleepAggregates}
      />
    </div>
  );
}

function CurrentMonthHealthGlance(
  props: PropsWithChildren<{ sleepAggregates: SleepAggregates }>
) {
  const { latest, currentMonth } = props.sleepAggregates;
  const currentMonthName = getMonthName(currentMonth);

  return (
    <div className={clsx('flex', '')}>
      <div className={clsx('flex justify-between w-full')}>
        <MeasurmentUnit
          label={'Month'}
          value={currentMonthName}
        />
        <MeasurmentUnit
          label={'Resting HR'}
          value={latest?.contributorAverages['Resting Heart Rate'] || 'Missing'}
        />
        <MeasurmentUnit
          label={'HRV form'}
          value={latest?.contributorAverages['HRV Form'] || 'Missing'}
        />
        <MeasurmentUnit
          label={'Temperature'}
          value={latest?.contributorAverages.Temperature || 'Missing'}
        />
        <MeasurmentUnit
          label={'Restorative Sleep'}
          value={latest?.contributorAverages['Restorative Sleep'] || 'Missing'}
        />
      </div>
    </div>
  );
}

function HealthBarChartByMonth(
  props: PropsWithChildren<{ sleepAggregates: SleepAggregates }>
) {
  const { currentYear } = props.sleepAggregates;
  const thisYear = props.sleepAggregates[currentYear];

  const restingHR = Object.entries(thisYear)
    .map(
      ([, { contributorAverages }]) =>
        contributorAverages['Resting Heart Rate'] || 0
    )
    .map(Math.ceil);
  const hrvForm = Object.entries(thisYear)
    .map(([, { contributorAverages }]) => contributorAverages['HRV Form'] || 0)
    .map(Math.ceil);
  const temp = Object.entries(thisYear)
    .map(([, { contributorAverages }]) => contributorAverages.Temperature || 0)
    .map(Math.ceil);
  const restorativeSleep = Object.entries(thisYear)
    .map(
      ([, { contributorAverages }]) =>
        contributorAverages['Restorative Sleep'] || 0
    )
    .map(Math.ceil);

  return (
    <div className="border mt-4 rounded h-[240px]">
      <FrappeChart
        title={`${currentYear} - Health Markers`}
        animate={0}
        colors={['#8cd187', '#FFC2CE', '#bab7ea', '#cbe1e9']}
        axisOptions={{ xAxisMode: 'tick', xIsSeries: 1 }}
        height={250}
        data={{
          labels: Object.entries(thisYear).map(([m]) => getMonthName(m)),
          datasets: [
            {
              name: 'Resting Heart Rate',
              values: restingHR,
              chartType: 'line',
            },
            { name: 'HRV', values: hrvForm, chartType: 'bar' },
            { name: 'Temperature', values: temp, chartType: 'bar' },
            {
              name: 'Restorative Sleep',
              values: restorativeSleep,
              chartType: 'bar',
            },
          ],
        }}
      />
    </div>
  );
}

function Health(
  props: PropsWithChildren<{
    sleepAggregates: SleepAggregates;
    className?: string;
  }>
) {
  return (
    <div className={clsx('w-full', props.className)}>
      <SectionHeader
        title={'Health'}
        description={
          'Key markers to track my physical health. Scores out of 100.'
        }
      />

      <CurrentMonthHealthGlance sleepAggregates={props.sleepAggregates} />
      <HealthBarChartByMonth sleepAggregates={props.sleepAggregates} />
    </div>
  );
}

function TimeSeriesExplorer(
  props: PropsWithChildren<{
    rhrData: HealthMetricData;
    hrvData: HealthMetricData;
    bodyTempData: HealthMetricData;
    className?: string;
  }>
) {
  return (
    <div className={clsx('w-full', props.className)}>
      <SectionHeader
        title={'Time Series Explorer'}
        description={
          'Detailed time series data for HRV, Resting Heart Rate, and Body Surface Temperature. Use the period selector to view different time ranges.'
        }
      />

      <div className={clsx('space-y-12')}>
        <div>
          <h3 className={clsx('text-sm font-medium mb-4 text-white')}>
            HRV (Heart Rate Variability)
          </h3>
          <UnoTimeSeriesExplorer
            data={props.hrvData}
            title="HRV"
            unit="ms"
            color="#8cd187"
          />
        </div>

        <div>
          <h3 className={clsx('text-sm font-medium mb-4 text-white')}>
            Resting Heart Rate
          </h3>
          <UnoTimeSeriesExplorer
            data={props.rhrData}
            title="Resting Heart Rate"
            unit="bpm"
            color="#FFC2CE"
          />
        </div>

        <div>
          <h3 className={clsx('text-sm font-medium mb-4 text-white')}>
            Body Surface Temperature
          </h3>
          <UnoTimeSeriesExplorer
            data={props.bodyTempData}
            title="Body Surface Temperature"
            unit="°C"
            color="#bab7ea"
          />
        </div>
      </div>
    </div>
  );
}

function StateOfBeing(
  props: PropsWithChildren<{
    workoutStats: WorkoutStats;
    meditationAggregates: MeditationAggregates;
    sleepAggregates: SleepAggregates;
    rhrData: HealthMetricData;
    hrvData: HealthMetricData;
    bodyTempData: HealthMetricData;
  }>
) {
  return (
    <div className={clsx('w-11/12 mx-auto lg:w-8/12 xl:w-6/12', '')}>
      <WorkoutsCard workoutStats={props.workoutStats} />
      <Sleep
        sleepAggregates={props.sleepAggregates}
        className={'mt-12'}
      />
      <Health
        sleepAggregates={props.sleepAggregates}
        className={'mt-12'}
      />

      <div className={clsx('mt-12 bg-black rounded-lg p-4')}>
        <TimeSeriesExplorer
          rhrData={props.rhrData}
          hrvData={props.hrvData}
          bodyTempData={props.bodyTempData}
        />
      </div>
    </div>
  );
}

export default StateOfBeing;
