import clsx from 'clsx';
import { getMonthName } from '@src/utils/time';
import { getGradientClasses } from '@src/utils/charts';
import config from '@src/config';
import type { ReactNode } from 'react';

type LinearProgressProps = {
  color: string; // Base color for the component (for text/borders)
  label: string;
  month: string | number;
  lowestValue: number;
  targetValue: number;
  currentValue: number;
  className?: string; // For dimensions
  icon?: ReactNode; // Optional icon to display in the top-right corner
  showUpRate?: string; // Optional show-up rate to display next to month (e.g., "75%")
  totalBars?: number; // Number of bars to display (default: 12)
};

// Helper function to convert hex color to rgba with opacity
function hexToRgba(hex: string, opacity: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex; // Return original if not a valid hex

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Helper function to get a darker color for text readability
function getTextColor(hex: string): string {
  // For teal/cyan colors, use a darker shade for better readability
  if (hex === config.colors.healthkit.bodySurfaceTemp) {
    return config.colors.healthkit.bodySurfaceTempText;
  }
  // For other colors, return as-is (they're already readable)
  return hex;
}

export default function LinearProgress({
  color,
  label,
  month,
  lowestValue,
  targetValue,
  currentValue,
  className,
  icon,
  showUpRate,
  totalBars = 12,
}: LinearProgressProps) {
  // Calculate percentage based on current value relative to target
  // Map current value from [lowestValue, targetValue] to [0, 100]
  const range = targetValue - lowestValue;
  const percentage =
    range > 0
      ? Math.min(100, Math.max(0, ((currentValue - lowestValue) / range) * 100))
      : 0;

  const monthName = getMonthName(month).slice(0, 3);

  // Base bar color (similar to missing data bar in snapshot - 50% opacity)
  const baseBarColor = hexToRgba(color, 0.5);
  // Fill color uses the provided color
  const fillBarColor = color;

  // Calculate filled bars proportionally (rounded down)
  const filledBars = Math.floor((currentValue / targetValue) * totalBars);

  return (
    <div
      className={clsx(
        className,
        // Layout & positioning
        'relative flex flex-col',
        // Spacing
        'px-2 pt-2 pb-2',
        // Appearance
        'rounded-lg overflow-hidden',
        // Gradient background (similar to UnoTimeSeriesSnapshot)
        getGradientClasses(color),
        // Cursor
        'cursor-pointer'
      )}
    >
      {/* Top section: Label, Month, and optional Icon */}
      <div className={clsx('flex justify-between items-start mb-1')}>
        <div className={clsx('flex flex-col items-start')}>
          <span
            className={clsx('text-xs font-medium')}
            style={{ color: getTextColor(color) }}
          >
            {label}
          </span>
          <span className={clsx('text-[10px] opacity-70')}>
            {monthName}
            {showUpRate && ` - ${showUpRate}`}
          </span>
        </div>
        {icon && <div className={clsx('w-4 h-4 flex-shrink-0')}>{icon}</div>}
      </div>

      {/* Bottom half: Horizontal bar chart */}
      <div className={clsx('flex-1 flex flex-col justify-end min-h-0')}>
        {/* Labels above the bar - positioned to align with bar edges */}
        <div className={clsx('flex mb-0.5')}>
          {/* Current value label - positioned to align with filled bar right edge */}
          <div
            className={clsx('flex justify-end')}
            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
          >
            <span className={clsx('text-[10px] font-medium')}>
              {currentValue}
            </span>
          </div>
          {/* Target value label - positioned at right edge */}
          <div className={clsx('flex-1 flex justify-end')}>
            <span className={clsx('text-[10px] font-medium opacity-70')}>
              {targetValue}
            </span>
          </div>
        </div>
        {/* Discrete bars container */}
        <div
          className={clsx('w-full h-8 grid items-end')}
          style={{
            gridTemplateColumns: `repeat(${totalBars}, 1fr)`,
            gap: '0.125rem',
          }}
        >
          {Array.from({ length: totalBars }, (_, index) => {
            const barIndex = index + 1;
            const isFilled = barIndex <= filledBars;

            return (
              <div
                key={`bar-${index}`}
                style={{
                  height: '100%',
                  backgroundColor: isFilled ? fillBarColor : baseBarColor,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
