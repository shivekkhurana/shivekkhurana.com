export type LocationEntry = {
  date: string;
  city: string;
  country: string;
};

export type LocationData = LocationEntry[];

export type CityData = {
  city: string;
  city_ascii: string;
  lat: number;
  lng: number;
  pop: number;
  country: string;
  iso2: string;
  iso3: string;
  province: string;
  timezone: string;
};
