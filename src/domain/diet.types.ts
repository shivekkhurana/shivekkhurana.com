export type DailyMacroTotals = {
  date: string;
  calories: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
};

export type DietLogMetric = {
  qty: number;
  date: string;
};

export type DietLogData = {
  metrics: DietLogMetric[];
};

export type MacroMetric = 'calories' | 'protein_g';

export type MacrosData = Record<string, DailyMacroTotals>;
