import type {
  LocationData,
  LocationEntry,
  CityData,
} from '@src/domain/location.types';
import config from '@src/config';
import cityTimezones from 'city-timezones';

/**
 * Get city data for a given location entry.
 * First tries to look up by city name, then falls back to country lookup.
 *
 * @param location - The location entry containing city and country
 * @returns The CityData object (containing timezone, iso2, etc.) or null if not found
 */
function getTimezone(location: LocationEntry): CityData | null {
  const { city, country } = location;

  // First, try to look up by city name
  const cityResults = cityTimezones.lookupViaCity(city);

  if (cityResults && cityResults.length > 0) {
    // Filter results by country to get the best match
    const matchingCity = cityResults.find(
      (c: CityData) => c.country.toLowerCase() === country.toLowerCase()
    );

    if (matchingCity) {
      return matchingCity;
    }

    // If no exact country match, but we have city results, return the first one
    // (city name match is more specific than country)
    return cityResults[0];
  }

  // If city lookup failed, try to look up by country
  const cityMapping = cityTimezones.cityMapping as CityData[];
  const countryCities = cityMapping.filter(
    (c: CityData) => c.country.toLowerCase() === country.toLowerCase()
  );

  if (countryCities.length > 0) {
    // Return the most populous city in the country
    // (likely to be the capital or major city)
    const mostPopulousCity = countryCities.reduce((max, current) =>
      current.pop > max.pop ? current : max
    );
    return mostPopulousCity;
  }

  // No city data found
  return null;
}

async function fetchLocationData(): Promise<LocationData> {
  const response = await fetch(config.vault.location);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch location data: ${response.status} ${response.statusText}`
    );
  }
  return await response.json();
}

/**
 * Get time in city and offset similar to getTimeInCityAndOffset from content.ts
 */
function getTimeInCityAndOffset(cityData: CityData): string[] {
  const { timezone } = cityData;
  const currentTime = new Date().toLocaleString('en-US', {
    timeZone: timezone,
    hour12: false,
    timeZoneName: 'shortOffset',
  });

  return currentTime
    .split(', ')
    .map((i) => i.split(' ').map((j) => j.trim()))
    .flat();
}

/**
 * Get the last location entry and its timezone info
 */
function getLastLocationAndTime(locationData: LocationData): {
  location: LocationEntry;
  timeAndOffset: string[];
  cityData: CityData | null;
} | null {
  if (locationData.length === 0) {
    return null;
  }

  const lastLocation = locationData[locationData.length - 1];
  const cityData = getTimezone(lastLocation);

  if (!cityData) {
    return {
      location: lastLocation,
      timeAndOffset: [],
      cityData: null,
    };
  }

  return {
    location: lastLocation,
    timeAndOffset: getTimeInCityAndOffset(cityData),
    cityData,
  };
}

export { fetchLocationData, getTimezone, getLastLocationAndTime };
