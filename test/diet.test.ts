import { describe, expect, it } from 'bun:test';
import { buildDietLogDataFromMacros } from '@src/domain/diet';

describe('diet log helpers', () => {
  it('builds calorie time series from macros api data', () => {
    const macros = {
      '2026-07-05': {
        date: '2026-07-05',
        calories: 1578,
        carbs_g: 215.5,
        protein_g: 81,
        fat_g: 48,
      },
      '2026-07-03': {
        date: '2026-07-03',
        calories: 1058,
        carbs_g: 140.4,
        protein_g: 89.6,
        fat_g: 17,
      },
      '2026-07-04': {
        date: '2026-07-04',
        calories: 1062,
        carbs_g: 95.5,
        protein_g: 127,
        fat_g: 15.9,
      },
    };

    expect(buildDietLogDataFromMacros(macros)).toEqual({
      metrics: [
        { date: '2026-07-03', qty: 1058 },
        { date: '2026-07-04', qty: 1062 },
        { date: '2026-07-05', qty: 1578 },
      ],
    });
  });

  it('builds protein time series from macros api data', () => {
    expect(
      buildDietLogDataFromMacros(
        {
          '2026-07-05': {
            date: '2026-07-05',
            calories: 1578,
            carbs_g: 215.5,
            protein_g: 81,
            fat_g: 48,
          },
          '2026-07-03': {
            date: '2026-07-03',
            calories: 1058,
            carbs_g: 140.4,
            protein_g: 89.6,
            fat_g: 17,
          },
        },
        'protein_g'
      )
    ).toEqual({
      metrics: [
        { date: '2026-07-03', qty: 89.6 },
        { date: '2026-07-05', qty: 81 },
      ],
    });
  });
});
