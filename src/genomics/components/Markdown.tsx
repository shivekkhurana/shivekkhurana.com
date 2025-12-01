import React from 'react';
import type { PropsWithChildren } from 'react';
import convert from 'htmr';
import clsx from 'clsx';
import '@src/components/markdown.css';

type TransformObject = {
  [key: string]:
    | React.ComponentType<any>
    | ((props: any) => React.ReactElement);
};

interface MarkdownProps {
  content: string;
  transforms?: Partial<TransformObject>;
  className?: string;
}

function Markdown({ content, transforms = {}, className }: MarkdownProps) {
  // Default transforms for common markdown elements
  const defaultTransforms: TransformObject = {
    h1: ({ children, ...props }: PropsWithChildren<any>) => (
      <h1
        {...props}
        className={clsx('text-2xl font-bold mb-4 mt-6', props.className)}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: PropsWithChildren<any>) => (
      <h2
        {...props}
        className={clsx('text-xl font-bold mb-3 mt-5', props.className)}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: PropsWithChildren<any>) => (
      <h3
        {...props}
        className={clsx('text-lg font-bold mb-2 mt-4', props.className)}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: PropsWithChildren<any>) => (
      <h4
        {...props}
        className={clsx('text-base font-semibold mb-2 mt-3', props.className)}
      >
        {children}
      </h4>
    ),
    h5: ({ children, ...props }: PropsWithChildren<any>) => (
      <h5
        {...props}
        className={clsx('text-sm font-semibold mb-1 mt-2', props.className)}
      >
        {children}
      </h5>
    ),
    h6: ({ children, ...props }: PropsWithChildren<any>) => (
      <h6
        {...props}
        className={clsx('text-sm font-medium mb-1 mt-2', props.className)}
      >
        {children}
      </h6>
    ),
    p: ({ children, ...props }: PropsWithChildren<any>) => (
      <p
        {...props}
        className={clsx('mb-2', props.className)}
      >
        {children}
      </p>
    ),
    strong: ({ children, ...props }: PropsWithChildren<any>) => (
      <strong
        {...props}
        className={clsx('font-semibold', props.className)}
      >
        {children}
      </strong>
    ),
    em: ({ children, ...props }: PropsWithChildren<any>) => (
      <em
        {...props}
        className={clsx('italic', props.className)}
      >
        {children}
      </em>
    ),
    ul: ({ children, ...props }: PropsWithChildren<any>) => (
      <ul
        {...props}
        className={clsx('list-disc list-inside mb-2', props.className)}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: PropsWithChildren<any>) => (
      <ol
        {...props}
        className={clsx('list-decimal list-inside mb-2', props.className)}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }: PropsWithChildren<any>) => (
      <li
        {...props}
        className={clsx('mb-1', props.className)}
      >
        {children}
      </li>
    ),
    a: ({
      href,
      children,
      ...props
    }: PropsWithChildren<{ href?: string; className?: string }>) => (
      <a
        {...props}
        href={href}
        className={clsx('text-black hover:underline', props.className)}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    code: ({ children, ...props }: PropsWithChildren<any>) => (
      <code
        {...props}
        className={clsx(
          'px-1 py-0.5 bg-gray-100 rounded text-xs font-mono',
          props.className
        )}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }: PropsWithChildren<any>) => (
      <pre
        {...props}
        className={clsx(
          'p-3 bg-gray-100 rounded overflow-x-auto mb-2',
          props.className
        )}
      >
        {children}
      </pre>
    ),
    blockquote: ({ children, ...props }: PropsWithChildren<any>) => (
      <blockquote
        {...props}
        className={clsx(
          'border-l-4 border-gray-300 pl-4 italic mb-2',
          props.className
        )}
      >
        {children}
      </blockquote>
    ),
  };

  // Merge user transforms with defaults (user transforms take precedence)
  const mergedTransforms = {
    ...defaultTransforms,
    ...transforms,
  };

  return (
    <div className={clsx('markdown', className)}>
      {convert(content, { transform: mergedTransforms })}
    </div>
  );
}

export default Markdown;
