import type { HealthMetricData, SleepData } from '@src/domain/healthkit.types';
import {
  fetchBodySurfaceTemp,
  fetchHRV,
  fetchRestingHeartRate,
  fetchSleep,
} from '@src/domain/healthkit';

export type DailyMetricPoint = {
  date: string;
  value: number;
};

export type DailySleepPoint = {
  date: string;
  totalSleep: number;
  rem: number;
  deep: number;
  core: number;
};

export type SleepDashboardData = {
  restingHeartRate: DailyMetricPoint[];
  hrv: DailyMetricPoint[];
  bodySurfaceTemp: DailyMetricPoint[];
  sleep: DailySleepPoint[];
};

export type MonthlySleepPoint = Omit<DailySleepPoint, 'date'> & {
  date: string;
};

export const sleepDashboardYears = [2024, 2025, 2026] as const;

const healthDatePattern = /^(\d{4})-(\d{2})-(\d{2})/;

function getCalendarDate(date: string): string {
  const match = healthDatePattern.exec(date);

  if (!match) {
    throw new Error(`Invalid HealthKit date: ${date}`);
  }

  const dateKey = `${match[1]}-${match[2]}-${match[3]}`;
  const parsedDate = new Date(`${dateKey}T00:00:00Z`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== dateKey
  ) {
    throw new Error(`Invalid HealthKit date: ${date}`);
  }

  return dateKey;
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function normalizeDailyMetric(
  data: HealthMetricData
): DailyMetricPoint[] {
  const valuesByDate = new Map<string, number[]>();

  data.metrics.forEach((metric) => {
    if (!Number.isFinite(metric.qty)) {
      throw new Error(`Invalid HealthKit quantity for ${metric.date}`);
    }

    const date = getCalendarDate(metric.date);
    const values = valuesByDate.get(date) ?? [];
    values.push(metric.qty);
    valuesByDate.set(date, values);
  });

  return [...valuesByDate.entries()]
    .map(([date, values]) => ({ date, value: average(values) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function normalizeDailySleep(data: SleepData[]): DailySleepPoint[] {
  const valuesByDate = new Map<string, SleepData[]>();

  data.forEach((entry) => {
    const values = [entry.totalSleep, entry.rem, entry.deep, entry.core];

    if (values.some((value) => !Number.isFinite(value))) {
      throw new Error(`Invalid sleep quantity for ${entry.date}`);
    }

    const stageTotal = entry.rem + entry.deep + entry.core;
    if (Math.abs(stageTotal - entry.totalSleep) > 0.01) {
      throw new Error(
        `Sleep stages do not match total sleep for ${entry.date}`
      );
    }

    const date = getCalendarDate(entry.date);
    const entries = valuesByDate.get(date) ?? [];
    entries.push(entry);
    valuesByDate.set(date, entries);
  });

  return [...valuesByDate.entries()]
    .map(([date, entries]) => ({
      date,
      totalSleep: average(entries.map((entry) => entry.totalSleep)),
      rem: average(entries.map((entry) => entry.rem)),
      deep: average(entries.map((entry) => entry.deep)),
      core: average(entries.map((entry) => entry.core)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function calculateMonthlyMetricAverages(
  data: DailyMetricPoint[]
): DailyMetricPoint[] {
  const valuesByMonth = new Map<string, number[]>();

  data.forEach((entry) => {
    const month = entry.date.slice(0, 7);
    const values = valuesByMonth.get(month) ?? [];
    values.push(entry.value);
    valuesByMonth.set(month, values);
  });

  return [...valuesByMonth.entries()].map(([month, values]) => ({
    date: `${month}-15`,
    value: average(values),
  }));
}

export function calculateMonthlySleepAverages(
  data: DailySleepPoint[]
): MonthlySleepPoint[] {
  const valuesByMonth = new Map<string, DailySleepPoint[]>();

  data.forEach((entry) => {
    const month = entry.date.slice(0, 7);
    const values = valuesByMonth.get(month) ?? [];
    values.push(entry);
    valuesByMonth.set(month, values);
  });

  return [...valuesByMonth.entries()].map(([month, values]) => ({
    date: `${month}-15`,
    totalSleep: average(values.map((entry) => entry.totalSleep)),
    rem: average(values.map((entry) => entry.rem)),
    deep: average(values.map((entry) => entry.deep)),
    core: average(values.map((entry) => entry.core)),
  }));
}

export function buildSleepDashboardData(
  restingHeartRate: HealthMetricData,
  hrv: HealthMetricData,
  bodySurfaceTemp: HealthMetricData,
  sleepData: SleepData[]
): SleepDashboardData {
  const sleep = normalizeDailySleep(sleepData);

  return {
    restingHeartRate: normalizeDailyMetric(restingHeartRate),
    hrv: normalizeDailyMetric(hrv),
    bodySurfaceTemp: normalizeDailyMetric(bodySurfaceTemp),
    sleep,
  };
}

export function filterSleepDashboardDataByYear(
  data: SleepDashboardData,
  year: number
): SleepDashboardData {
  const yearPrefix = `${year}-`;
  const sleep = data.sleep.filter((entry) => entry.date.startsWith(yearPrefix));

  return {
    restingHeartRate: data.restingHeartRate.filter((entry) =>
      entry.date.startsWith(yearPrefix)
    ),
    hrv: data.hrv.filter((entry) => entry.date.startsWith(yearPrefix)),
    bodySurfaceTemp: data.bodySurfaceTemp.filter((entry) =>
      entry.date.startsWith(yearPrefix)
    ),
    sleep,
  };
}

export function getLatestSleepDashboardYear(
  data: SleepDashboardData
): number | null {
  const latestDate = [
    ...data.restingHeartRate,
    ...data.hrv,
    ...data.bodySurfaceTemp,
    ...data.sleep,
  ].reduce<string | null>(
    (latest, entry) => (!latest || entry.date > latest ? entry.date : latest),
    null
  );

  return latestDate ? Number(latestDate.slice(0, 4)) : null;
}

export async function fetchSleepDashboardData(): Promise<SleepDashboardData> {
  const [restingHeartRate, hrv, bodySurfaceTemp, sleep] = await Promise.all([
    fetchRestingHeartRate(),
    fetchHRV(),
    fetchBodySurfaceTemp(),
    fetchSleep(),
  ]);

  return buildSleepDashboardData(restingHeartRate, hrv, bodySurfaceTemp, sleep);
}
