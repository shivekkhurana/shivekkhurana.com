import React from 'react';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import convert from 'htmr';

import type { Post } from '@contentlayer/generated';
import '@src/components/markdown.css';

const transform = {
  p: ({ children }: PropsWithChildren) => {
    // Safely check if children is an array and has elements
    const childArray = React.Children.toArray(children);
    const el = childArray[0];
    const isElImg =
      el &&
      typeof el === 'object' &&
      'props' in el &&
      el.props?.hasOwnProperty('alt') &&
      el.props?.hasOwnProperty('src');
    return (
      <p
        className={clsx('mx-auto', 'mt-6', ' text-lg leading-relaxed', {
          'text-center': isElImg,
          'w-11/12 lg:w-10/12 xl:w-8/12': !isElImg,
        })}
      >
        {children}
      </p>
    );
  },
  h1: ({ children }: PropsWithChildren) => (
    // H1 is H3 on page context, becasuse title is H1, subtitle is H2
    <h3
      className={clsx(
        'mx-auto w-11/12 lg:w-10/12 xl:w-8/12 text-2xl',
        'mt-6 mb-3',
        'font-bold'
      )}
    >
      {children}
    </h3>
  ),
  h2: ({ children }: PropsWithChildren) => (
    <h4
      className={clsx(
        'mx-auto w-11/12 lg:w-10/12 xl:w-8/12 text-xl',
        'mt-5 mb-2',
        'font-bold'
      )}
    >
      {children}
    </h4>
  ),
  h3: ({ children }: PropsWithChildren) => (
    <h5
      className={clsx(
        'mx-auto w-11/12 lg:w-10/12 xl:w-8/12 text-lg',
        'mt-4 mb-1',
        'font-bold'
      )}
    >
      {children}
    </h5>
  ),
  hr: () => <hr className="mx-auto w-11/12 lg:w-10/12 xl:w-8/12" />,
  ul: ({ children }: PropsWithChildren) => (
    <ul className="mx-auto w-11/12 lg:w-10/12 xl:w-8/12">{children}</ul>
  ),
  ol: ({ children }: PropsWithChildren) => (
    <ol className="mx-auto w-11/12 lg:w-10/12 xl:w-8/12">{children}</ol>
  ),
  li: ({ children }: PropsWithChildren) => (
    <li className="list-outside list-disc ml-6 mb-2 text-lg leading-relaxed">
      {children}
    </li>
  ),
  blockquote: ({ children }: PropsWithChildren) => (
    <blockquote className="mt-4 font-serif italic text-2xl text-gray-600 [&_p]:px-6 [&_p]:my-0 [&_p]:first:mt-0 [&_p]:last:mb-0 [&_p]:text-2xl [&_p]:leading-relaxed">
      {children}
    </blockquote>
  ),
  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith('https://gist.github.com')) {
      // Handle specific case
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    const srcParts = (src || '').split('?');
    const size = srcParts[1];
    return (
      <figure className="mt-8 text-center">
        <img
          src={src}
          className={clsx('mx-auto', {
            'w-auto': size === 'original',
            'w-11/12 lg:w-10/12 xl:w-8/12': size === 'medium' || !size,
            'w-11/12 lg:w-10/12': size === 'large',
            'w-11/12': size === 'x-large',
          })}
          alt={alt || ''}
        />
        {alt && (
          <figcaption className="mt-2 mb-4 text-sm opacity-60">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },
  table: ({ children }: PropsWithChildren) => (
    <div className="mx-auto w-full md:w-4/5 overflow-x-auto my-6">
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
