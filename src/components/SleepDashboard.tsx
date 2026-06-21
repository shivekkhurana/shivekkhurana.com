import Markdown from '@src/components/Markdown';
import type { SleepChartMarkdown } from '@src/domain/sleep-markdown';

type SleepDashboardProps = {
  year: number;
  years: readonly number[];
  updatedAt: string;
  charts: Array<SleepChartMarkdown & { parsedMd: string }>;
};

const descriptions: Record<SleepChartMarkdown['key'], string> = {
  restingHeartRate:
    'Daily resting heart rate. The labeled line shows monthly averages.',
  hrv: 'Daily heart rate variability. The labeled line shows monthly averages.',
  bodySurfaceTemp:
    'Daily body surface temperature. The labeled line shows monthly averages.',
  sleep:
    'Total sleep split into REM, deep, and core stages. The labeled line shows monthly average total sleep; dotted lines show monthly stage averages.',
};

export default function SleepDashboard({
  year,
  years,
  updatedAt,
  charts,
}: SleepDashboardProps) {
  return (
    <article className="mb-16 font-mlm-roman">
      <h1 className="text-2xl font-bold mb-4">Sleep</h1>
      <nav
        aria-label="Sleep dashboard year"
        className="flex gap-2 mb-8"
      >
        {years.map((availableYear) => {
          const isSelected = availableYear === year;

          return (
            <a
              key={availableYear}
              href={`/sleep/${availableYear}`}
              aria-current={isSelected ? 'page' : undefined}
              className={
                isSelected
                  ? 'bg-gray-900 px-3 py-1 text-sm font-bold text-white'
                  : 'border border-gray-300 px-3 py-1 text-sm font-bold text-gray-700 hover:bg-gray-100'
              }
            >
              {availableYear}
            </a>
          );
        })}
      </nav>
      <p className="mb-3 text-sm italic opacity-70">
        Last updated at {updatedAt}
      </p>

      <div className="mt-8 space-y-8">
        {charts.map((chart) => (
          <section key={chart.key}>
            <h2 className="text-xl font-bold mb-2">{chart.title}</h2>
            <p className="mb-4 text-lg leading-relaxed opacity-80">
              {descriptions[chart.key]}
            </p>
            <Markdown
              parsedMd={chart.parsedMd}
              className="[&_pre:has(.vega-chart-container)]:!m-0 [&_pre:has(.vega-chart-container)]:!w-full [&_pre:has(.vega-chart-container)]:!p-0 [&_pre:has(.vega-chart-container)]:!overflow-visible [&_pre:has(.vega-chart-container)_code]:block [&_pre:has(.vega-chart-container)_code]:text-[0] [&_.vega-chart-wrapper]:!w-full"
            />
          </section>
        ))}
      </div>
    </article>
  );
}
