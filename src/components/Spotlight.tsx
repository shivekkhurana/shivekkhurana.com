import clsx from 'clsx';
import React from 'react';

import { fetchWorkoutStats } from '@src/domain/workouts';
import { fetchMeditationAggregates } from '@src/domain/meditations';
import { fetchSleepAggregates } from '@src/domain/sleep';
import Img from '@src/components/Img';
import StateItem, {
  BoltIcon,
  HeartIcon,
  TimeIcon,
  EyeIcon,
  SpaceIcon,
  FireIcon,
} from '@src/components/StateItem';
import Projects from '@src/components/spotlight/Projects';
import Location from '@src/components/spotlight/Location';

import type { WorkoutStats } from '@src/domain/workouts';
import type { StateItemProps } from '@src/components/StateItem';
import type { LocationData } from '@src/domain/location.types';

const workoutStats = await fetchWorkoutStats();
const meditationAggregates = await fetchMeditationAggregates();
const sleepAggregates = await fetchSleepAggregates();

function daysUntilNovember2072(): string {
  const currentDate: Date = new Date();
  const november2072: Date = new Date(2072, 10, 1); // November is represented by 10 since months are zero-indexed

  const millisecondsInDay: number = 1000 * 60 * 60 * 24;
  const differenceInTime: number =
    november2072.getTime() - currentDate.getTime();

  const daysLeft: number = Math.floor(differenceInTime / millisecondsInDay);

  if (daysLeft >= 1000) {
    return Math.ceil(daysLeft / 1000) + 'k';
  } else {
    return daysLeft.toString();
  }
}

type SpotlightBaseCardProps = {
  bgColorClass: string;
  title: string;
  contentComponent: React.ComponentType<any>;
  icon: string;
  smallHeading?: boolean;
  ctaArrow?: 'out' | 'right';
  ctaLabel?: string;
  ctaLink?: string;
  ctaColorClass?: string;
  textColorClass?: string | '';
};

function SpotlightCta(props: SpotlightBaseCardProps) {
  return (
    <a
      href={props.ctaLink || '#'}
      target={
        props.ctaLink && props.ctaLink.startsWith('https://') ? '_blank' : ''
      }
    >
      <div
        className={clsx(
          props.ctaColorClass,
          'font-bold text-xl',
          'mt-3',
          'flex items-center',
          'hover:animate-pulse active:pt-1'
        )}
      >
        <div>{props.ctaLabel}</div>
        <div className="ml-1">
          {props.ctaArrow === 'right' && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          )}
          {props.ctaArrow === 'out' && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          )}
        </div>
      </div>
    </a>
  );
}

function SpotlightBaseCard(props: SpotlightBaseCardProps) {
  const Content = props.contentComponent;
  return (
    <div
      className={clsx(
        'bg-gradient-to-b',
        'rounded-xl',
        'flex flex-col',
        'py-3 px-4 mb-4',
        props.bgColorClass,
        props.textColorClass
      )}
    >
      <div className="flex justify-end">
        <Img
          path={props.icon}
          alt={`${props.title} icon`}
          className={clsx(
            'mr-[-8%] sm:mr-[-6%] md:mr-[-24%] mb-[-48%]',
            'h-[48px] w-[48px] md:h-[96px] md:w-[96px]'
          )}
        />
      </div>

      <h2
        className={clsx('text-2xl font-bold mb-3', {
          'text-sm mb-[4px]': props.smallHeading,
        })}
      >
        {props.title}
      </h2>
      <div>{Content && <Content />}</div>
      {props.ctaLabel && <SpotlightCta {...props} />}
    </div>
  );
}

function OpenMeetContent() {
  return (
    <div className="text-sm leading-5 w-[80%]">
      <p>Meeting strangers increases the surface area for luck to land on.</p>
      <p className="mt-2">
        If you find anything I do interesting, we should meet. 30 minutes.
        Preferably in person.
      </p>
    </div>
  );
}

const txfmStatsFactory = ({
  workoutStats,
  currentDay,
  numObservations,
  meditationEfficiency,
  showUpRate,
}: {
  workoutStats: WorkoutStats;
  currentDay: number;
  numObservations: number;
  showUpRate: string;
  meditationEfficiency: string;
}): StateItemProps[] => {
  const workoutShowUpRate =
    ((workoutStats?.latest?.count / workoutStats.weekdaysPassed) * 100).toFixed(
      0
    ) + '%';

  const meditationStats = meditationAggregates.latestForDashboard.stats;

  const awarenessShowUpRate =
    (
      (meditationStats.numObservations * 100) /
      (meditationAggregates.latestForDashboard.currentDay *
        meditationAggregates.latestForDashboard.targetObservationsPerDay)
    ).toFixed(0) + '%';

  return [
    {
      id: 'Workout',
      icon: BoltIcon,
      description: `Monthly goal of working out on every weekday. ${workoutShowUpRate} show up rate so far.`,
      descriptor: '%',
      itemType: 'bar',
      barProps: {
        target: workoutStats?.latest?.target,
        current: workoutStats?.latest?.count,
        showUpRate: workoutShowUpRate,
      },
    },
  ];
};

function StateOfBeingContent() {
  const { meditationEfficiency, showUpRate, numObservations } =
    meditationAggregates.latestForDashboard.stats;
  const { currentDay } = meditationAggregates.latestForDashboard;
  const txfmStats = txfmStatsFactory({
    workoutStats,
    currentDay,
    numObservations,
    meditationEfficiency,
    showUpRate,
  });
  return (
    <div className={clsx('grid grid-cols-1 gap-4')}>
      {txfmStats.map((s) => {
        return (
          <div key={s.id}>
            <StateItem {...s} />
          </div>
        );
      })}
    </div>
  );
}

function ClojureCourseContent() {
  return (
    <div className="w-[80%] md:w-[90%]">
      <p className={clsx('text-2xl font-bold', 'mt-2')}>
        Tinycanva - Clojure for React Developers
      </p>
    </div>
  );
}

function LocationContent(props: { locationData: LocationData }) {
  return <Location locationData={props.locationData} />;
}

function getSpotlightItems(
  locationData: LocationData
): Record<string, SpotlightBaseCardProps> {
  return {
    projects: {
      title: 'Projects',
      icon: '/img/spotlightIcons/workbot.png',
      contentComponent: Projects,
      bgColorClass: 'from-[#D4F4D4] to-[#C8E6C8]',
      smallHeading: true,
      ctaLabel: 'LinkedIn',
      ctaLink: 'https://www.linkedin.com/in/shivekkhurana/',
      ctaColorClass: 'text-[#3D6520]',
      ctaArrow: 'out',
    },
    stateOfBeing: {
      title: 'State of being',
      contentComponent: StateOfBeingContent,
      icon: '/img/spotlightIcons/orb.png',
      bgColorClass: 'from-[#D9D3FF] to-[#C0B6FC]',
      ctaColorClass: 'text-[#6157A1]',
      ctaArrow: 'right',
    },
    location: {
      title: 'Currently in',
      contentComponent: () => <LocationContent locationData={locationData} />,
      icon: '/img/spotlightIcons/globe.png',
      bgColorClass: 'from-[#D3F4FF] to-[#A8E6FF]',
      smallHeading: true,
    },
  };
}

function Spotlight(props: { locationData: LocationData }) {
  const spotlightItems = getSpotlightItems(props.locationData);
  return (
    <>
      {Object.keys(spotlightItems).map((id: string) => {
        const cardProps: SpotlightBaseCardProps = spotlightItems[id];
        return (
          <SpotlightBaseCard
            key={id}
            {...cardProps}
          />
        );
      })}
    </>
  );
}

export default Spotlight;
