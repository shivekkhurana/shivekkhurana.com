import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { convertDateString } from '@src/utils/time';
import type { Video } from '@contentlayer/generated';
import Img from '@src/components/Img';

interface VideoCardProps extends PropsWithChildren {
  video: Video;
}

function getYouTubeThumbnail(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
  }
  return null;
}

function VideoCard({ video }: VideoCardProps) {
  const { title, url, publishedOn, coverImg } = video;
  const thumbnail = coverImg || (url ? getYouTubeThumbnail(url) : null);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx('group', 'block')}
    >
      <div
        className={clsx(
          'aspect-video',
          'bg-gray-100',
          'overflow-hidden',
          'border border-black/15',
          'mb-3'
        )}
      >
        {thumbnail ? (
          thumbnail.startsWith('http') ? (
            <img
              src={thumbnail}
              alt={title ?? ''}
              className={clsx(
                'w-full h-full object-cover',
                'group-hover:scale-105 transition-transform duration-300'
              )}
            />
          ) : (
            <Img
              path={thumbnail}
              alt={title ?? ''}
              defaultWidth={400}
              className={clsx(
                'w-full h-full object-cover',
                'group-hover:scale-105 transition-transform duration-300'
              )}
            />
          )
        ) : (
          <div
            className={clsx(
              'w-full h-full',
              'flex items-center justify-center',
              'text-gray-400'
            )}
          >
            <svg
              className="w-12 h-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>
      <h3
        className={clsx(
          'font-medium text-base leading-snug',
          'line-clamp-2',
          'group-hover:text-pink-600 transition-colors'
        )}
      >
        {title}
      </h3>
      <p className={clsx('text-xs text-gray-500 mt-1')}>
        {convertDateString(publishedOn!)}
      </p>
    </a>
  );
}

export default VideoCard;
