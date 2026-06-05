import type { WorkoutDashboardStats } from '@src/domain/workouts';

const chartBarColor = '#6B7280';
const calendarEmptyColor = '#E5E7EB';
const calendarFutureColor = '#F3F4F6';
const chartConfig = {
  axis: {
    gridDash: [2, 4],
  },
  view: {
    stroke: null,
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
    width: {
      step: 56,
    },
    height: {
      step: 56,
    },
    data: {
      values: stats.currentMonthDailyCounts,
    },
    transform: [
      {
        window: [
          {
            op: 'row_number',
            as: 'dayIndex',
          },
        ],
        sort: [
          {
            field: 'date',
            order: 'ascending',
          },
        ],
      },
      {
        calculate: '(datum.dayIndex - 1) % 11',
        as: 'column',
      },
      {
        calculate: 'floor((datum.dayIndex - 1) / 11)',
        as: 'row',
      },
      {
        calculate: 'date(toDate(datum.date))',
        as: 'dayOfMonth',
      },
    ],
    layer: [
      {
        mark: {
          type: 'rect',
          cornerRadius: 4,
        },
        encoding: {
          x: {
            field: 'column',
            type: 'ordinal',
            axis: null,
            scale: {
              paddingInner: 0.12,
              paddingOuter: 0.06,
            },
          },
          y: {
            field: 'row',
            type: 'ordinal',
            axis: null,
            scale: {
              paddingInner: 0.12,
              paddingOuter: 0.06,
            },
          },
          color: {
            condition: [
              {
                test: 'datum.count > 0',
                value: chartBarColor,
              },
              {
                test: `datum.dayOfMonth > ${stats.currentDay}`,
                value: calendarFutureColor,
              },
            ],
            value: calendarEmptyColor,
            legend: null,
          },
          tooltip: [
            {
              field: 'date',
              type: 'temporal',
              title: 'Date',
              format: '%B %d, %Y',
            },
            {
              field: 'count',
              type: 'quantitative',
              title: 'Workouts',
              format: 'd',
            },
          ],
        },
      },
      {
        mark: {
          type: 'text',
          fontSize: 13,
          fontWeight: 'bold',
        },
        encoding: {
          x: {
            field: 'column',
            type: 'ordinal',
            axis: null,
            scale: {
              paddingInner: 0.12,
              paddingOuter: 0.06,
            },
          },
          y: {
            field: 'row',
            type: 'ordinal',
            axis: null,
            scale: {
              paddingInner: 0.12,
              paddingOuter: 0.06,
            },
          },
          text: {
            field: 'dayOfMonth',
            type: 'quantitative',
            format: '.0f',
          },
          color: {
            condition: {
              test: 'datum.count > 0',
              value: '#FFFFFF',
            },
            value: '#374151',
          },
        },
      },
    ],
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
      axis: {
        domain: false,
      },
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
        transform: [
          {
            filter: `datum.count > 0 || datum.month < '${String(
              stats.currentMonth
            ).padStart(2, '0')}'`,
          },
        ],
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
      axis: {
        domain: false,
      },
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
