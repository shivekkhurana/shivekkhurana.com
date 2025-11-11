import clsx from 'clsx';
import React, { type PropsWithChildren } from 'react';
import * as Flags from 'country-flag-icons/react/3x2';

import { getLastLocationAndTime, getTimezone } from '@src/domain/location';
import type { LocationEntry, LocationData } from '@src/domain/location.types';
import { convertDateString } from '@src/utils/time';

/**
 * Truncate city name to 12 characters with ellipses if longer
 */
function truncateCityName(city: string): string {
  if (city.length <= 12) {
    return city;
  }
  return city.slice(0, 12) + '...';
}

/**
 * Render country flag component based on ISO code
 */
function CountryFlag({
  countryCode,
  size = 'small',
}: {
  countryCode: string | null;
  size?: 'small' | 'large';
}) {
  if (!countryCode) {
    return null;
  }

  // Convert to uppercase for component name
  const FlagComponent = (Flags as Record<string, React.ComponentType<any>>)[
    countryCode.toUpperCase()
  ];

  if (!FlagComponent) {
    return null;
  }

  const className =
    size === 'large'
      ? 'w-8 h-6 rounded-md saturate-[1] '
      : 'w-5 h-4 rounded-sm saturate-[0.8] ';

  return <FlagComponent className={className} />;
}

function LocationLog(props: PropsWithChildren<{ location: LocationEntry }>) {
  const { date, city, country } = props.location;
  const cityData = getTimezone(props.location);
  const countryCode = cityData?.iso2 || null;

  return (
    <div className={clsx('flex items-center', 'text-sm')}>
      <div
        className={clsx('text-xs opacity-60', 'w-[24%] sm:w-[16%] md:w-[32%]')}
      >
        {convertDateString(date || '')}
      </div>
      <div className="mr-2 flex items-center">
        <CountryFlag countryCode={countryCode} />
      </div>
      <div className={clsx('', 'flex flex-grow items-center')}>
        {truncateCityName(city)}{' '}
        <span className="opacity-60 text-xs pl-1">{country}</span>
      </div>
    </div>
  );
}

function Location(props: { locationData: LocationData }) {
  const { locationData } = props;
  const lastLocationInfo = getLastLocationAndTime(locationData);

  if (!lastLocationInfo || locationData.length === 0) {
    return (
      <div>
        <p className={clsx('text-3xl font-bold')}>No location data</p>
      </div>
    );
  }

  const { location, timeAndOffset, cityData } = lastLocationInfo;
  const currentYear = new Date().getFullYear();
  const locationsThisYear = locationData.filter((loc) => {
    const year = new Date(loc.date).getFullYear();
    return year === currentYear;
  });

  const currentCountryCode = cityData?.iso2 || null;

  return (
    <div>
      <div className={clsx('flex items-center gap-2')}>
        {currentCountryCode && (
          <CountryFlag
            countryCode={currentCountryCode}
            size="large"
          />
        )}
        <p className={clsx('text-3xl font-bold')}>
          {truncateCityName(location.city)}
        </p>
      </div>
      {timeAndOffset.length > 0 && (
        <p className="">Timezone is {timeAndOffset[2]}</p>
      )}
      <p className="text-sm mt-4 font-bold">Recent locations</p>
      {locationsThisYear
        .slice()
        .reverse()
        .map((loc) => (
          <LocationLog
            key={`${loc.date}-${loc.city}`}
            location={loc}
          />
        ))}
    </div>
  );
}

export default Location;
