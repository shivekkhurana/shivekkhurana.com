import React from 'react';
import clsx from 'clsx';
import type { EnrichedInvestment } from '@src/genomics/types';

interface InvestmentListProps {
  investments: EnrichedInvestment[];
  type: 'investor' | 'company';
}

function InvestmentList({ investments, type }: InvestmentListProps) {
  if (investments.length === 0) {
    return null;
  }

  return (
    <div className={clsx('mt-4', 'pt-4', 'border-t border-gray-200')}>
      <h4 className={clsx('text-sm font-semibold', 'mb-3')}>
        {type === 'investor' ? 'Portfolio Companies' : 'Investors'}
      </h4>
      <div className={clsx('space-y-2')}>
        {investments.map((investment, index) => {
          const entity =
            type === 'investor' ? investment.company : investment.investor;

          if (!entity) {
            return (
              <div
                key={index}
                className={clsx('text-sm opacity-60')}
              >
                {type === 'investor'
                  ? investment.companySlug
                  : investment.investorSlug}
              </div>
            );
          }

          return (
            <div
              key={entity.slug}
              className={clsx(
                'flex items-center justify-between',
                'p-2',
                'rounded',
                'hover:bg-gray-50'
              )}
            >
              <div>
                <a
                  href={`/genomics-landscape/${
                    type === 'investor' ? 'companies' : 'investors'
                  }/${entity.slug}`}
                  className={clsx(
                    'text-sm font-medium text-black',
                    'hover:underline'
                  )}
                >
                  {entity.name}
                </a>
                {investment.stage && investment.stage !== 'unknown' && (
                  <span
                    className={clsx(
                      'ml-2',
                      'px-2 py-0.5',
                      'bg-gray-100 text-gray-700',
                      'rounded text-xs'
                    )}
                  >
                    {investment.stage}
                  </span>
                )}
                {investment.leadInvestor && (
                  <span
                    className={clsx(
                      'ml-2',
                      'px-2 py-0.5',
                      'bg-blue-100 text-blue-700',
                      'rounded text-xs font-medium'
                    )}
                  >
                    Lead
                  </span>
                )}
              </div>
              {investment.amount && (
                <div className={clsx('text-sm opacity-60')}>
                  {investment.amountCurrency}{' '}
                  {investment.amount.toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InvestmentList;
