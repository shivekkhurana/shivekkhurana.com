import clsx from 'clsx';
import type { EnrichedInvestor } from '@src/genomics/types';

interface InvestorListProps {
  investors: EnrichedInvestor[];
}

function InvestorList({ investors }: InvestorListProps) {
  if (investors.length === 0) {
    return (
      <div className={clsx('text-center', 'py-12', 'opacity-60')}>
        No investors found
      </div>
    );
  }

  return (
    <div className={clsx('overflow-x-auto')}>
      <table className={clsx('w-full', 'border-collapse')}>
        <thead>
          <tr className={clsx('border-b border-gray-200')}>
            <th
              className={clsx(
                'text-left',
                'py-3',
                'px-0 sm:px-4',
                'font-semibold',
                'text-sm'
              )}
            >
              Name
            </th>
            <th
              className={clsx(
                'text-left',
                'py-3',
                'px-0 sm:px-4',
                'font-semibold',
                'text-sm'
              )}
            >
              Location
            </th>
            <th
              className={clsx(
                'text-left',
                'py-3',
                'px-0 sm:px-4',
                'font-semibold',
                'text-sm'
              )}
            >
              Type
            </th>
            <th
              className={clsx(
                'text-left',
                'py-3',
                'px-0 sm:px-4',
                'font-semibold',
                'text-sm'
              )}
            >
              Stages
            </th>
            <th
              className={clsx(
                'text-left',
                'py-3',
                'px-0 sm:px-4',
                'font-semibold',
                'text-sm'
              )}
            >
              Portfolio
            </th>
          </tr>
        </thead>
        <tbody>
          {investors.map((investor) => {
            // Count unique companies in portfolio
            const uniqueCompanies = new Set(
              investor.investments.map((inv) => inv.companySlug)
            );
            const portfolioCount = uniqueCompanies.size;

            return (
              <tr
                key={investor.slug}
                onClick={() => {
                  window.location.href = `/genomics-landscape/investors/${investor.slug}`;
                }}
                className={clsx(
                  'border-b border-gray-100',
                  'hover:bg-gray-50',
                  'transition-colors',
                  'cursor-pointer'
                )}
              >
                <td className={clsx('py-3', 'px-0 sm:px-4')}>
                  <a
                    href={`/genomics-landscape/investors/${investor.slug}`}
                    className={clsx('font-medium', 'hover:underline')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {investor.name}
                  </a>
                </td>
                <td
                  className={clsx(
                    'py-3',
                    'px-0 sm:px-4',
                    'text-sm',
                    'opacity-70'
                  )}
                >
                  {investor.location || '-'}
                </td>
                <td
                  className={clsx(
                    'py-3',
                    'px-0 sm:px-4',
                    'text-sm',
                    'opacity-70'
                  )}
                >
                  {investor.fundType || '-'}
                </td>
                <td className={clsx('py-3', 'px-0 sm:px-4')}>
                  {investor.stages && investor.stages.length > 0 ? (
                    <div className={clsx('flex flex-wrap gap-1')}>
                      {investor.stages.slice(0, 2).map((stage: string) => (
                        <span
                          key={stage}
                          className={clsx(
                            'px-2 py-0.5',
                            'bg-blue-50 text-blue-700',
                            'rounded',
                            'text-xs'
                          )}
                        >
                          {stage}
                        </span>
                      ))}
                      {investor.stages.length > 2 && (
                        <span className={clsx('text-xs', 'opacity-60')}>
                          +{investor.stages.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td
                  className={clsx(
                    'py-3',
                    'px-0 sm:px-4',
                    'text-sm',
                    'opacity-70'
                  )}
                >
                  {portfolioCount}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default InvestorList;
