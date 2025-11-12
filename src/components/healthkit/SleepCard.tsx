import clsx from 'clsx';
import {
  formatDateShort,
  parseHealthKitDate,
  formatSleepHours,
  getSleepStagePercentages,
} from '@src/domain/healthkit';
import type { SleepData } from '@src/domain/healthkit.types';
import config from '@src/config';
import { getGradientClasses } from '@src/utils/charts';

type SleepCardProps = {
  lastSleepData: SleepData;
  color?: string;
  className?: string;
};

// Helper function to get a darker color for text readability
function getTextColor(hex: string): string {
  // For teal/cyan colors, use a darker shade for better readability
  if (hex === config.colors.healthkit.bodySurfaceTemp) {
    return config.colors.healthkit.bodySurfaceTempText;
  }
  // For other colors, return as-is (they're already readable)
  return hex;
}

// Helper function to darken a hex color
function darkenColor(hex: string, amount: number = 0.3): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  const r = Math.max(0, Math.min(255, parseInt(result[1], 16) * (1 - amount)));
  const g = Math.max(0, Math.min(255, parseInt(result[2], 16) * (1 - amount)));
  const b = Math.max(0, Math.min(255, parseInt(result[3], 16) * (1 - amount)));

  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g)
    .toString(16)
    .padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

// Helper function to lighten a hex color
function lightenColor(hex: string, amount: number = 0.3): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  const r = Math.min(
    255,
    Math.max(
      0,
      parseInt(result[1], 16) + (255 - parseInt(result[1], 16)) * amount
    )
  );
  const g = Math.min(
    255,
    Math.max(
      0,
      parseInt(result[2], 16) + (255 - parseInt(result[2], 16)) * amount
    )
  );
  const b = Math.min(
    255,
    Math.max(
      0,
      parseInt(result[3], 16) + (255 - parseInt(result[3], 16)) * amount
    )
  );

  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g)
    .toString(16)
    .padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

export default function SleepCard({
  lastSleepData,
  color = config.colors.healthkit.sleep,
  className,
}: SleepCardProps) {
  // Safely parse and format the date

  const sleepDate = parseHealthKitDate(lastSleepData.date);
  const formattedDate = formatDateShort(sleepDate);
  const totalSleepFormatted = formatSleepHours(lastSleepData?.totalSleep);
  const percentages = getSleepStagePercentages(lastSleepData);

  // Derive bar container color from text color
  const textColor = getTextColor(color);
  const barContainerColor = darkenColor(textColor, 0.3);

  // Colors for sleep stages - all shades of the base color
  const remColor = lightenColor(color, 0.2); // Lighter shade
  const deepColor = color; // Base color
  const coreColor = darkenColor(color, 0.2); // Darker shade

  return (
    <div
      className={clsx(
        className,
        // Layout & positioning
        'relative flex flex-col',
        // Spacing
        'pt-2 pb-2',
        // Appearance
        'rounded-lg overflow-hidden',
        // Cursor
        'cursor-pointer',
        // Gradient background
        getGradientClasses(color)
      )}
    >
      {/* Top section: Label (left) and Total Hours (right) */}
      <div className={clsx('flex justify-between items-start mb-1 px-2')}>
        <div className={clsx('flex flex-col items-start')}>
          <span
            className={clsx('text-xs font-medium')}
            style={{ color: getTextColor(color) }}
          >
            Sleep
          </span>
          <span className={clsx('text-[10px] opacity-70')}>
            {formattedDate}
          </span>
        </div>
        <div className={clsx('flex flex-col items-end')}>
          <span className={clsx('text-xs font-bold')}>
            {totalSleepFormatted}
          </span>
          <span className={clsx('text-[10px] opacity-70')}>Hrs</span>
        </div>
      </div>

      {/* Bottom section: Horizontal bar chart with sleep stages */}
      <div className={clsx('flex-1 flex flex-col justify-end min-h-0 mt-1')}>
        {/* Labels above the bar */}
        <div className={clsx('flex justify-between mb-0.5 px-2')}>
          {/* Rem label */}
          <div className={clsx('flex flex-col items-start')}>
            <span
              className={clsx('text-[10px] font-medium')}
              style={{ color: remColor }}
            >
              Rem
            </span>
          </div>
          {/* Deep label */}
          <div className={clsx('flex flex-col items-start')}>
            <span
              className={clsx('text-[10px] font-medium')}
              style={{ color: deepColor }}
            >
              Deep
            </span>
          </div>
          {/* Core label */}
          <div className={clsx('flex flex-col items-start')}>
            <span
              className={clsx('text-[10px] font-medium')}
              style={{ color: coreColor }}
            >
              Core
            </span>
          </div>
        </div>

        {/* Bar container */}
        <div
          className={clsx('w-full h-8')}
          style={{
            backgroundColor: barContainerColor,
            boxShadow:
              'inset 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className={clsx('flex h-full gap-1')}>
            {/* Rem stage */}
            <div
              className={clsx('h-full')}
              style={{
                width: `${percentages.rem}%`,
                backgroundColor: remColor,
              }}
            />
            {/* Deep stage */}
            <div
              className={clsx('h-full')}
              style={{
                width: `${percentages.deep}%`,
                backgroundColor: deepColor,
              }}
            />
            {/* Core stage */}
            <div
              className={clsx('h-full')}
              style={{
                width: `${percentages.core}%`,
                backgroundColor: coreColor,
              }}
            />
          </div>
        </div>

        {/* Percentages below the bar */}
        <div className={clsx('flex items-center justify-between px-2')}>
          {/* Rem percentage */}
          <div className={clsx('flex flex-col items-start')}>
            <span className={clsx('text-[9px] opacity-70')}>
              {Math.round(percentages.rem)}%
            </span>
          </div>
          {/* Deep percentage */}
          <div className={clsx('flex flex-col items-start')}>
            <span className={clsx('text-[9px] opacity-70')}>
              {Math.round(percentages.deep)}%
            </span>
          </div>
          {/* Core percentage */}
          <div className={clsx('flex flex-col items-start')}>
            <span className={clsx('text-[9px] opacity-70')}>
              {Math.round(percentages.core)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
