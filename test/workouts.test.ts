import { describe, expect, it } from 'bun:test';
import {
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
