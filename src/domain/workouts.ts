import config from '@src/config';

export type WorkoutEntry = {
  date: string;
  note: string;
};

type WorkoutMonthData = {
  target: number;
  count: number;
  showUpRate: string;
};

export type WorkoutStats = {
  latest: WorkoutMonthData;
  weekdays: number;
  weekdaysPassed: number;
  currentYear: number;
  currentMonth: number;
};

export type WorkoutDailyBucket = {
  date: string;
  count: number;
};

export type WorkoutMonthlyBucket = {
  month: string;
  count: number;
};

export type WorkoutYearlyBucket = {
  year: number;
  count: number;
};

export type WorkoutMonthHighlight = {
  year: number;
  month: number;
  count: number;
};

export type WorkoutDashboardStats = WorkoutStats & {
  currentDay: number;
  totalCurrentMonth: number;
  totalCurrentYear: number;
  averageCompletedYearWorkouts: number;
  allTimePerfectMonthCount: number;
  bestMonthThisYear: WorkoutMonthHighlight;
  bestMonthEver: WorkoutMonthHighlight;
  currentMonthDailyCounts: WorkoutDailyBucket[];
  currentYearMonthlyCounts: WorkoutMonthlyBucket[];
  allTimeYearlyCounts: WorkoutYearlyBucket[];
};

type ParsedWorkoutDate = {
  year: number;
  month: number;
  day: number;
};

const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseWorkoutDate(date: string): ParsedWorkoutDate | null {
  const match = isoDatePattern.exec(date);

  if (!match) {
    return null;
  }

  const [, yearString, monthString, dayString] = match;
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function getWeekdaysInMonth(year: number, month: number): number {
  const lastDay = new Date(year, month, 0).getDate();
  let weekdays = 0;

  for (let day = 1; day <= lastDay; day += 1) {
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      weekdays += 1;
    }
  }

  return weekdays;
}

function getWeekdaysPassed(
  year: number,
  month: number,
  today = new Date()
): number {
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return getWeekdaysInMonth(year, month);
  }

  if (year > currentYear || (year === currentYear && month > currentMonth)) {
    return 0;
  }

  let weekdays = 0;

  for (let day = 1; day <= today.getDate(); day += 1) {
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      weekdays += 1;
    }
  }

  return weekdays;
}

function buildWorkoutStatsFromEntries(
  entries: WorkoutEntry[],
  today = new Date()
): WorkoutStats {
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const weekdays = getWeekdaysInMonth(currentYear, currentMonth);
  const weekdaysPassed = getWeekdaysPassed(currentYear, currentMonth, today);
  const count = entries.reduce((total, entry) => {
    const parsedDate = parseWorkoutDate(entry.date);

    if (!parsedDate) {
      throw new Error(`Invalid workout date: ${entry.date}`);
    }

    if (parsedDate.year !== currentYear || parsedDate.month !== currentMonth) {
      return total;
    }

    return total + 1;
  }, 0);
  const showUpRate =
    weekdaysPassed > 0 ? ((count * 100) / weekdaysPassed).toFixed(0) : '0';

  return {
    latest: {
      target: weekdays,
      count,
      showUpRate,
    },
    weekdays,
    weekdaysPassed,
    currentYear,
    currentMonth,
  };
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0'
  )}`;
}

function formatYearMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

function parseYearMonthKey(
  key: string
): Pick<WorkoutMonthHighlight, 'year' | 'month'> {
  const [year, month] = key.split('-').map(Number);
  return { year, month };
}

function pickBestMonth(months: WorkoutMonthHighlight[]): WorkoutMonthHighlight {
  return months.reduce((best, month) =>
    month.count > best.count ? month : best
  );
}

function buildWorkoutDashboardStatsFromEntries(
  entries: WorkoutEntry[],
  today = new Date()
): WorkoutDashboardStats {
  const baseStats = buildWorkoutStatsFromEntries(entries, today);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
  const dailyCounts = new Map<string, number>();
  const monthlyCounts = new Map<number, number>();
  const allTimeMonthlyCounts = new Map<string, number>();
  const yearlyCounts = new Map<number, number>();
  let totalCurrentYear = 0;
  let completedPeriodWorkoutCount = 0;
  let firstCompletedPeriodMonth: Pick<
    ParsedWorkoutDate,
    'year' | 'month'
  > | null = null;

  entries.forEach((entry) => {
    const parsedDate = parseWorkoutDate(entry.date);

    if (!parsedDate) {
      throw new Error(`Invalid workout date: ${entry.date}`);
    }

    yearlyCounts.set(
      parsedDate.year,
      (yearlyCounts.get(parsedDate.year) ?? 0) + 1
    );
    const yearMonthKey = formatYearMonthKey(parsedDate.year, parsedDate.month);
    allTimeMonthlyCounts.set(
      yearMonthKey,
      (allTimeMonthlyCounts.get(yearMonthKey) ?? 0) + 1
    );

    if (parsedDate.year === currentYear) {
      totalCurrentYear += 1;
      monthlyCounts.set(
        parsedDate.month,
        (monthlyCounts.get(parsedDate.month) ?? 0) + 1
      );
    } else if (parsedDate.year < currentYear) {
      completedPeriodWorkoutCount += 1;

      if (
        !firstCompletedPeriodMonth ||
        parsedDate.year < firstCompletedPeriodMonth.year ||
        (parsedDate.year === firstCompletedPeriodMonth.year &&
          parsedDate.month < firstCompletedPeriodMonth.month)
      ) {
        firstCompletedPeriodMonth = {
          year: parsedDate.year,
          month: parsedDate.month,
        };
      }
    }

    if (parsedDate.year === currentYear && parsedDate.month === currentMonth) {
      dailyCounts.set(entry.date, (dailyCounts.get(entry.date) ?? 0) + 1);
    }
  });

  // Months before the first workout are unknown, but zero-workout months after
  // recording begins are real data and should lower the annualized average.
  const completedPeriodMonthCount = firstCompletedPeriodMonth
    ? (currentYear - firstCompletedPeriodMonth.year) * 12 -
      firstCompletedPeriodMonth.month +
      1
    : 0;
  const averageCompletedYearWorkouts =
    completedPeriodMonthCount > 0
      ? (completedPeriodWorkoutCount * 12) / completedPeriodMonthCount
      : 0;
  const completedCurrentYearMonthCount = Math.max(1, currentMonth - 1);
  const completedCurrentYearMonths = Array.from(
    { length: completedCurrentYearMonthCount },
    (_, index) => {
      const month = index + 1;

      return {
        year: currentYear,
        month,
        count: monthlyCounts.get(month) ?? 0,
      };
    }
  );
  const allTimeMonthlyHighlights =
    allTimeMonthlyCounts.size > 0
      ? [...allTimeMonthlyCounts.entries()]
          .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
          .map(([key, count]) => ({
            ...parseYearMonthKey(key),
            count,
          }))
      : [{ year: currentYear, month: currentMonth, count: 0 }];
  const allTimePerfectMonthCount = allTimeMonthlyHighlights.filter((month) => {
    if (
      month.year > currentYear ||
      (month.year === currentYear && month.month >= currentMonth)
    ) {
      return false;
    }

    return month.count >= getWeekdaysInMonth(month.year, month.month);
  }).length;

  return {
    ...baseStats,
    currentDay: today.getDate(),
    totalCurrentMonth: baseStats.latest.count,
    totalCurrentYear,
    averageCompletedYearWorkouts,
    allTimePerfectMonthCount,
    bestMonthThisYear: pickBestMonth(completedCurrentYearMonths),
    bestMonthEver: pickBestMonth(allTimeMonthlyHighlights),
    currentMonthDailyCounts: Array.from(
      { length: daysInCurrentMonth },
      (_, index) => {
        const day = index + 1;
        const date = formatDateKey(currentYear, currentMonth, day);

        return {
          date,
          count: dailyCounts.get(date) ?? 0,
        };
      }
    ),
    currentYearMonthlyCounts: Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;

      return {
        month: String(month).padStart(2, '0'),
        count: monthlyCounts.get(month) ?? 0,
      };
    }),
    allTimeYearlyCounts: [...yearlyCounts.entries()]
      .sort(([leftYear], [rightYear]) => leftYear - rightYear)
      .map(([year, count]) => ({ year, count })),
  };
}

async function fetchWorkoutEntries(): Promise<WorkoutEntry[]> {
  const response = await fetch(
    `${config.stateOfBeingBase}/${config.vault.workouts}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch workout data: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as WorkoutEntry[];
}

async function fetchWorkoutStats(): Promise<WorkoutStats> {
  const entries = await fetchWorkoutEntries();
  return buildWorkoutStatsFromEntries(entries);
}

async function fetchWorkoutDashboardStats(
  today = new Date()
): Promise<WorkoutDashboardStats> {
  const entries = await fetchWorkoutEntries();
  return buildWorkoutDashboardStatsFromEntries(entries, today);
}

export {
  buildWorkoutDashboardStatsFromEntries,
  buildWorkoutStatsFromEntries,
  fetchWorkoutDashboardStats,
  fetchWorkoutEntries,
  fetchWorkoutStats,
  getWeekdaysInMonth,
  getWeekdaysPassed,
  parseWorkoutDate,
};
