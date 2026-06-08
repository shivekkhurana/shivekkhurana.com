import { describe, expect, it } from 'bun:test';
import {
  buildWorkoutChartMarkdowns,
  formatWorkoutUpdatedAt,
} from '@src/domain/workouts-markdown';
import {
  buildWorkoutDashboardStatsFromEntries,
  buildWorkoutStatsFromEntries,
  getWeekdaysInMonth,
  getWeekdaysPassed,
  parseWorkoutDate,
} from '@src/domain/workouts';

describe('workout date helpers', () => {
  it('parses valid ISO workout dates using date parts', () => {
    expect(parseWorkoutDate('2026-06-03')).toEqual({
      year: 2026,
      month: 6,
      day: 3,
    });
  });

  it('rejects invalid workout dates', () => {
    expect(parseWorkoutDate('2026-02-30')).toBeNull();
    expect(parseWorkoutDate('June 3, 2026')).toBeNull();
  });

  it('counts weekdays in a known month', () => {
    expect(getWeekdaysInMonth(2026, 6)).toBe(22);
  });

  it('counts weekdays passed inclusively for the current month', () => {
    expect(getWeekdaysPassed(2026, 6, new Date(2026, 5, 3))).toBe(3);
  });
});

describe('buildWorkoutDashboardStatsFromEntries', () => {
  const today = new Date(2026, 5, 4);
  const entries = [
    { date: '2024-01-01', note: '' },
    { date: '2024-12-31', note: '' },
    { date: '2025-01-03', note: '' },
    { date: '2025-02-04', note: '' },
    { date: '2025-02-05', note: '' },
    { date: '2026-01-01', note: '' },
    { date: '2026-06-01', note: '' },
    { date: '2026-06-03', note: '' },
    { date: '2026-06-03', note: '' },
  ];

  it('counts current month and current year workouts', () => {
    const stats = buildWorkoutDashboardStatsFromEntries(entries, today);

    expect(stats.currentDay).toBe(4);
    expect(stats.totalCurrentMonth).toBe(3);
    expect(stats.totalCurrentYear).toBe(4);
  });

  it('averages completed years and excludes the current year', () => {
    const stats = buildWorkoutDashboardStatsFromEntries(entries, today);

    expect(stats.averageCompletedYearWorkouts).toBe(2.5);
  });

  it('excludes months before the first workout from the yearly average', () => {
    const stats = buildWorkoutDashboardStatsFromEntries(
      [
        { date: '2024-11-01', note: '' },
        { date: '2024-12-01', note: '' },
      ],
      new Date(2025, 5, 4)
    );

    expect(stats.averageCompletedYearWorkouts).toBe(12);
  });

  it('includes empty months after the first workout in the yearly average', () => {
    const stats = buildWorkoutDashboardStatsFromEntries(
      [
        { date: '2024-01-01', note: '' },
        { date: '2024-12-01', note: '' },
      ],
      new Date(2025, 5, 4)
    );

    expect(stats.averageCompletedYearWorkouts).toBe(2);
  });

  it('zero-fills current month daily buckets', () => {
    const stats = buildWorkoutDashboardStatsFromEntries(entries, today);

    expect(stats.currentMonthDailyCounts).toHaveLength(30);
    expect(stats.currentMonthDailyCounts[0]).toEqual({
      date: '2026-06-01',
      count: 1,
    });
    expect(stats.currentMonthDailyCounts[1]).toEqual({
      date: '2026-06-02',
      count: 0,
    });
    expect(stats.currentMonthDailyCounts[2]).toEqual({
      date: '2026-06-03',
      count: 2,
    });
  });

  it('zero-fills current year monthly buckets', () => {
    const stats = buildWorkoutDashboardStatsFromEntries(entries, today);

    expect(stats.currentYearMonthlyCounts).toHaveLength(12);
    expect(stats.currentYearMonthlyCounts[0]).toEqual({
      month: '01',
      count: 1,
    });
    expect(stats.currentYearMonthlyCounts[1]).toEqual({
      month: '02',
      count: 0,
    });
    expect(stats.currentYearMonthlyCounts[5]).toEqual({
      month: '06',
      count: 3,
    });
  });

  it('aggregates yearly counts for all years in the dataset', () => {
    const stats = buildWorkoutDashboardStatsFromEntries(entries, today);

    expect(stats.allTimeYearlyCounts).toEqual([
      { year: 2024, count: 2 },
      { year: 2025, count: 3 },
      { year: 2026, count: 4 },
    ]);
  });

  it('finds best and worst month highlights', () => {
    const stats = buildWorkoutDashboardStatsFromEntries(entries, today);

    expect(stats.bestMonthThisYear).toEqual({
      year: 2026,
      month: 1,
      count: 1,
    });
    expect(stats.worstMonthThisYear).toEqual({
      year: 2026,
      month: 2,
      count: 0,
    });
    expect(stats.bestMonthEver).toEqual({
      year: 2026,
      month: 6,
      count: 3,
    });
  });

  it('throws when invalid dates would corrupt dashboard stats', () => {
    expect(() =>
      buildWorkoutDashboardStatsFromEntries(
        [{ date: '2026-13-01', note: '' }],
        today
      )
    ).toThrow('Invalid workout date: 2026-13-01');
  });
});

describe('workout chart markdown', () => {
  function parseChartSpec(markdown: string) {
    return JSON.parse(markdown.replace(/^```vega-lite\n|\n```$/g, ''));
  }

  it('formats the updated timestamp in GMT', () => {
    expect(formatWorkoutUpdatedAt(new Date(Date.UTC(2026, 5, 4, 12, 30)))).toBe(
      'Thu, 04 Jun 2026 12:30:00 GMT'
    );
  });

  it('builds three Vega-Lite markdown blocks without page text', () => {
    const stats = buildWorkoutDashboardStatsFromEntries(
      [{ date: '2026-06-01', note: '' }],
      new Date(2026, 5, 4)
    );
    const charts = buildWorkoutChartMarkdowns(stats);

    expect(charts).toHaveLength(3);
    expect(charts.map((chart) => chart.title)).toEqual([
      'Current Month Workouts',
      'Current Year Workouts',
      'All-Time Workouts',
    ]);
    expect(
      charts.every((chart) => chart.markdown.startsWith('```vega-lite'))
    ).toBe(true);
    expect(charts.join('\n')).not.toContain('Last updated at');
    expect(
      charts.every(
        (chart) => parseChartSpec(chart.markdown).config.view.stroke === null
      )
    ).toBe(true);
  });

  it('builds the current month as an eleven-column binary workout grid', () => {
    const stats = buildWorkoutDashboardStatsFromEntries(
      [
        { date: '2026-06-01', note: '' },
        { date: '2026-06-03', note: '' },
        { date: '2026-06-03', note: '' },
      ],
      new Date(2026, 5, 4)
    );
    const [currentMonth] = buildWorkoutChartMarkdowns(stats);
    const spec = parseChartSpec(currentMonth.markdown);

    expect(spec.layer[0].mark).toEqual({
      type: 'rect',
      cornerRadius: 4,
    });
    expect(spec.config.view).toEqual({
      stroke: null,
    });
    expect(spec.width).toEqual({ step: 56 });
    expect(spec.height).toEqual({ step: 56 });
    expect(spec.transform).toEqual([
      {
        window: [{ op: 'row_number', as: 'dayIndex' }],
        sort: [{ field: 'date', order: 'ascending' }],
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
    ]);
    expect(spec.layer[0].encoding.x).toMatchObject({
      field: 'column',
      type: 'ordinal',
      axis: null,
      scale: {
        paddingInner: 0.12,
        paddingOuter: 0.06,
      },
    });
    expect(spec.layer[0].encoding.y).toMatchObject({
      field: 'row',
      type: 'ordinal',
      axis: null,
      scale: {
        paddingInner: 0.12,
        paddingOuter: 0.06,
      },
    });
    expect(spec.layer[0].encoding.color).toMatchObject({
      condition: [
        {
          test: 'datum.count > 0',
          value: '#6B7280',
        },
        {
          test: 'datum.dayOfMonth > 4',
          value: '#F3F4F6',
        },
      ],
      value: '#E5E7EB',
      legend: null,
    });
    expect(spec.data.values).toContainEqual({
      date: '2026-06-02',
      count: 0,
    });
    expect(spec.data.values).toContainEqual({
      date: '2026-06-03',
      count: 2,
    });
    expect(spec.layer[0].encoding.tooltip).toHaveLength(2);
    expect(spec.layer[1]).toMatchObject({
      mark: {
        type: 'text',
        fontSize: 13,
        fontWeight: 'bold',
      },
      encoding: {
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
    });
  });

  it('hides only the vertical axis line on bar charts', () => {
    const stats = buildWorkoutDashboardStatsFromEntries(
      [{ date: '2026-06-01', note: '' }],
      new Date(2026, 5, 4)
    );
    const [, currentYear, allTime] = buildWorkoutChartMarkdowns(stats);

    expect(
      parseChartSpec(currentYear.markdown).layer[0].encoding.y.axis
    ).toEqual({
      domain: false,
    });
    expect(parseChartSpec(allTime.markdown).layer[0].encoding.y.axis).toEqual({
      domain: false,
    });
  });

  it('hides zero-value labels for current and future months', () => {
    const stats = buildWorkoutDashboardStatsFromEntries(
      [{ date: '2026-01-01', note: '' }],
      new Date(2026, 5, 4)
    );
    const [, currentYear] = buildWorkoutChartMarkdowns(stats);
    const spec = parseChartSpec(currentYear.markdown);

    expect(spec.layer[1].transform).toEqual([
      {
        filter: "datum.count > 0 || datum.month < '06'",
      },
    ]);
  });
});

describe('buildWorkoutStatsFromEntries', () => {
  it('counts only v2 entries from the current month', () => {
    const stats = buildWorkoutStatsFromEntries(
      [
        { date: '2026-05-31', note: '' },
        { date: '2026-06-01', note: '' },
        { date: '2026-06-02', note: '' },
        { date: '2026-06-03', note: '' },
      ],
      new Date(2026, 5, 4)
    );

    expect(stats.latest.count).toBe(3);
    expect(stats.latest.target).toBe(22);
    expect(stats.weekdaysPassed).toBe(4);
  });

  it('uses weekdays passed for the current month show-up rate', () => {
    const stats = buildWorkoutStatsFromEntries(
      [
        { date: '2026-06-01', note: '' },
        { date: '2026-06-02', note: '' },
        { date: '2026-06-03', note: '' },
      ],
      new Date(2026, 5, 4)
    );

    expect(stats.latest.showUpRate).toBe('75');
  });

  it('throws when invalid dates would corrupt stats', () => {
    expect(() =>
      buildWorkoutStatsFromEntries(
        [{ date: '2026-99-99', note: '' }],
        new Date(2026, 5, 4)
      )
    ).toThrow('Invalid workout date: 2026-99-99');
  });
});
