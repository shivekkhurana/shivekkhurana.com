import type { WorkoutDashboardStats } from '@src/domain/workouts';

const chartBarColor = '#6B7280';
const chartConfig = {
  axis: {
    gridDash: [2, 4],
  },
};

export type WorkoutChartMarkdown = {
  key: 'currentMonth' | 'currentYear' | 'allTime';
  title: string;
  parsedMd?: string;
  markdown: string;
};

export function formatWorkoutUpdatedAt(date: Date): string {
  return date.toUTCString();
}

function stringifySpec(spec: Record<string, unknown>): string {
  return JSON.stringify(spec, null, 2);
}

function vegaLiteBlock(spec: Record<string, unknown>): string {
  return `\`\`\`vega-lite\n${stringifySpec(spec)}\n\`\`\``;
}

function buildDailyChart(stats: WorkoutDashboardStats) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    config: chartConfig,
    width: 640,
    height: 240,
    data: {
      values: stats.currentMonthDailyCounts,
    },
    mark: {
      type: 'bar',
      color: chartBarColor,
    },
    encoding: {
      x: {
        field: 'date',
        type: 'ordinal',
        title: 'Day',
        axis: {
          labelAngle: -45,
        },
      },
      y: {
        field: 'count',
        type: 'quantitative',
        title: 'Workouts',
        scale: {
          domainMin: 0,
        },
      },
    },
  };
}

function buildMonthlyChart(stats: WorkoutDashboardStats) {
  const encoding = {
    x: {
      field: 'month',
      type: 'ordinal',
      title: 'Month',
    },
    y: {
      field: 'count',
      type: 'quantitative',
      title: 'Workouts',
      scale: {
        domainMin: 0,
      },
    },
  };

  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    config: chartConfig,
    width: 640,
    height: 240,
    data: {
      values: stats.currentYearMonthlyCounts,
    },
    layer: [
      {
        mark: {
          type: 'bar',
          color: chartBarColor,
        },
        encoding,
      },
      {
        mark: {
          type: 'text',
          dy: -6,
          color: '#111827',
          fontSize: 12,
          fontWeight: 'bold',
        },
        encoding: {
          ...encoding,
          text: {
            field: 'count',
            type: 'quantitative',
            format: 'd',
          },
        },
      },
    ],
  };
}

function buildYearlyChart(stats: WorkoutDashboardStats) {
  const encoding = {
    x: {
      field: 'year',
      type: 'ordinal',
      title: 'Year',
    },
    y: {
      field: 'count',
      type: 'quantitative',
      title: 'Workouts',
      scale: {
        domainMin: 0,
      },
    },
  };

  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    config: chartConfig,
    width: 640,
    height: 240,
    data: {
      values: stats.allTimeYearlyCounts,
    },
    layer: [
      {
        mark: {
          type: 'bar',
          color: chartBarColor,
        },
        encoding,
      },
      {
        mark: {
          type: 'text',
          dy: -6,
          color: '#111827',
          fontSize: 12,
          fontWeight: 'bold',
        },
        encoding: {
          ...encoding,
          text: {
            field: 'count',
            type: 'quantitative',
            format: 'd',
          },
        },
      },
    ],
  };
}

export function buildWorkoutChartMarkdowns(
  stats: WorkoutDashboardStats
): WorkoutChartMarkdown[] {
  return [
    {
      key: 'currentMonth',
      title: 'Current Month Workouts',
      markdown: vegaLiteBlock(buildDailyChart(stats)),
    },
    {
      key: 'currentYear',
      title: 'Current Year Workouts',
      markdown: vegaLiteBlock(buildMonthlyChart(stats)),
    },
    {
      key: 'allTime',
      title: 'All-Time Workouts',
      markdown: vegaLiteBlock(buildYearlyChart(stats)),
    },
  ];
}
