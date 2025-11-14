import React from 'react';

import img from '@src/utils/image';

interface ImgProps {
  path: string;
  alt: string;
  defaultWidth?: 80 | 240 | 480 | 720 | 960 | 1440;
  className?: string;
}

function Img({ path, alt, className, defaultWidth = 240 }: ImgProps) {
  const widths: number[] = [80, 240, 480, 720, 960, 1440];
  const optimizedBase = img.getOptimizedBase(path);

  return (
    <img
      srcSet={widths
        .map((width) => {
          return `${optimizedBase}/w-${width}.webp ${width}w`;
        })
        .join(', ')}
      src={`${optimizedBase}/w-${defaultWidth}.webp`}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}

export default Img;
