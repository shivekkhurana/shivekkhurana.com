import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { convertDateString } from '@src/utils/time';
import type { Post, MicroPost } from '@contentlayer/generated';
import type { TimelineItem } from '@src/domain/content';

function PostLink(props: PropsWithChildren<{ post: Post }>) {
  const { title, slug } = props.post;
  return (
    <a
      href={`/blog/${slug}`}
      className=""
    >
      <div
        className={clsx(
          'underline underline-offset-4 decoration-gray-200',
          'hover:decoration-pink-500 hover:bg-fuchsia-100/60',
          'text-md leading-6'
        )}
      >
        {title}
      </div>
    </a>
  );
}

function MicroPostLog(props: PropsWithChildren<{ microPost: MicroPost }>) {
  const { body } = props.microPost;
  return (
    <div
      className={clsx('text-md leading-6')}
      dangerouslySetInnerHTML={{ __html: body.raw }}
    />
  );
}

function BaseTimelineLog(props: PropsWithChildren<{ t: TimelineItem }>) {
  const { t } = props;
  const getSrc = (itemType: string) => {
    if (itemType === 'Post') {
      return '/img/timelineIcons/post.svg';
    }

    if (itemType === 'MicroPost') {
      return '/img/timelineIcons/writing-bolt.svg';
    }
  };
  return (
    <div className={clsx('flex items-center', 'group')}>
      <div
        className={clsx(
          'w-2/12',
          'text-xs opacity-60',
          'group-hover:opacity-90'
        )}
      >
        {convertDateString(t.publishedOn!).split(',')[0]}
      </div>
      <div className="w-1/12">
        <img
          src={getSrc(t.type)}
          alt={`${t.type} icon`}
          className={clsx('w-6 h-6', 'opacity-50 group-hover:opacity-90')}
        />
      </div>
      <div className={clsx('w-8/12', 'text-md leading-6', 'my-2')}>
        {props.children}
      </div>
    </div>
  );
}

function ComputedComp(props: PropsWithChildren<{ t: TimelineItem }>) {
  const { t } = props;
  if (t.type === 'Post') {
    return <PostLink post={t} />;
  } else if (t.type === 'MicroPost') {
    return <MicroPostLog microPost={t} />;
  }
}

function TimelineLogs(
  props: PropsWithChildren<{ timelineItems: TimelineItem[]; year: string }>
) {
  const { timelineItems, year } = props;
  return (
    <>
      {timelineItems.map((t: TimelineItem) => {
        return (
          <BaseTimelineLog
            key={t.type === 'Post' ? t.slug! : t.publishedOn!}
            t={t}
          >
            <ComputedComp t={t} />
          </BaseTimelineLog>
        );
      })}
    </>
  );
}

function Timeline({
  timelineItems,
}: {
  timelineItems: Record<number, TimelineItem[]>;
}) {
  return (
    <section className="selection:bg-fuchsia-300 selection:text-fuchsia-900">
      <h2 className="text-lg font-bold">Past Writings</h2>
      <div className="text-sm opacity-60">
        I used to blog here, but now I publish only on{' '}
        <a
          href="https://x.com/shivek_khurana"
          className="underline"
        >
          x.com
        </a>
        .
      </div>
      {Object.keys(timelineItems)
        .sort((a: string, b: string) => parseInt(b) - parseInt(a))
        .map((year: string) => {
          return (
            <div
              key={year}
              className=""
            >
              <div className="font-bold text-xs opacity-60 mt-8">{year}</div>
              <TimelineLogs
                year={year}
                timelineItems={timelineItems[parseInt(year)]}
              />
            </div>
          );
        })}
    </section>
  );
}
export default Timeline;
