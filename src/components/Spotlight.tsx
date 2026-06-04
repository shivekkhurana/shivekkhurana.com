import clsx from 'clsx';
import React from 'react';

import Img from '@src/components/Img';
import Location from '@src/components/spotlight/Location';

import type { LocationData } from '@src/domain/location.types';

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

function StateOfBeingContent() {
  return (
    <div className="text-sm leading-5 w-[80%]">
      <p>Health, sleep, location, and personal state data workflows.</p>
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
