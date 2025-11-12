import clsx from 'clsx';
import React from 'react';
import * as Flags from 'country-flag-icons/react/3x2';

import { getLastLocationAndTime } from '@src/domain/location';
import type { LocationData } from '@src/domain/location.types';

/**
 * Render country flag component based on ISO code
 */
function CountryFlag({
  countryCode,
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

  return <FlagComponent className={'w-5 h-4 rounded-sm '} />;
}

/**
 * Truncate city name to fit in small card
 */
function truncateCityName(city: string, maxLength: number = 10): string {
  if (city.length <= maxLength) {
    return city;
  }
  return city.slice(0, maxLength) + '...';
}

/**
 * Truncate country name to fit in small card
 */
function truncateCountryName(country: string, maxLength: number = 12): string {
  if (country.length <= maxLength) {
    return country;
  }
  return country.slice(0, maxLength) + '...';
}

type LocationPinProps = {
  locationData: LocationData;
  className?: string;
  color?: string; // Base color for gradient (defaults to blue)
};

export default function LocationPin({
  locationData,
  className,
  color = '#3B82F6', // Default blue color for location
}: LocationPinProps) {
  const lastLocationInfo = getLastLocationAndTime(locationData);
  const { location, timeAndOffset, cityData } = lastLocationInfo!;
  const countryCode = cityData?.iso2 || null;
  const timezone = timeAndOffset.length > 0 ? timeAndOffset[2] : 'N/A';

  return (
    <div
      className={clsx(
        className,
        'w-24 h-24',
        'relative flex flex-col',
        'px-2 pt-2 pb-2',
        'rounded-lg overflow-hidden',
        'bg-gradient-to-br',
        'from-[#F5F5DC] to-[#DEB887]',
        'hover:from-[#D2B48C] hover:to-[#BC9A6A]',
        'cursor-pointer'
      )}
    >
      {/* Top section: City (title) */}
      <div className="flex flex-col items-start mb-1">
        <span className="text-xs font-medium text-[#5C4033]">
          {truncateCityName(location.city)}
        </span>
        <span className="text-[10px] opacity-70">
          {truncateCountryName(location.country)}
        </span>
      </div>

      {/* Spacer to push content to bottom */}
      <div className="flex-1" />

      {/* Bottom section: Timezone (left) and Country flag (right) */}
      <div className="flex justify-between items-end">
        <span className="text-[10px] opacity-70">{timezone}</span>
        {countryCode && <CountryFlag countryCode={countryCode} />}
      </div>
    </div>
  );
}
