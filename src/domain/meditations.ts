import config from '@src/config';

type Stats = {
  numObservations: number;
  numMeditations: number;
  avgObservationsPerDay: string;
  avgMeditationsPerDay: string;
  meditationsMissedDaysCount: number;
  observationsMissedDayCount: number;
  satButCouldNotMeditateCount: number;
  waterBoiledMeditationsCount: number;
  meditationEfficiency: string;
  showUpRate: string;
};

type FrequencyDistribution = {
  [key: string]: number;
};

type MonthData = {
  month: string | number;
  year: string | number;
  stats: Stats;
  egosObservedFrequencyDistribution: FrequencyDistribution;
  egosInMeditationFrequencyDistribution: FrequencyDistribution;
  underlyingCausesObservedFrequencyDistribution: FrequencyDistribution;
  underlyingCausesMeditatedOnFrequencyDistribution: FrequencyDistribution;
};

type LatestDashboardData = MonthData & {
  currentDay: number;
  currentYear: number;
  currentMonth: number;
  daysInCurrentMonth: number;
  targetObservationsPerDay: number;
};

type YearlyData = {
  [year: string]: {
    [month: string]: MonthData;
  };
};

export type MeditationAggregates = {
  latestForDashboard: LatestDashboardData;
} & YearlyData;

async function fetchMeditationAggregates(): Promise<MeditationAggregates> {
  return await fetch(
    `${config.stateOfBeingPagesBase}${config.vault.meditations}`
  ).then((res) => res.json());
}

export { fetchMeditationAggregates };
