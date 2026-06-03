interface OptimizedPaths {
  w80: string;
  w240Blurred: string;
  w240: string;
  w480Blurred: string;
  w480: string;
  w720: string;
  w960: string;
  w1440: string;
}

function getOptimizedBase(path: string): string {
  return path.replace('img/', 'optimized-img/');
}

function getOptimizedPaths(path: string): OptimizedPaths {
  const base = getOptimizedBase(path);
  return {
    w80: base + '/w-80.webp',
    w240Blurred: base + '/w-240-blurred.webp',
    w240: base + '/w-240.webp',
    w480Blurred: base + '/w-480-blurred.webp',
    w480: base + '/w-480.webp',
    w720: base + '/w-720.webp',
    w960: base + '/w-960.webp',
    w1440: base + '/w-1440.webp',
  };
}

function getOgJpgSrc(path: string): string {
  return `${getOptimizedBase(path)}/og.jpg`;
}

function getSrcSet(path: string): string {
  const widths: number[] = [80, 240, 480, 720, 960, 1440];
  const optimizedPaths = getOptimizedPaths(path);

  return widths.map((w) => optimizedPaths[`${w}w`]).join(', ');
}

export default {
  getOptimizedBase,
  getOptimizedPaths,
  getOgJpgSrc,
  getSrcSet,
};
