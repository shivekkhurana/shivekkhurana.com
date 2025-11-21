import React from 'react';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import convert from 'htmr';

import type { Post } from '@contentlayer/generated';
import '@src/components/markdown.css';

const transform = {
  p: ({ children }: PropsWithChildren) => {
    const el = children[0];
    const isElImg =
      el.props &&
      el.props.hasOwnProperty('alt') &&
      el.props.hasOwnProperty('src');
    return (
      <p
        className={clsx('mx-auto', 'mt-6', ' text-lg leading-relaxed', {
          'text-center': isElImg,
          'w-10/12 md:w-8/12 lg:w-6/12': !isElImg,
        })}
      >
        {children}
      </p>
    );
  },
  h1: ({ children }: PropsWithChildren) => (
    <h1
      className={clsx(
        'mx-auto w-10/12 md:w-8/12 lg:w-6/12 text-2xl',
        'mt-6 mb-3',
        'font-bold'
      )}
    >
      {children}
    </h1>
  ),
  h2: ({ children }: PropsWithChildren) => (
    <h2
      className={clsx(
        'mx-auto w-10/12 md:w-8/12 lg:w-6/12 text-xl',
        'mt-5 mb-2',
        'font-bold'
      )}
    >
      {children}
    </h2>
  ),
  h3: ({ children }: PropsWithChildren) => (
    <h3
      className={clsx(
        'mx-auto w-10/12 md:w-8/12 lg:w-6/12 text-lg',
        'mt-4 mb-1',
        'font-bold'
      )}
    >
      {children}
    </h3>
  ),
  hr: () => <hr className="mx-auto w-[9/10] md:w-8/12 lg:w-6/12" />,
  ul: ({ children }: PropsWithChildren) => (
    <ul className="mx-auto w-10/12 md:w-8/12 lg:w-6/12">{children}</ul>
  ),
  ol: ({ children }: PropsWithChildren) => (
    <ol className="mx-auto w-10/12 md:w-8/12 lg:w-6/12">{children}</ol>
  ),
  li: ({ children }: PropsWithChildren) => (
    <li className="list-inside list-disc">{children}</li>
  ),
  blockquote: ({ children }: PropsWithChildren) => (
    <blockquote className="font-serif italic text-xl">{children}</blockquote>
  ),
  a: ({ href, children }: PropsWithChildren<{ href: string }>) => {
    if (href.startsWith('https://gist.github.com')) {
      // Handle specific case
    }
    return (
      <a
        href={href}
        target="_blank"
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt }: { src: string; alt: string }) => {
    const srcParts = src.split('?');
    const size = srcParts[1];
    return (
      <img
        src={src}
        className={clsx('mx-auto mt-8', {
          'w-auto': size === 'original',
          'w-10/12 md:w-8/12 lg:w-6/12': size === 'medium' || !size,
          'w-10/12 md:w-8/12': size === 'large',
          'w-10/12': size === 'x-large',
        })}
        alt={String(alt)}
      />
    );
  },
  em: ({ children }: PropsWithChildren) => {
    return <em className="mt-2 mb-4 text-sm opacity-60">{children}</em>;
  },
  table: ({ children }: PropsWithChildren) => (
    <div className="mx-auto w-4/5 overflow-x-auto my-6">
      <table className="min-w-full">{children}</table>
    </div>
  ),
};

function Markdown(props: PropsWithChildren<{ post: Post }>) {
  const html = props.post.parsedMd;
  return (
    <div className="markdown break-words">{convert(html, { transform })}</div>
  );
}

export default Markdown;
