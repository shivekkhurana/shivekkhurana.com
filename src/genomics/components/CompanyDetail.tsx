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
  return (
    <div
      id={`company-${company.slug}`}
      className={clsx('mb-6', 'bg-white')}
    >
      <div className={clsx('mb-4')}>
        <h3 className={clsx('text-xl font-bold', 'mb-2')}>{company.name}</h3>
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'text-sm text-black',
              'hover:underline',
              'block mb-2'
            )}
          >
            {company.website}
          </a>
        )}
        {company.location && (
          <div className={clsx('text-sm opacity-60', 'mb-2')}>
            {company.location}
          </div>
        )}
        {company.founded && (
          <div className={clsx('text-sm opacity-60', 'mb-2')}>
            Founded: {company.founded}
          </div>
        )}
        {company.description && (
          <p className={clsx('text-sm', 'mb-2')}>{company.description}</p>
        )}
        {company.categories && company.categories.length > 0 && (
          <div className={clsx('flex flex-wrap gap-2', 'mb-2')}>
            {company.categories.map((category: string) => (
              <span
                key={category}
                className={clsx(
                  'px-2 py-1',
                  'bg-green-50 text-green-700',
                  'rounded',
                  'text-xs font-medium'
                )}
              >
                {category}
              </span>
            ))}
          </div>
        )}
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
