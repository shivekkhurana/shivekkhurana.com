import { format, startOfDay, subDays, subMonths, subYears } from 'date-fns';
import config from '@src/config';
import type {
  HealthMetric,
  HealthMetricData,
  TimePeriod,
  ChartDataPoint,
} from '@src/domain/healthkit.types';

async function fetchHealthMetric(endpoint: string): Promise<HealthMetricData> {
  const url = `${config.stateOfBeingPagesBase}${endpoint}`;
  return await fetch(url).then((res) => res.json());
}

export async function fetchRestingHeartRate(): Promise<HealthMetricData> {
  return fetchHealthMetric(config.vault.healthkit.restingHeartRate);
}

export async function fetchHRV(): Promise<HealthMetricData> {
  return fetchHealthMetric(config.vault.healthkit.hrv);
}

export async function fetchBodySurfaceTemp(): Promise<HealthMetricData> {
  return fetchHealthMetric(config.vault.healthkit.bodySurfaceTemp);
}

/**
 * Parse HealthKit date string to Date object
 */
export function parseHealthKitDate(dateString: string): Date {
  // Format: "YYYY-MM-DD HH:mm:ss +TZ"
  // We'll parse it as a date string, handling the timezone
  return new Date(dateString);
}

/**
 * Transform metrics for chart usage
 */
export function transformMetricsForChart(
  data: HealthMetricData
): ChartDataPoint[] {
  return data.metrics
    .map((metric) => ({
      date: parseHealthKitDate(metric.date),
      value: metric.qty,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Get the latest value from metrics
 */
export function getLatestValue(data: HealthMetricData): HealthMetric | null {
  if (data.metrics.length === 0) return null;

  // Sort by date descending and get the first one
  const sorted = [...data.metrics].sort((a, b) => {
    const dateA = parseHealthKitDate(a.date);
    const dateB = parseHealthKitDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return sorted[0];
}

/**
 * Get weekly data (last 7 days)
 */
export function getWeeklyData(data: HealthMetricData): ChartDataPoint[] {
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);

  return transformMetricsForChart(data).filter(
    (point) => point.date >= sevenDaysAgo
  );
}

/**
 * Filter data by time period
 */
export function filterByPeriod(
  data: HealthMetricData,
  period: TimePeriod
): HealthMetricData {
  if (period === 'All') {
    return data;
  }

  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'D':
      startDate = startOfDay(now);
      break;
    case 'W':
      startDate = subDays(now, 7);
      break;
    case 'M':
      startDate = subMonths(now, 1);
      break;
    case '6M':
      startDate = subMonths(now, 6);
      break;
    case 'Y':
      startDate = subYears(now, 1);
      break;
    default:
      return data;
  }

  const filtered = data.metrics.filter((metric) => {
    const metricDate = parseHealthKitDate(metric.date);
    return metricDate >= startDate;
  });

  return { metrics: filtered };
}

/**
 * Calculate average value from metrics
 */
export function calculateAverage(data: HealthMetricData): number {
  if (data.metrics.length === 0) return 0;

  const sum = data.metrics.reduce((acc, metric) => acc + metric.qty, 0);
  return sum / data.metrics.length;
}

/**
 * Format number for display
 */
export function formatNumber(value: number, decimals?: number): string {
  if (decimals !== undefined) {
    return value.toFixed(decimals);
  }

  // If it's a whole number, show no decimals
  if (Number.isInteger(value)) {
    return value.toString();
  }

  // Otherwise, show up to 2 decimals, but remove trailing zeros
  return value.toFixed(2).replace(/\.?0+$/, '');
}

/**
 * Get date range string for a period
 */
export function getDateRangeString(
  data: HealthMetricData,
  period: TimePeriod
): string {
  if (data.metrics.length === 0) return '';

  const filtered = filterByPeriod(data, period);
  if (filtered.metrics.length === 0) return '';

  const dates = filtered.metrics.map((m) => parseHealthKitDate(m.date));
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());

  const start = sortedDates[0];
  const end = sortedDates[sortedDates.length - 1];

  if (period === 'D') {
    return format(start, 'd MMM yyyy');
  }

  if (period === 'W') {
    // Show range like "2-8 Nov 2025"
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${format(start, 'd')}-${format(end, 'd MMM yyyy')}`;
    }
    return `${format(start, 'd MMM')}-${format(end, 'd MMM yyyy')}`;
  }

  // For longer periods, show start and end dates
  return `${format(start, 'd MMM')}-${format(end, 'd MMM yyyy')}`;
}

/**
 * Format date for display (e.g., "9 Nov")
 */
export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseHealthKitDate(date) : date;
  return format(dateObj, 'd MMM');
}
