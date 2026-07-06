import config from '@src/config';
import type { HealthMetricData } from '@src/domain/healthkit.types';

export type DailyMacroTotals = {
  date: string;
  calories: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
};

export type DietLogData = HealthMetricData;

export type MacrosData = Record<string, DailyMacroTotals>;

export function buildDietLogDataFromMacros(macros: MacrosData): DietLogData {
  const entries = Object.values(macros).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return {
    metrics: entries.map((entry) => ({
      date: entry.date,
      qty: entry.calories,
    })),
  };
}

export async function fetchMacrosData(): Promise<MacrosData> {
  const response = await fetch(
    `${config.stateOfBeingPagesBase}${config.vault.macros}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch macros data: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as MacrosData;
}

export async function fetchDietLogData(): Promise<DietLogData> {
  const macros = await fetchMacrosData();

  return buildDietLogDataFromMacros(macros);
}
