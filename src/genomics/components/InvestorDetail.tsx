import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import type { EnrichedInvestor } from '@src/genomics/types';
import CompanyList from '@src/genomics/components/CompanyList';
import Markdown from '@src/genomics/components/Markdown';

interface InvestorDetailProps extends PropsWithChildren {
  investor: EnrichedInvestor;
}

function InvestorDetail({ investor }: InvestorDetailProps) {
  // Count unique companies in portfolio
  const uniqueCompanies = new Set(
    investor.investments.map((inv) => inv.companySlug)
  );
  const portfolioCount = uniqueCompanies.size;

  return (
    <div
      id={`investor-${investor.slug}`}
      className={clsx('mb-6', 'bg-white')}
    >
      {/* Header Section */}
      <div className={clsx('mb-6', 'pb-6', 'border-b border-gray-200')}>
        <h1 className={clsx('text-3xl font-bold', 'mb-4')}>{investor.name}</h1>

        {/* Key Info Grid */}
        <div className={clsx('grid grid-cols-1 md:grid-cols-2 gap-4', 'mb-4')}>
          {investor.website && (
            <div>
              <div
                className={clsx(
                  'text-xs',
                  'opacity-50',
                  'mb-1',
                  'uppercase tracking-wide'
                )}
              >
                Website
              </div>
              <a
                href={investor.website}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  'text-sm text-black',
                  'hover:underline',
                  'break-all'
                )}
              >
                {investor.website}
              </a>
            </div>
          )}
          {investor.location && (
            <div>
              <div
                className={clsx(
                  'text-xs',
                  'opacity-50',
                  'mb-1',
                  'uppercase tracking-wide'
                )}
              >
                Location
              </div>
              <div className={clsx('text-sm')}>{investor.location}</div>
            </div>
          )}
          {investor.founded && (
            <div>
              <div
                className={clsx(
                  'text-xs',
                  'opacity-50',
                  'mb-1',
                  'uppercase tracking-wide'
                )}
              >
                Founded
              </div>
              <div className={clsx('text-sm')}>{investor.founded}</div>
            </div>
          )}
          {investor.aum && (
            <div>
              <div
                className={clsx(
                  'text-xs',
                  'opacity-50',
                  'mb-1',
                  'uppercase tracking-wide'
                )}
              >
                AUM
              </div>
              <div className={clsx('text-sm', 'font-medium')}>
                {investor.aum}
              </div>
            </div>
          )}
          {investor.typicalInvestmentRange && (
            <div>
              <div
                className={clsx(
                  'text-xs',
                  'opacity-50',
                  'mb-1',
                  'uppercase tracking-wide'
                )}
              >
                Investment Range
              </div>
              <div className={clsx('text-sm')}>
                {investor.typicalInvestmentRange}
              </div>
            </div>
          )}
          {portfolioCount > 0 && (
            <div>
              <div
                className={clsx(
                  'text-xs',
                  'opacity-50',
                  'mb-1',
                  'uppercase tracking-wide'
                )}
              >
                Portfolio Companies
              </div>
              <div className={clsx('text-sm', 'font-medium')}>
                {portfolioCount}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {investor.description && (
          <p
            className={clsx(
              'text-base leading-relaxed',
              'mb-4',
              'text-gray-700'
            )}
          >
            {investor.description}
          </p>
        )}

        {/* Tags Section */}
        <div className={clsx('flex flex-wrap gap-2', 'items-center')}>
          {investor.fundType && (
            <span
              className={clsx(
                'px-3 py-1',
                'bg-gray-100 text-gray-800',
                'rounded-full',
                'text-xs font-medium'
              )}
            >
              {investor.fundType}
            </span>
          )}
          {investor.stages && investor.stages.length > 0 && (
            <>
              {investor.stages.map((stage: string) => (
                <span
                  key={stage}
                  className={clsx(
                    'px-3 py-1',
                    'bg-blue-50 text-blue-700',
                    'rounded-full',
                    'text-xs font-medium'
                  )}
                >
                  {stage}
                </span>
              ))}
            </>
          )}
        </div>
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
