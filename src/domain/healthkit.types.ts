export type HealthMetric = {
  qty: number;
  date: string; // "YYYY-MM-DD HH:mm:ss +TZ"
};

export type HealthMetricData = {
  metrics: HealthMetric[];
};

export type TimePeriod = 'D' | 'W' | 'M' | '6M' | 'Y' | 'All';

export type ChartDataPoint = {
  date: Date;
  value: number;
};

export type SleepData = {
  inBedStart: string;
  awake: number;
  source: string;
  sleepStart: string;
  totalSleep: number;
  sleepEnd: string;
  date: string;
  deep: number;
  rem: number;
  inBedEnd: string;
  inBed: number;
  core: number;
  asleep: number;
};
