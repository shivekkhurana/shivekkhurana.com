import { describe, expect, it } from 'bun:test';
import type { HealthMetricData, SleepData } from '@src/domain/healthkit.types';
import {
  buildSleepDashboardData,
  calculateMonthlyMetricAverages,
  calculateMonthlySleepAverages,
  filterSleepDashboardDataByYear,
  getLatestSleepDashboardYear,
  normalizeDailyMetric,
  normalizeDailySleep,
} from '@src/domain/sleep-dashboard';
import {
  buildSleepChartMarkdowns,
  formatSleepUpdatedAt,
} from '@src/domain/sleep-markdown';
import { renderMarkdown } from '@src/components/Markdown';

function sleepEntry(
  date: string,
  rem: number,
  deep: number,
  core: number
): SleepData {
  return {
    date,
    totalSleep: rem + deep + core,
    rem,
    deep,
    core,
    inBedStart: date,
    awake: 0,
    source: 'Test',
    sleepStart: date,
    sleepEnd: date,
    inBedEnd: date,
    inBed: rem + deep + core,
    asleep: rem + deep + core,
  };
}

function parseChartSpec(markdown: string) {
  return JSON.parse(markdown.replace(/^```vega-lite\n|\n```$/g, ''));
}

describe('sleep dashboard normalization', () => {
  it('sorts measurements and averages duplicate calendar dates', () => {
    const data: HealthMetricData = {
      metrics: [
        { date: '2026-06-02 00:00:00 +0530', qty: 60 },
        { date: '2026-06-01 00:00:00 +0530', qty: 50 },
        { date: '2026-06-01 00:00:00 +0700', qty: 54 },
      ],
    };

    expect(normalizeDailyMetric(data)).toEqual([
      { date: '2026-06-01', value: 52 },
      { date: '2026-06-02', value: 60 },
    ]);
  });

  it('does not zero-fill missing dates', () => {
    const data: HealthMetricData = {
      metrics: [
        { date: '2026-06-01 00:00:00 +0530', qty: 50 },
        { date: '2026-06-03 00:00:00 +0530', qty: 55 },
      ],
    };

    expect(normalizeDailyMetric(data).map((entry) => entry.date)).toEqual([
      '2026-06-01',
      '2026-06-03',
    ]);
  });

  it('deduplicates sleep and preserves the stage total', () => {
    const sleep = normalizeDailySleep([
      sleepEntry('2026-06-02 00:00:00 +0530', 2, 1, 4),
      sleepEntry('2026-06-01 00:00:00 +0530', 2, 1, 3),
      sleepEntry('2026-06-01 00:00:00 +0700', 4, 2, 5),
    ]);

    expect(sleep).toEqual([
      { date: '2026-06-01', totalSleep: 8.5, rem: 3, deep: 1.5, core: 4 },
      { date: '2026-06-02', totalSleep: 7, rem: 2, deep: 1, core: 4 },
    ]);
    expect(sleep[0].rem + sleep[0].deep + sleep[0].core).toBe(
      sleep[0].totalSleep
    );
  });

  it('calculates monthly metric and sleep averages', () => {
    const sleep = normalizeDailySleep([
      sleepEntry('2026-06-01 00:00:00 +0530', 2, 1, 3),
      sleepEntry('2026-06-01 00:00:00 +0700', 4, 2, 5),
      sleepEntry('2026-06-02 00:00:00 +0530', 1, 0.5, 4),
      sleepEntry('2026-07-01 00:00:00 +0530', 2, 1, 5),
    ]);

    expect(
      calculateMonthlyMetricAverages([
        { date: '2026-06-01', value: 50 },
        { date: '2026-06-02', value: 60 },
        { date: '2026-07-01', value: 70 },
      ])
    ).toEqual([
      { date: '2026-06-15', value: 55 },
      { date: '2026-07-15', value: 70 },
    ]);
    expect(calculateMonthlySleepAverages(sleep)).toEqual([
      {
        date: '2026-06-15',
        totalSleep: 7,
        rem: 2,
        deep: 1,
        core: 4,
      },
      {
        date: '2026-07-15',
        totalSleep: 8,
        rem: 2,
        deep: 1,
        core: 5,
      },
    ]);
  });

  it('returns empty series for empty datasets', () => {
    const empty = buildSleepDashboardData(
      { metrics: [] },
      { metrics: [] },
      { metrics: [] },
      []
    );

    expect(empty.restingHeartRate).toEqual([]);
    expect(empty.hrv).toEqual([]);
    expect(empty.bodySurfaceTemp).toEqual([]);
    expect(empty.sleep).toEqual([]);
  });

  it('rejects sleep records whose stages do not equal total sleep', () => {
    const invalid = sleepEntry('2026-06-01 00:00:00 +0530', 2, 1, 3);
    invalid.totalSleep = 10;

    expect(() => normalizeDailySleep([invalid])).toThrow(
      'Sleep stages do not match total sleep'
    );
  });

  it('filters every series for the selected year', () => {
    const data = buildSleepDashboardData(
      {
        metrics: [
          { date: '2025-12-31 00:00:00 +0530', qty: 50 },
          { date: '2026-01-01 00:00:00 +0530', qty: 60 },
        ],
      },
      { metrics: [{ date: '2026-01-01 00:00:00 +0530', qty: 80 }] },
      { metrics: [{ date: '2026-01-01 00:00:00 +0530', qty: 35 }] },
      [
        sleepEntry('2025-12-31 00:00:00 +0530', 1, 1, 4),
        sleepEntry('2026-01-01 00:00:00 +0530', 3, 2, 4),
      ]
    );

    const filtered = filterSleepDashboardDataByYear(data, 2026);

    expect(filtered.restingHeartRate).toEqual([
      { date: '2026-01-01', value: 60 },
    ]);
    expect(filtered.hrv).toHaveLength(1);
    expect(filtered.bodySurfaceTemp).toHaveLength(1);
    expect(filtered.sleep).toHaveLength(1);
  });

  it('finds the year of the latest dashboard data point', () => {
    const data = buildSleepDashboardData(
      { metrics: [{ date: '2025-12-31 00:00:00 +0530', qty: 50 }] },
      { metrics: [{ date: '2026-01-01 00:00:00 +0530', qty: 80 }] },
      { metrics: [{ date: '2024-01-01 00:00:00 +0530', qty: 35 }] },
      []
    );

    expect(getLatestSleepDashboardYear(data)).toBe(2026);
    expect(
      getLatestSleepDashboardYear({
        restingHeartRate: [],
        hrv: [],
        bodySurfaceTemp: [],
        sleep: [],
      })
    ).toBeNull();
  });
});

describe('sleep chart markdown', () => {
  const metric = { metrics: [{ date: '2026-06-01 00:00:00 +0530', qty: 55 }] };
  const data = buildSleepDashboardData(metric, metric, metric, [
    sleepEntry('2026-06-01 00:00:00 +0530', 2, 1, 4),
  ]);

  it('formats the updated timestamp in GMT', () => {
    expect(formatSleepUpdatedAt(new Date(Date.UTC(2026, 5, 21, 12, 30)))).toBe(
      'Sun, 21 Jun 2026 12:30:00 GMT'
    );
  });

  it('builds four borderless Vega-Lite charts', () => {
    const charts = buildSleepChartMarkdowns(data);

    expect(charts.map((chart) => chart.title)).toEqual([
      'Resting Heart Rate',
      'Heart Rate Variability',
      'Body Surface Temperature',
      'Sleep Duration and Stages',
    ]);
    expect(charts).toHaveLength(4);
    expect(
      charts.every(
        (chart) => parseChartSpec(chart.markdown).config.view.stroke === null
      )
    ).toBe(true);
  });

  it('uses points for measurements and a labeled monthly average line', () => {
    const metricChart = buildSleepChartMarkdowns(data)[0];
    const spec = parseChartSpec(metricChart.markdown);

    expect(spec.layer[0].mark.type).toBe('point');
    expect(spec.layer[0].mark.filled).toBe(true);
    expect(spec.layer[1].mark.type).toBe('line');
    expect(spec.layer[1].data.values).toEqual([
      { date: '2026-06-15', value: 55, label: '55.0 bpm' },
    ]);
    expect(spec.layer[2].mark).toMatchObject({
      type: 'rect',
      height: 13,
      cornerRadius: 2,
      opacity: 0.72,
    });
    expect(spec.layer[3].mark.type).toBe('text');
    expect(spec.layer[3].encoding.text.field).toBe('label');
  });

  it('builds stacked sleep bars and monthly average trend lines', () => {
    const sleepChart = buildSleepChartMarkdowns(data)[3];
    const spec = parseChartSpec(sleepChart.markdown);

    expect(spec.layer[0].transform[0].fold).toEqual(['rem', 'deep', 'core']);
    expect(spec.layer[0].mark).toEqual({ type: 'bar' });
    expect(spec.layer[0].encoding.y.stack).toBe('zero');
    expect([1, 4, 7].map((index) => spec.layer[index].mark.strokeDash)).toEqual(
      [
        [2, 4],
        [2, 4],
        [2, 4],
      ]
    );
    expect(
      [1, 4, 7].map((index) => spec.layer[index].data.values[0].value)
    ).toEqual([2, 1, 4]);
    expect([3, 6, 9].map((index) => spec.layer[index].mark.type)).toEqual([
      'text',
      'text',
      'text',
    ]);
    expect([3, 6, 9].map((index) => spec.layer[index].mark.color)).toEqual([
      '#000000',
      '#000000',
      '#000000',
    ]);
    expect([2, 5, 8, 11].map((index) => spec.layer[index].mark.type)).toEqual([
      'rect',
      'rect',
      'rect',
      'rect',
    ]);
    expect(spec.layer[10].mark.type).toBe('line');
    expect(spec.layer[10].data.values).toEqual([
      { date: '2026-06-15', value: 7, label: '7.00 h' },
    ]);
    expect(spec.layer[12].mark.type).toBe('text');
  });

  it('omits monthly trend lines when there is no sleep data', () => {
    const empty = buildSleepDashboardData(
      { metrics: [] },
      { metrics: [] },
      { metrics: [] },
      []
    );
    const sleepChart = buildSleepChartMarkdowns(empty)[3];
    const spec = parseChartSpec(sleepChart.markdown);

    expect(spec.layer).toHaveLength(1);
  });

  it('renders all four chart specs to SVG', async () => {
    const renderedCharts = await Promise.all(
      buildSleepChartMarkdowns(data).map((chart) =>
        renderMarkdown(chart.markdown)
      )
    );

    expect(renderedCharts.every((chart) => chart.includes('<svg'))).toBe(true);
    expect(
      renderedCharts.every((chart) => !chart.includes('Error rendering chart'))
    ).toBe(true);
  });
});
