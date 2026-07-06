import config from '@src/config';
import type {
  DietLogData,
  MacroMetric,
  MacrosData,
} from '@src/domain/diet.types';

export function buildDietLogDataFromMacros(
  macros: MacrosData,
  metric: MacroMetric = 'calories'
): DietLogData {
  const entries = Object.values(macros).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return {
    metrics: entries.map((entry) => ({
      date: entry.date,
      qty: entry[metric],
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

export async function fetchProteinData(): Promise<DietLogData> {
  const macros = await fetchMacrosData();

  return buildDietLogDataFromMacros(macros, 'protein_g');
}
