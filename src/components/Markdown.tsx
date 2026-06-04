import React from 'react';
import clsx from 'clsx';
import convert from 'htmr';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { getHighlighter } from 'shiki';
import * as vega from 'vega';
import * as vegaLite from 'vega-lite';

import type { Post } from '@contentlayer/generated';
import './markdown.css';

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (character) => map[character]);
}

async function renderVegaToSvg(spec: string): Promise<string> {
  try {
    const parsedSpec = JSON.parse(spec);
    const vegaSpec = vegaLite.compile(parsedSpec).spec;
    const view = new vega.View(vega.parse(vegaSpec), { renderer: 'none' });
    const svg = await view.toSVG();

    return `<div class="vega-chart-container">
      <div class="vega-chart-wrapper">
        ${svg}
      </div>
    </div>`;
  } catch (error) {
    console.error('Failed to render Vega chart:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    return `<div style="margin: 1.5rem auto; max-width: 66%; padding: 1rem; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 0.25rem;">
      <p style="color: #dc2626; font-weight: 600;">Error rendering chart</p>
      <p style="color: #ef4444; font-size: 0.875rem; margin-top: 0.5rem;">Invalid Vega-Lite specification: ${escapeHtml(
        errorMessage
      )}</p>
    </div>`;
  }
}

const marked = new Marked(
  markedHighlight({
    async: true,
    async highlight(code, lang) {
      if (lang === 'vega-lite' || lang === 'vega') {
        return renderVegaToSvg(code);
      }

      const highlighter = await getHighlighter({ theme: 'monokai' });
      return highlighter.codeToHtml(code, lang);
    },
  })
);

export async function renderMarkdown(markdown: string): Promise<string> {
  return marked.parse(markdown);
}

const transform = {
  p: ({ children }: React.PropsWithChildren) => {
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
          'w-11/12 md:w-8/12 lg:w-6/12': !isElImg,
        })}
      >
        {children}
      </p>
    );
  },
  h1: ({ children }: React.PropsWithChildren) => (
    // H1 is H3 on page context, becasuse title is H1, subtitle is H2
    <h3
      className={clsx(
        'mx-auto w-11/12 md:w-8/12 lg:w-6/12 text-2xl',
        'mt-6 mb-3',
        'font-bold'
      )}
    >
      {children}
    </h3>
  ),
  h2: ({ children }: React.PropsWithChildren) => (
    <h4
      className={clsx(
        'mx-auto w-11/12 md:w-8/12 lg:w-6/12 text-xl',
        'mt-5 mb-2',
        'font-bold'
      )}
    >
      {children}
    </h4>
  ),
  h3: ({ children }: React.PropsWithChildren) => (
    <h5
      className={clsx(
        'mx-auto w-11/12 md:w-8/12 lg:w-6/12 text-lg',
        'mt-4 mb-1',
        'font-bold'
      )}
    >
      {children}
    </h5>
  ),
  hr: () => <hr className="mx-auto w-9/10 md:w-8/12 lg:w-6/12" />,
  ul: ({ children }: React.PropsWithChildren) => (
    <ul className="mx-auto w-11/12 md:w-8/12 lg:w-6/12">{children}</ul>
  ),
  ol: ({ children }: React.PropsWithChildren) => (
    <ol className="mx-auto w-11/12 md:w-8/12 lg:w-6/12">{children}</ol>
  ),
  li: ({ children }: React.PropsWithChildren) => (
    <li className="list-outside list-disc ml-6 mb-2 text-lg leading-relaxed">
      {children}
    </li>
  ),
  blockquote: ({ children }: React.PropsWithChildren) => (
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
            'w-11/12 md:w-8/12 lg:w-6/12': size === 'medium' || !size,
            'w-11/12 md:w-8/12': size === 'large',
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
  table: ({ children }: React.PropsWithChildren) => (
    <div className="mx-auto w-full md:w-4/5 overflow-x-auto my-6">
      <table className="min-w-full">{children}</table>
    </div>
  ),
};

type MarkdownProps =
  | { post: Post; className?: string }
  | { parsedMd: string; className?: string };

function Markdown(props: MarkdownProps) {
  const html = 'post' in props ? props.post.parsedMd : props.parsedMd;

  return (
    <div className={clsx('markdown break-words', props.className)}>
      {convert(html, { transform })}
    </div>
  );
}

export default Markdown;
