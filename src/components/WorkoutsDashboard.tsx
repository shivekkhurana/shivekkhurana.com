import type { WorkoutDashboardStats } from '@src/domain/workouts';
import type { WorkoutChartMarkdown } from '@src/domain/workouts-markdown';
import Img from '@src/components/Img';
import Markdown from '@src/components/Markdown';

type WorkoutsDashboardProps = {
  stats: WorkoutDashboardStats;
  updatedAt: string;
  charts: Array<WorkoutChartMarkdown & { parsedMd: string }>;
};

function Stat({
  imagePath,
  imageAlt,
  label,
  value,
  context,
}: {
  imagePath: string;
  imageAlt: string;
  label: string;
  value: string | number;
  context: string;
}) {
  return (
    <div className="flex items-center gap-4 py-3">
      <Img
        path={imagePath}
        alt={imageAlt}
        defaultWidth={240}
        sizes="56px"
        className="w-14 aspect-square flex-shrink-0 object-contain"
      />
      <div>
        <div className="text-base font-bold">{label}</div>
        <div className="mt-1 text-3xl font-bold">{value}</div>
        <div className="mt-1 text-sm opacity-60">{context}</div>
      </div>
    </div>
  );
}

function getCurrentMonthDescription(stats: WorkoutDashboardStats): string {
  const monthName = new Intl.DateTimeFormat('en', { month: 'long' }).format(
    new Date(stats.currentYear, stats.currentMonth - 1, 1)
  );

  return `Number of workouts done in ${monthName} ${stats.currentYear}.`;
}

function getChartDescription(
  chart: WorkoutChartMarkdown,
  stats: WorkoutDashboardStats
): string | null {
  if (chart.key === 'currentMonth') {
    return getCurrentMonthDescription(stats);
  }

  if (chart.key === 'currentYear') {
    return `Number of workouts done each month in ${stats.currentYear}.`;
  }

  if (chart.key === 'allTime') {
    return 'Number of workouts per year.';
  }

  return null;
}

function getCurrentMonthContext(stats: WorkoutDashboardStats): string {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(stats.currentYear, stats.currentMonth - 1, 1));
}

function formatMonthName(year: number, month: number): string {
  return new Intl.DateTimeFormat('en', { month: 'long' }).format(
    new Date(year, month - 1, 1)
  );
}

function formatMonthWithYear(year: number, month: number): string {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1));
}

function getSinceYear(stats: WorkoutDashboardStats): number {
  return stats.allTimeYearlyCounts[0]?.year ?? stats.currentYear;
}

function TextStat({
  imagePath,
  imageAlt,
  label,
  value,
  context,
}: {
  imagePath: string;
  imageAlt: string;
  label: string;
  value: string;
  context: string;
}) {
  return (
    <div className="flex items-center gap-4 py-3">
      <Img
        path={imagePath}
        alt={imageAlt}
        defaultWidth={240}
        sizes="48px"
        className="w-12 aspect-square flex-shrink-0 object-contain"
      />
      <div>
        <div className="text-base font-bold">{label}</div>
        <div className="mt-1 text-2xl font-bold">{value}</div>
        <div className="mt-1 text-sm opacity-60">{context}</div>
      </div>
    </div>
  );
}

export default function WorkoutsDashboard({
  stats,
  updatedAt,
  charts,
}: WorkoutsDashboardProps) {
  return (
    <article className="mb-16 font-mlm-roman">
      <div>
        <h1 className="text-2xl font-bold mb-8">
          Workouts
        </h1>

        <p className="mb-3 text-sm italic opacity-70">
          Last updated at {updatedAt}
        </p>

        <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
          <Stat
            imagePath="/img/sketches/workout-eggs.png"
            imageAlt="Pencil sketch of frog eggs"
            label="Current month"
            value={stats.totalCurrentMonth}
            context={getCurrentMonthContext(stats)}
          />
          <Stat
            imagePath="/img/sketches/workout-tadpole.png"
            imageAlt="Pencil sketch of a tadpole"
            label="Current year"
            value={stats.totalCurrentYear}
            context={String(stats.currentYear)}
          />
          <Stat
            imagePath="/img/sketches/workout-frog.png"
            imageAlt="Pencil sketch of a frog"
            label="Average per year"
            value={stats.averageCompletedYearWorkouts.toFixed(1)}
            context={`Since ${getSinceYear(stats)}`}
          />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-8">
          <TextStat
            imagePath="/img/sketches/workout-badge-best-year.png"
            imageAlt="Pencil sketch of a laurel award badge"
            label="Best month this year"
            value={formatMonthName(
              stats.bestMonthThisYear.year,
              stats.bestMonthThisYear.month
            )}
            context={`${stats.bestMonthThisYear.count} workouts`}
          />
          <TextStat
            imagePath="/img/sketches/workout-badge-worst-year.png"
            imageAlt="Pencil sketch of a subdued award badge"
            label="Worst month this year"
            value={formatMonthName(
              stats.worstMonthThisYear.year,
              stats.worstMonthThisYear.month
            )}
            context={`${stats.worstMonthThisYear.count} workouts`}
          />
          <TextStat
            imagePath="/img/sketches/workout-badge-best-ever.png"
            imageAlt="Pencil sketch of a premium award badge"
            label="Best month ever"
            value={formatMonthWithYear(
              stats.bestMonthEver.year,
              stats.bestMonthEver.month
            )}
            context={`${stats.bestMonthEver.count} workouts`}
          />
        </div>
      </div>

      <div className="mt-10 space-y-12">
        {charts.map((chart) => {
          const description = getChartDescription(chart, stats);

          return (
            <section key={chart.key}>
              <h2 className="text-xl font-bold mb-2">
                {chart.title}
              </h2>
              {description && (
                <p className="mb-4 text-lg leading-relaxed opacity-80">
                  {description}
                </p>
              )}
              <Markdown
                parsedMd={chart.parsedMd}
                className="[&_.vega-chart-wrapper]:!w-full"
              />
            </section>
          );
        })}
      </div>
    </article>
  );
}
