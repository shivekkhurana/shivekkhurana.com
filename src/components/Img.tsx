import React from 'react';

import img from '@src/utils/image';

interface ImgProps {
  path: string;
  alt: string;
  defaultWidth?: 32 | 80 | 240 | 480 | 720 | 960 | 1440;
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
  const widths: number[] = [32, 80, 240, 480, 720, 960, 1440];
  const optimizedBase = img.getOptimizedBase(path);

  // Use the smallest width as fallback for src (for older browsers)
  // The browser will use srcset if supported, which will override src
  const fallbackWidth = defaultWidth || 32;

  // For small images, filter srcset to only include widths <= defaultWidth
  // This prevents loading unnecessarily large images
  const filteredWidths =
    defaultWidth <= 80 ? widths.filter((w) => w <= defaultWidth) : widths;

  // Generate sizes attribute based on defaultWidth
  // For small images like logos, use a fixed size
  // For larger images, use responsive sizes
  const sizesAttr =
    defaultWidth <= 80
      ? `${defaultWidth}px`
      : '(max-width: 480px) 32px, (max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 160px, (max-width: 1440px) 720px, 1440px';

  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> & {
    fetchPriority?: 'high' | 'low' | 'auto';
  } = {
    srcSet: filteredWidths
      .map((width) => {
        return `${optimizedBase}/w-${width}.webp ${width}w`;
      })
      .join(', '),
    sizes: sizesAttr,
    src: `${optimizedBase}/w-${fallbackWidth}.webp`,
    alt,
    className,
    loading,
    ...(fetchPriority && { fetchpriority: fetchPriority }),
  };

  return <img {...imgProps} />;
}

export default Img;
