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

async function fetchWorkoutStats(): Promise<WorkoutStats> {
  const response = await fetch(
    `${config.stateOfBeingBase}/${config.vault.workouts}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch workout data: ${response.status} ${response.statusText}`
    );
  }

  const entries = (await response.json()) as WorkoutEntry[];
  return buildWorkoutStatsFromEntries(entries);
}

export {
  buildWorkoutStatsFromEntries,
  fetchWorkoutStats,
  getWeekdaysInMonth,
  getWeekdaysPassed,
  parseWorkoutDate,
};
