import config from '@src/config';

export type DietLogSummary = {
  date: string;
  totalCalories: number;
};

type GitHubContentItem = {
  name: string;
  type: string;
  download_url: string | null;
};

const dietLogFilenamePattern = /^(\d{4}-\d{2}-\d{2})_diet_log\.md$/;

function extractFrontmatter(markdown: string): string {
  const match = /^---\n([\s\S]*?)\n---/.exec(markdown);

  if (!match) {
    throw new Error('Diet log is missing YAML frontmatter');
  }

  return match[1];
}

function readFrontmatterNumber(frontmatter: string, key: string): number {
  const line = frontmatter
    .split('\n')
    .find((entry) => entry.startsWith(`${key}:`));

  if (!line) {
    throw new Error(`Diet log is missing ${key}`);
  }

  const value = Number(line.slice(line.indexOf(':') + 1).trim());

  if (!Number.isFinite(value)) {
    throw new Error(`Diet log has invalid ${key}`);
  }

  return value;
}

export function parseDietLogSummary(markdown: string): DietLogSummary {
  const frontmatter = extractFrontmatter(markdown);
  const dateLine = frontmatter
    .split('\n')
    .find((entry) => entry.startsWith('date:'));

  if (!dateLine) {
    throw new Error('Diet log is missing date');
  }

  const date = dateLine.slice(dateLine.indexOf(':') + 1).trim();

  return {
    date,
    totalCalories: readFrontmatterNumber(frontmatter, 'diet_total_calories'),
  };
}

export function getLatestDietLogFile(
  files: GitHubContentItem[]
): GitHubContentItem | null {
  const dietLogs = files
    .filter(
      (file) =>
        file.type === 'file' &&
        file.download_url &&
        dietLogFilenamePattern.test(file.name)
    )
    .sort((a, b) => b.name.localeCompare(a.name));

  return dietLogs[0] ?? null;
}

export async function fetchLatestDietLogSummary(): Promise<DietLogSummary | null> {
  const files = (await fetch(
    `${config.stateOfBeingGitHubApiBase}${config.vault.dietLogs}`
  ).then((res) => res.json())) as GitHubContentItem[];
  const latestFile = getLatestDietLogFile(files);

  if (!latestFile?.download_url) {
    return null;
  }

  const markdown = await fetch(latestFile.download_url).then((res) =>
    res.text()
  );

  return parseDietLogSummary(markdown);
}
