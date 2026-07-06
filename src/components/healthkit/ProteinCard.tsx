import config from '@src/config';
import type { DietLogData } from '@src/domain/diet.types';
import UnoTimeSeriesSnapshot from '@src/components/healthkit/UnoTimeSeriesSnapshot';

type ProteinCardProps = {
  data: DietLogData;
  color?: string;
  className?: string;
};

export default function ProteinCard({
  data,
  color = config.colors.healthkit.protein,
  className,
}: ProteinCardProps) {
  return (
    <UnoTimeSeriesSnapshot
      data={data}
      title="Protein"
      unit="g"
      color={color}
      className={className}
    />
  );
}
