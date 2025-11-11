import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { fetchLocationData, getTimezone } from '@src/domain/location';
import type { LocationData, LocationEntry } from '@src/domain/location.types';

// Mock fetch globally
const originalFetch = global.fetch;

describe('fetchLocationData', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = originalFetch;
  });

  afterEach(() => {
    // Restore original fetch after each test
    global.fetch = originalFetch;
  });

  it('should fetch and return location data successfully', async () => {
    const mockLocationData: LocationData = [
      {
        date: '2023-09-12',
        city: 'Paris',
        country: 'France',
      },
      {
        date: '2023-09-14',
        city: 'Lisbon',
        country: 'Portugal',
      },
    ];

    global.fetch = async () => {
      return new Response(JSON.stringify(mockLocationData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const result = await fetchLocationData();

    expect(result).toEqual(mockLocationData);
    expect(result).toHaveLength(2);
    expect(result[0].city).toBe('Paris');
    expect(result[0].country).toBe('France');
    expect(result[0].date).toBe('2023-09-12');
  });

  it('should throw an error when fetch fails', async () => {
    global.fetch = async () => {
      return new Response('Not Found', {
        status: 404,
        statusText: 'Not Found',
      });
    };

    await expect(fetchLocationData()).rejects.toThrow(
      'Failed to fetch location data: 404 Not Found'
    );
  });

  it('should throw an error when network request fails', async () => {
    global.fetch = async () => {
      throw new Error('Network error');
    };

    await expect(fetchLocationData()).rejects.toThrow('Network error');
  });

  it('should handle empty location data array', async () => {
    const mockLocationData: LocationData = [];

    global.fetch = async () => {
      return new Response(JSON.stringify(mockLocationData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const result = await fetchLocationData();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle location data with multiple entries', async () => {
    const mockLocationData: LocationData = [
      {
        date: '2023-09-12',
        city: 'Paris',
        country: 'France',
      },
      {
        date: '2023-09-14',
        city: 'Lisbon',
        country: 'Portugal',
      },
      {
        date: '2024-01-15',
        city: 'Delhi',
        country: 'India',
      },
    ];

    global.fetch = async () => {
      return new Response(JSON.stringify(mockLocationData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const result = await fetchLocationData();

    expect(result).toHaveLength(3);
    expect(result[2].city).toBe('Delhi');
    expect(result[2].country).toBe('India');
  });

  it('should handle 500 server error', async () => {
    global.fetch = async () => {
      return new Response('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    };

    await expect(fetchLocationData()).rejects.toThrow(
      'Failed to fetch location data: 500 Internal Server Error'
    );
  });
});

describe('getTimezone', () => {
  it('should return city data for a valid city and country', () => {
    const location: LocationEntry = {
      date: '2023-09-12',
      city: 'Paris',
      country: 'France',
    };
    const cityData = getTimezone(location);
    expect(cityData).toBeTruthy();
    expect(cityData?.timezone).toBe('Europe/Paris');
    expect(cityData?.iso2).toBe('FR');
    expect(cityData?.country).toBe('France');
  });

  it('should return city data for a valid city with matching country', () => {
    const location: LocationEntry = {
      date: '2023-09-12',
      city: 'London',
      country: 'United Kingdom',
    };
    const cityData = getTimezone(location);
    expect(cityData).toBeTruthy();
    expect(cityData?.timezone).toBe('Europe/London');
    expect(cityData?.iso2).toBe('GB');
  });

  it('should return city data for a valid city even if country case differs', () => {
    const location: LocationEntry = {
      date: '2023-09-12',
      city: 'Paris',
      country: 'france',
    };
    const cityData = getTimezone(location);
    expect(cityData).toBeTruthy();
    expect(cityData?.timezone).toBe('Europe/Paris');
    expect(cityData?.iso2).toBe('FR');
  });

  it('should return city data for a valid city even if city case differs', () => {
    const location: LocationEntry = {
      date: '2023-09-12',
      city: 'paris',
      country: 'France',
    };
    const cityData = getTimezone(location);
    expect(cityData).toBeTruthy();
    expect(cityData?.timezone).toBe('Europe/Paris');
    expect(cityData?.iso2).toBe('FR');
  });

  it('should return city data by country when city is not found', () => {
    // Use a city that likely doesn't exist in the database
    const location: LocationEntry = {
      date: '2023-09-12',
      city: 'NonexistentCity',
      country: 'France',
    };
    const cityData = getTimezone(location);
    // Should fall back to country lookup and return a French city data
    expect(cityData).toBeTruthy();
    expect(cityData?.timezone).toBe('Europe/Paris');
    expect(cityData?.iso2).toBe('FR');
    expect(cityData?.country).toBe('France');
  });

  it('should return city data by country when city is not found for India', () => {
    const location: LocationEntry = {
      date: '2023-09-12',
      city: 'UnknownCity',
      country: 'India',
    };
    const cityData = getTimezone(location);
    // Should fall back to country lookup and return an Indian city data
    expect(cityData).toBeTruthy();
    expect(cityData?.timezone).toMatch(/^Asia\//);
    expect(cityData?.iso2).toBe('IN');
    expect(cityData?.country).toBe('India');
  });

  it('should return city data by country when city is not found for United States', () => {
    const location: LocationEntry = {
      date: '2023-09-12',
      city: 'FakeCity',
      country: 'United States of America',
    };
    const cityData = getTimezone(location);
    // Should fall back to country lookup
    expect(cityData).toBeTruthy();
    expect(cityData?.timezone).toMatch(/^America\//);
    expect(cityData?.iso2).toBe('US');
  });

  it('should return null for invalid city and invalid country', () => {
    const location: LocationEntry = {
      date: '2023-09-12',
      city: 'InvalidCity123',
      country: 'InvalidCountry456',
    };
    const cityData = getTimezone(location);
    expect(cityData).toBeNull();
  });

  it('should handle cities with multiple matches and prefer country match', () => {
    // Some cities exist in multiple countries (e.g., "Springfield")
    // The function should prefer the one matching the country
    const location: LocationEntry = {
      date: '2023-09-12',
      city: 'Springfield',
      country: 'United States of America',
    };
    const cityData = getTimezone(location);
    expect(cityData).toBeTruthy();
    expect(cityData?.timezone).toMatch(/^America\//);
    expect(cityData?.iso2).toBe('US');
  });

  it('should return city data for Delhi, India', () => {
    const location: LocationEntry = {
      date: '2023-09-12',
      city: 'Delhi',
      country: 'India',
    };
    const cityData = getTimezone(location);
    expect(cityData).toBeTruthy();
    expect(cityData?.timezone).toMatch(/^Asia\//);
    expect(cityData?.iso2).toBe('IN');
    expect(cityData?.country).toBe('India');
  });

  it('should return city data for Lisbon, Portugal', () => {
    const location: LocationEntry = {
      date: '2023-09-12',
      city: 'Lisbon',
      country: 'Portugal',
    };
    const cityData = getTimezone(location);
    expect(cityData).toBeTruthy();
    expect(cityData?.timezone).toBe('Europe/Lisbon');
    expect(cityData?.iso2).toBe('PT');
    expect(cityData?.country).toBe('Portugal');
  });

  it('should handle empty city string by falling back to country', () => {
    const location: LocationEntry = {
      date: '2023-09-12',
      city: '',
      country: 'France',
    };
    const cityData = getTimezone(location);
    expect(cityData).toBeTruthy();
    expect(cityData?.timezone).toBe('Europe/Paris');
    expect(cityData?.iso2).toBe('FR');
    expect(cityData?.country).toBe('France');
  });

  it('should handle empty country string', () => {
    // If country is empty, city lookup might still work
    const location: LocationEntry = {
      date: '2023-09-12',
      city: 'Paris',
      country: '',
    };
    const cityData = getTimezone(location);
    // Should still find Paris by city name
    expect(cityData).toBeTruthy();
    expect(cityData?.timezone).toBeTruthy();
  });
});
