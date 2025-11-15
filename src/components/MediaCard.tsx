import clsx from 'clsx';
import Img from '@src/components/Img';

interface MediaCardProps {
  src: string;
  alt: string;
  title: string;
  type?: 'image' | 'video'; // Defaults to 'image'
}

function MediaCard({ src, alt, title, type = 'image' }: MediaCardProps) {
  return (
    <div
      className={clsx(
        // Layout
        'flex flex-col',
        // Shape
        'rounded',
        'p-1',
        'border border-gray-100',
        'aspect-[3/4]'
      )}
    >
      {/* Media container */}
      <div
        className={clsx(
          // Layout
          'overflow-hidden flex-1 min-h-0',
          // Shape
          'rounded-sm',
          'p-1',
          'bg-white',
          'border border-gray-200'
        )}
      >
        {type === 'video' ? (
          <video
            src={src}
            className={clsx(
              // Display
              'block',
              // Sizing - fill container
              'w-full h-full',
              'shadow-sm',
              // Cropping
              'object-cover'
            )}
            loop
            muted
            playsInline
            controls
            aria-label={alt}
          />
        ) : (
          <Img
            path={src}
            alt={alt}
            className={clsx(
              // Display
              'block',
              // Sizing - fill container
              'w-full h-full',
              // Cropping
              'object-cover'
            )}
          />
        )}
      </div>

      {/* Title at the bottom */}
      <div
        className={clsx(
          // Spacing
          'mt-1',
          // Typography
          'text-center text-sm tracking-[0.5px] text-black',
          // Text behavior
          'whitespace-pre-line',
          'font-sans'
        )}
      >
        {title}
      </div>
    </div>
  );
}

export default MediaCard;
