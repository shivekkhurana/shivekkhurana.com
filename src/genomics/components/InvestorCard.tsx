import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import type { EnrichedInvestor } from '../data/enricher';
import InvestmentList from './InvestmentList';
import convert from 'htmr';
import '@src/components/markdown.css';

interface InvestorCardProps extends PropsWithChildren {
  investor: EnrichedInvestor;
}

function InvestorCard({ investor }: InvestorCardProps) {
  return (
    <div
      id={`investor-${investor.slug}`}
      className={clsx(
        'border border-gray-200',
        'rounded-lg',
        'p-6',
        'mb-6',
        'bg-white'
      )}
    >
      <div className={clsx('mb-4')}>
        <h3 className={clsx('text-xl font-bold', 'mb-2')}>{investor.name}</h3>
        {investor.website && (
          <a
            href={investor.website}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'text-sm text-blue-600',
              'hover:underline',
              'block mb-2'
            )}
          >
            {investor.website}
          </a>
        )}
        {investor.location && (
          <div className={clsx('text-sm opacity-60', 'mb-2')}>
            {investor.location}
          </div>
        )}
        {investor.description && (
          <p className={clsx('text-sm', 'mb-2')}>{investor.description}</p>
        )}
        {investor.type && (
          <span
            className={clsx(
              'inline-block',
              'px-2 py-1',
              'bg-gray-100',
              'rounded',
              'text-xs font-medium',
              'mr-2 mb-2'
            )}
          >
            {investor.type}
          </span>
        )}
        {investor.stages && investor.stages.length > 0 && (
          <div className={clsx('flex flex-wrap gap-2', 'mb-2')}>
            {investor.stages.map((stage: string) => (
              <span
                key={stage}
                className={clsx(
                  'px-2 py-1',
                  'bg-blue-50 text-blue-700',
                  'rounded',
                  'text-xs font-medium'
                )}
              >
                {stage}
              </span>
            ))}
          </div>
        )}
      </div>

      {investor.parsedMd && (
        <div
          className={clsx(
            'prose prose-sm max-w-none',
            'mb-4',
            'text-sm leading-relaxed'
          )}
        >
          <div className={clsx('markdown')}>{convert(investor.parsedMd)}</div>
        </div>
      )}

      <InvestmentList
        investments={investor.investments}
        type="investor"
      />
    </div>
  );
}

export default InvestorCard;
