import config from '@src/config';
import type { DietLogData } from '@src/domain/diet';
import UnoTimeSeriesSnapshot from '@src/components/healthkit/UnoTimeSeriesSnapshot';

type CaloriesCardProps = {
  data: DietLogData;
  color?: string;
  className?: string;
};

export default function CaloriesCard({
  data,
  color = config.colors.healthkit.calories,
  className,
}: CaloriesCardProps) {
  return (
    <UnoTimeSeriesSnapshot
      data={data}
      title="Calories"
      unit="kcal"
      color={color}
      className={className}
    />
  );
}
