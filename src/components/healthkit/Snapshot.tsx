import clsx from 'clsx';
import type { HealthMetricData } from '@src/domain/healthkit.types';
import UnoTimeSeriesSnapshot from './UnoTimeSeriesSnapshot';

// Config moved from config.ts
export type UnoTimeSeriesMetricConfig = {
  title: string;
  unit: string;
  color: string;
  endpoint: string;
};

export const unoTimeSeriesMetrics: Record<string, UnoTimeSeriesMetricConfig> = {
  restingHeartRate: {
    title: 'RHR',
    unit: 'BPM',
    color: '#FF69B4', // Pink
    endpoint: 'restingHeartRate',
  },
  hrv: {
    title: 'HRV',
    unit: 'ms',
    color: '#FF6B6B', // Red
    endpoint: 'hrv',
  },
  bodySurfaceTemp: {
    title: 'Surface Temp',
    unit: '°C',
    color: '#4ECDC4', // Teal/Cyan
    endpoint: 'bodySurfaceTemp',
  },
};

type SnapshotProps = {
  rhrData: HealthMetricData;
  hrvData: HealthMetricData;
  bodyTempData: HealthMetricData;
};

export default function Snapshot({
  rhrData,
  hrvData,
  bodyTempData,
}: SnapshotProps) {
  return (
    <div className={clsx('flex flex-row gap-3 items-center')}>
      <UnoTimeSeriesSnapshot
        data={rhrData}
        title={unoTimeSeriesMetrics.restingHeartRate.title}
        unit={unoTimeSeriesMetrics.restingHeartRate.unit}
        color={unoTimeSeriesMetrics.restingHeartRate.color}
      />
      <UnoTimeSeriesSnapshot
        data={hrvData}
        title={unoTimeSeriesMetrics.hrv.title}
        unit={unoTimeSeriesMetrics.hrv.unit}
        color={unoTimeSeriesMetrics.hrv.color}
      />
      <UnoTimeSeriesSnapshot
        data={bodyTempData}
        title={unoTimeSeriesMetrics.bodySurfaceTemp.title}
        unit={unoTimeSeriesMetrics.bodySurfaceTemp.unit}
        color={unoTimeSeriesMetrics.bodySurfaceTemp.color}
      />
    </div>
  );
}
