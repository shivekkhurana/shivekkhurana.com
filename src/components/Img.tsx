import React from 'react';

import img from '@src/utils/image';

interface ImgProps {
  path: string;
  alt: string;
  defaultWidth?: 80 | 240 | 480 | 720 | 960 | 1440;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

function Img({
  path,
  alt,
  className,
  defaultWidth = 240,
  loading = 'lazy',
  fetchPriority,
}: ImgProps) {
  const widths: number[] = [80, 240, 480, 720, 960, 1440];
  const optimizedBase = img.getOptimizedBase(path);

  // Use the smallest width as fallback for src (for older browsers)
  // The browser will use srcset if supported, which will override src
  const fallbackWidth = 80;

  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> & {
    fetchPriority?: 'high' | 'low' | 'auto';
  } = {
    srcSet: widths
      .map((width) => {
        return `${optimizedBase}/w-${width}.webp ${width}w`;
      })
      .join(', '),
    sizes:
      '(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 160px, 224px',
    src: `${optimizedBase}/w-${fallbackWidth}.webp`,
    alt,
    className,
    loading,
    ...(fetchPriority && { fetchpriority: fetchPriority }),
  };

  return <img {...imgProps} />;
}

export default Img;
