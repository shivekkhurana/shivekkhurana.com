import clsx from 'clsx';
import config from '@src/config';
import type { DietLogSummary } from '@src/domain/diet';
import { getGradientClasses } from '@src/utils/charts';

type CaloriesCardProps = {
  dietLog: DietLogSummary;
  color?: string;
  className?: string;
};

function formatDietDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export default function CaloriesCard({
  dietLog,
  color = config.colors.healthkit.calories,
  className,
}: CaloriesCardProps) {
  const totalCalories = Math.round(dietLog.totalCalories);
  const percentage = Math.min(100, Math.max(0, (totalCalories / 2500) * 100));

  return (
    <div
      className={clsx(
        className,
        'relative flex flex-col px-2 pt-2 pb-2 rounded-lg overflow-hidden cursor-pointer',
        getGradientClasses(color)
      )}
    >
      <div className={clsx('flex justify-between items-start mb-1')}>
        <div className={clsx('flex flex-col items-start')}>
          <span
            className={clsx('text-xs font-medium')}
            style={{ color }}
          >
            Calories
          </span>
          <span className={clsx('text-[10px] opacity-70')}>
            {formatDietDate(dietLog.date)}
          </span>
        </div>
        <div className={clsx('flex flex-col items-end')}>
          <span className={clsx('text-xs font-bold')}>{totalCalories}</span>
          <span className={clsx('text-[10px] opacity-70')}>kcal</span>
        </div>
      </div>

      <div className={clsx('flex-1 flex flex-col justify-end min-h-0')}>
        <div
          className={clsx('w-full h-8 rounded-sm overflow-hidden')}
          style={{ backgroundColor: 'rgba(37, 99, 235, 0.35)' }}
        >
          <div
            className={clsx('h-full')}
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  );
}
