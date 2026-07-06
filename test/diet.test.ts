import { describe, expect, it } from 'bun:test';
import {
  getDietLogFiles,
  getLatestDietLogFile,
  parseDietLogSummary,
} from '@src/domain/diet';

describe('diet log helpers', () => {
  it('parses calorie total from diet log frontmatter', () => {
    expect(
      parseDietLogSummary(`---
date: 2026-07-05
diet_total_calories: 1578
diet_total_carbs_g: 215.5
---

# Diet log
`)
    ).toEqual({
      date: '2026-07-05',
      totalCalories: 1578,
    });
  });

  it('selects the latest dated diet log file', () => {
    expect(
      getLatestDietLogFile([
        {
          name: '.gitkeep',
          type: 'file',
          download_url: 'https://example.com/.gitkeep',
        },
        {
          name: '2026-07-04_diet_log.md',
          type: 'file',
          download_url: 'https://example.com/2026-07-04_diet_log.md',
        },
        {
          name: '2026-07-05_diet_log.md',
          type: 'file',
          download_url: 'https://example.com/2026-07-05_diet_log.md',
        },
      ])?.name
    ).toBe('2026-07-05_diet_log.md');
  });

  it('sorts diet log files from oldest to newest', () => {
    expect(
      getDietLogFiles([
        {
          name: '2026-07-05_diet_log.md',
          type: 'file',
          download_url: 'https://example.com/2026-07-05_diet_log.md',
        },
        {
          name: '2026-07-03_diet_log.md',
          type: 'file',
          download_url: 'https://example.com/2026-07-03_diet_log.md',
        },
      ]).map((file) => file.name)
    ).toEqual(['2026-07-03_diet_log.md', '2026-07-05_diet_log.md']);
  });
});
