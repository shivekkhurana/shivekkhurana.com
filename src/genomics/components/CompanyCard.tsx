import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import type { EnrichedCompany } from '../data/enricher';
import InvestmentList from './InvestmentList';
import convert from 'htmr';
import '@src/components/markdown.css';

interface CompanyCardProps extends PropsWithChildren {
  company: EnrichedCompany;
}

function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div
      id={`company-${company.slug}`}
      className={clsx(
        'border border-gray-200',
        'rounded-lg',
        'p-6',
        'mb-6',
        'bg-white'
      )}
    >
      <div className={clsx('mb-4')}>
        <h3 className={clsx('text-xl font-bold', 'mb-2')}>{company.name}</h3>
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'text-sm text-blue-600',
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
          <div className={clsx('markdown')}>{convert(company.parsedMd)}</div>
        </div>
      )}

      <InvestmentList
        investments={company.investments}
        type="company"
      />
    </div>
  );
}

export default CompanyCard;
