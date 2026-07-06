import config from "@src/config";

type ContributorAverages = {
  Restfulness?: number;
  "HRV Form"?: number;
  Timing?: number;
  "Restorative Sleep"?: number;
  "HR Drop"?: number;
  Steps?: number;
  "Active Hours"?: number;
  Activity?: number;
  "Workout Frequency"?: number;
  "Sleep Quotient"?: number;
  "Movement Index"?: number;
  Temperature?: number;
  "Sleep Efficiency"?: number;
  "Resting Heart Rate"?: number;
  "Total Sleep"?: number;
  "Temperature Deviation"?: number;
};

type SleepData = {
  sleepIndex: number;
  recoveryIndex: number;
  movementIndex: number;
  sleepTrackerMissingInfo: boolean;
  contributorAverages: ContributorAverages;
};

type YearData = {
  [month: string]: SleepData;
};

type SleepInfo = {
  [year: string]: YearData;
};

type LatestSleepInfo = {
  sleepIndex: number;
  recoveryIndex: number;
  movementIndex: number;
  sleepTrackerMissingInfo: boolean;
  contributorAverages: ContributorAverages;
};

export type SleepAggregates = {
  latest: LatestSleepInfo;
  currentYear: number;
  currentMonth: number;
} & SleepInfo; // Combining all the types to represent the entire structure

async function fetchSleepAggregates(): Promise<SleepAggregates> {
  return await fetch(
    `${config.stateOfBeingPagesBase}${config.vault.sleep}`
  ).then((res) => res.json());
}

export { fetchSleepAggregates };
