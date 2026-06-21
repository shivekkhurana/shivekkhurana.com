import type {
  DailyMetricPoint,
  SleepDashboardData,
} from '@src/domain/sleep-dashboard';
import {
  calculateMonthlyMetricAverages,
  calculateMonthlySleepAverages,
} from '@src/domain/sleep-dashboard';

const chartConfig = {
  axis: {
    gridDash: [2, 4],
  },
  view: {
    stroke: null,
  },
};

const metricColors = {
  restingHeartRate: '#FF69B4',
  hrv: '#FF6B6B',
  bodySurfaceTemp: '#4ECDC4',
};

const sleepStageColors = {
  REM: '#6EE7B7',
  Deep: '#10B981',
  Core: '#047857',
};

export type SleepChartMarkdown = {
  key: 'restingHeartRate' | 'hrv' | 'bodySurfaceTemp' | 'sleep';
  title: string;
  markdown: string;
};

export function formatSleepUpdatedAt(date: Date): string {
  return date.toUTCString();
}

function vegaLiteBlock(spec: Record<string, unknown>): string {
  return `\`\`\`vega-lite\n${JSON.stringify(spec, null, 2)}\n\`\`\``;
}

function buildMonthlyTrendLayers(
  data: DailyMetricPoint[],
  color: string,
  unit: string,
  decimals: number,
  showLabels: boolean,
  strokeDash?: number[],
  labelColor = color
) {
  const values = data.map((entry) => ({
    ...entry,
    label: `${entry.value.toFixed(decimals)} ${unit}`,
  }));

  if (values.length === 0) {
    return [];
  }

  const layers: Array<Record<string, unknown>> = [
    {
      data: { values },
      mark: {
        type: 'line',
        color,
        strokeWidth: 2.5,
        point: {
          filled: true,
          size: 36,
        },
        ...(strokeDash ? { strokeDash } : {}),
      },
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
        },
        y: {
          field: 'value',
          type: 'quantitative',
        },
        tooltip: [
          {
            field: 'date',
            type: 'temporal',
            title: 'Month',
            format: '%B %Y',
          },
          {
            field: 'value',
            type: 'quantitative',
            title: 'Monthly average',
            format: '.2f',
          },
        ],
      },
    },
  ];

  if (showLabels) {
    const backgroundWidth =
      Math.max(...values.map((entry) => entry.label.length)) * 6.5 + 2;

    layers.push({
      data: { values },
      mark: {
        type: 'rect',
        width: backgroundWidth,
        height: 13,
        yOffset: -12,
        cornerRadius: 2,
        color: '#FFFFFF',
        opacity: 0.72,
      },
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
        },
        y: {
          field: 'value',
          type: 'quantitative',
        },
      },
    });
    layers.push({
      data: { values },
      mark: {
        type: 'text',
        align: 'center',
        baseline: 'middle',
        dy: -12,
        color: labelColor,
        fontSize: 11,
        fontWeight: 'bold',
      },
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
        },
        y: {
          field: 'value',
          type: 'quantitative',
        },
        text: {
          field: 'label',
          type: 'nominal',
        },
      },
    });
  }

  return layers;
}

function buildMetricChart(
  data: DailyMetricPoint[],
  color: string,
  unit: string,
  averageUnit: string,
  averageDecimals = 1
) {
  const monthlyAverageLayers = buildMonthlyTrendLayers(
    calculateMonthlyMetricAverages(data),
    color,
    averageUnit,
    averageDecimals,
    true
  );

  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    config: chartConfig,
    width: 640,
    height: 240,
    layer: [
      {
        data: { values: data },
        mark: {
          type: 'point',
          color,
          filled: true,
          size: 28,
        },
        encoding: {
          x: {
            field: 'date',
            type: 'temporal',
            title: 'Date',
            axis: { format: '%b', labelOverlap: 'greedy' },
          },
          y: {
            field: 'value',
            type: 'quantitative',
            title: unit,
            axis: { domain: false },
            scale: { zero: false },
          },
          tooltip: [
            {
              field: 'date',
              type: 'temporal',
              title: 'Date',
              format: '%d %b %Y',
            },
            {
              field: 'value',
              type: 'quantitative',
              title: unit,
              format: '.2f',
            },
          ],
        },
      },
      ...monthlyAverageLayers,
    ],
  };
}

function buildSleepChart(data: SleepDashboardData) {
  const monthlyAverages = calculateMonthlySleepAverages(data.sleep);
  const monthlyStageLayers = (
    [
      ['rem', sleepStageColors.REM],
      ['deep', sleepStageColors.Deep],
      ['core', sleepStageColors.Core],
    ] as const
  ).flatMap(([stage, color]) =>
    buildMonthlyTrendLayers(
      monthlyAverages.map((entry) => ({
        date: entry.date,
        value: entry[stage],
      })),
      color,
      'h',
      2,
      true,
      [2, 4],
      '#000000'
    )
  );
  const monthlyTotalLayers = buildMonthlyTrendLayers(
    monthlyAverages.map((entry) => ({
      date: entry.date,
      value: entry.totalSleep,
    })),
    '#374151',
    'h',
    2,
    true
  );

  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    config: chartConfig,
    width: 640,
    height: 280,
    layer: [
      {
        data: { values: data.sleep },
        transform: [
          { fold: ['rem', 'deep', 'core'], as: ['stage', 'hours'] },
          {
            calculate:
              "datum.stage === 'rem' ? 'REM' : datum.stage === 'deep' ? 'Deep' : 'Core'",
            as: 'stageLabel',
          },
        ],
        mark: { type: 'bar' },
        encoding: {
          x: {
            field: 'date',
            type: 'temporal',
            title: 'Date',
            axis: { format: '%b', labelOverlap: 'greedy' },
          },
          y: {
            field: 'hours',
            type: 'quantitative',
            title: 'Total sleep (hours)',
            stack: 'zero',
            axis: { domain: false },
          },
          color: {
            field: 'stageLabel',
            type: 'nominal',
            title: 'Sleep stage',
            scale: {
              domain: ['REM', 'Deep', 'Core'],
              range: [
                sleepStageColors.REM,
                sleepStageColors.Deep,
                sleepStageColors.Core,
              ],
            },
          },
          order: {
            field: 'stageLabel',
            sort: ['Core', 'Deep', 'REM'],
          },
          tooltip: [
            {
              field: 'date',
              type: 'temporal',
              title: 'Date',
              format: '%d %b %Y',
            },
            { field: 'stageLabel', type: 'nominal', title: 'Stage' },
            {
              field: 'hours',
              type: 'quantitative',
              title: 'Hours',
              format: '.2f',
            },
            {
              field: 'totalSleep',
              type: 'quantitative',
              title: 'Total sleep',
              format: '.2f',
            },
          ],
        },
      },
      ...monthlyStageLayers,
      ...monthlyTotalLayers,
    ],
    resolve: {
      scale: { color: 'independent' },
    },
  };
}

export function buildSleepChartMarkdowns(
  data: SleepDashboardData
): SleepChartMarkdown[] {
  return [
    {
      key: 'restingHeartRate',
      title: 'Resting Heart Rate',
      markdown: vegaLiteBlock(
        buildMetricChart(
          data.restingHeartRate,
          metricColors.restingHeartRate,
          'Beats per minute',
          'bpm'
        )
      ),
    },
    {
      key: 'hrv',
      title: 'Heart Rate Variability',
      markdown: vegaLiteBlock(
        buildMetricChart(data.hrv, metricColors.hrv, 'Milliseconds', 'ms')
      ),
    },
    {
      key: 'bodySurfaceTemp',
      title: 'Body Surface Temperature',
      markdown: vegaLiteBlock(
        buildMetricChart(
          data.bodySurfaceTemp,
          metricColors.bodySurfaceTemp,
          'Degrees Celsius',
          '°C',
          2
        )
      ),
    },
    {
      key: 'sleep',
      title: 'Sleep Duration and Stages',
      markdown: vegaLiteBlock(buildSleepChart(data)),
    },
  ];
}
