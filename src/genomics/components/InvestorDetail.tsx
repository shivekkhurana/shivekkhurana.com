import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import type { EnrichedInvestor } from '@src/genomics/types';
import CompanyList from '@src/genomics/components/CompanyList';
import Markdown from '@src/genomics/components/Markdown';

interface InvestorDetailProps extends PropsWithChildren {
  investor: EnrichedInvestor;
}

function InvestorDetail({ investor }: InvestorDetailProps) {
  return (
    <div
      id={`investor-${investor.slug}`}
      className={clsx('mb-6', 'bg-white')}
    >
      <div className={clsx('mb-4')}>
        <h3 className={clsx('text-xl font-bold', 'mb-2')}>{investor.name}</h3>
        {investor.website && (
          <a
            href={investor.website}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'text-sm text-black',
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
          <Markdown content={investor.parsedMd} />
        </div>
      )}

      {investor.investments.length > 0 && (
        <div className={clsx('mt-6')}>
          <h2 className={clsx('text-xl font-semibold', 'mb-3')}>
            Portfolio Companies
          </h2>
          <CompanyList
            companies={investor.investments
              .map((inv) => inv.company)
              .filter(
                (company): company is NonNullable<typeof company> =>
                  company !== undefined
              )
              .filter(
                (company, index, self) =>
                  index === self.findIndex((c) => c.slug === company.slug)
              )
              .map((company) => ({
                ...company,
                investments: [],
              }))}
          />
        </div>
      )}
    </div>
  );
}

export default InvestorDetail;
