import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import type { EnrichedCompany, EnrichedInvestor } from '@src/genomics/types';
import InvestorList from '@src/genomics/components/InvestorList';
import Markdown from '@src/genomics/components/Markdown';

interface CompanyDetailProps extends PropsWithChildren {
  company: EnrichedCompany;
  investors: EnrichedInvestor[];
}

function CompanyDetail({ company, investors }: CompanyDetailProps) {
  // Count unique investors
  const uniqueInvestors = new Set(
    company.investments.map((inv) => inv.investorSlug).filter(Boolean)
  );
  const investorCount = uniqueInvestors.size;

  return (
    <div
      id={`company-${company.slug}`}
      className={clsx('mb-6', 'bg-white')}
    >
      {/* Header Section */}
      <div className={clsx('mb-6', 'pb-6', 'border-b border-gray-200')}>
        <h1 className={clsx('text-3xl font-bold', 'mb-4')}>{company.name}</h1>

        {/* Description */}
        {company.description && (
          <p
            className={clsx(
              'text-base leading-relaxed',
              'mb-4',
              'text-gray-700'
            )}
          >
            {company.description}
          </p>
        )}

        {/* Key Info Grid */}
        <div className={clsx('grid grid-cols-1 md:grid-cols-2 gap-4', 'mb-4')}>
          {company.website && (
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
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  'text-sm text-black',
                  'hover:underline',
                  'break-all'
                )}
              >
                {company.website}
              </a>
            </div>
          )}
          {company.location && (
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
              <div className={clsx('text-sm')}>{company.location}</div>
            </div>
          )}
          {company.founded && (
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
              <div className={clsx('text-sm')}>{company.founded}</div>
            </div>
          )}
          {investorCount > 0 && (
            <div>
              <div
                className={clsx(
                  'text-xs',
                  'opacity-50',
                  'mb-1',
                  'uppercase tracking-wide'
                )}
              >
                Investors
              </div>
              <div className={clsx('text-sm', 'font-medium')}>
                {investorCount}
              </div>
            </div>
          )}
          {company.categories && company.categories.length > 0 && (
            <div>
              <div
                className={clsx(
                  'text-xs',
                  'opacity-50',
                  'mb-1',
                  'uppercase tracking-wide'
                )}
              >
                Categories
              </div>
              <div className={clsx('text-sm')}>
                {company.categories.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>

      {company.parsedMd && (
        <div
          className={clsx(
            'prose prose-sm max-w-none',
            'mb-4',
            'text-sm leading-relaxed'
          )}
        >
          <Markdown content={company.parsedMd} />
        </div>
      )}

      {company.investments.length > 0 && (
        <div className={clsx('mt-6')}>
          <h2 className={clsx('text-xl font-semibold', 'mb-3')}>Investors</h2>
          <InvestorList
            investors={company.investments
              .map((inv) => inv.investorSlug)
              .filter((slug): slug is string => slug !== undefined)
              .map((slug) => investors.find((inv) => inv.slug === slug))
              .filter(
                (investor): investor is EnrichedInvestor =>
                  investor !== undefined
              )
              .filter(
                (investor, index, self) =>
                  index === self.findIndex((i) => i.slug === investor.slug)
              )}
          />
        </div>
      )}
    </div>
  );
}

export default CompanyDetail;
