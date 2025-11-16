import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { convertDateString } from '@src/utils/time';
import type { Post } from '@contentlayer/generated';
import Img from '@src/components/Img';

interface PostItemProps extends PropsWithChildren {
  post: Post;
}

function PostItem({ post }: PostItemProps) {
  const { title, slug, publishedOn, heroImg } = post;

  return (
    <a
      href={`/blog/${slug}`}
      className={clsx(
        'flex items-center gap-1',
        'group',
        'px-3',
        'transition-colors',
        'hover:bg-gray-100'
      )}
    >
      <div
        className={clsx(
          'w-1/12',
          'text-xs opacity-60',
          'group-hover:opacity-90'
        )}
      >
        {convertDateString(publishedOn!).split(',')[0]}
      </div>
      <div
        className={clsx(
          'w-10/12',
          'text-md leading-6',
          'flex items-center gap-4'
        )}
      >
        <Img
          path={heroImg}
          alt={title ?? ''}
          defaultWidth={80}
          className={clsx('w-20 aspect-video object-cover', 'opacity-100')}
        />

        <span
          className={clsx(
            'underline underline-offset-4 decoration-gray-200',
            'group-hover:decoration-pink-500'
          )}
        >
          {title}
        </span>
      </div>
    </a>
  );
}

export default PostItem;
