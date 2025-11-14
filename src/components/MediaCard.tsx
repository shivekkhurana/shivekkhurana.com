import clsx from 'clsx';
import Img from '@src/components/Img';

interface MediaCardProps {
  src: string;
  alt: string;
  color: string; // rgba value for border (e.g., 'rgba(128, 128, 128, 1)')
  backgroundColor: string; // rgba value for background with opacity (e.g., 'rgba(128, 128, 128, 0.15)')
  title: string;
  type?: 'image' | 'video'; // Defaults to 'image'
}

function MediaCard({
  src,
  alt,
  color,
  backgroundColor,
  title,
  type = 'image',
}: MediaCardProps) {
  return (
    <div
      className={clsx(
        // Layout
        'relative inline-block',
        // Shape
        'rounded',
        'p-1',
        'border border-gray-300',
        // Responsive width
        'w-20 sm:w-24 md:w-40 lg:w-56'
      )}
      style={
        {
          // backgroundColor: backgroundColor,
        }
      }
    >
      {/* Media container */}
      <div
        className={clsx(
          // Layout
          'relative overflow-hidden',
          // Shape
          'rounded-sm',
          'p-1',
          'border border-gray-300'
        )}
      >
        {type === 'video' ? (
          <video
            src={src}
            className={clsx(
              // Display
              'block',
              // Sizing - 768x1024 aspect ratio (3:4)
              'w-full',
              'aspect-[3/4]',
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
              // Sizing
              'h-auto w-full'
            )}
            defaultWidth={480}
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
