import clsx from 'clsx';
import type { EnrichedCompany } from '@src/genomics/types';

interface CompanyListProps {
  companies: EnrichedCompany[];
}

function CompanyList({ companies }: CompanyListProps) {
  if (companies.length === 0) {
    return (
      <div className={clsx('text-center', 'py-12', 'opacity-60')}>
        No companies found
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
              Founded
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
              Categories
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr
              key={company.slug}
              onClick={() => {
                window.location.href = `/genomics-landscape/companies/${company.slug}`;
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
                  href={`/genomics-landscape/companies/${company.slug}`}
                  className={clsx('font-medium', 'hover:underline')}
                  onClick={(e) => e.stopPropagation()}
                >
                  {company.name}
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
                {company.location || '-'}
              </td>
              <td
                className={clsx(
                  'py-3',
                  'px-0 sm:px-4',
                  'text-sm',
                  'opacity-70'
                )}
              >
                {company.founded || '-'}
              </td>
              <td className={clsx('py-3', 'px-0 sm:px-4')}>
                {company.categories && company.categories.length > 0 ? (
                  <div className={clsx('flex flex-wrap gap-1')}>
                    {company.categories.slice(0, 2).map((category: string) => (
                      <span
                        key={category}
                        className={clsx(
                          'px-2 py-0.5',
                          'bg-green-50 text-green-700',
                          'rounded',
                          'text-xs'
                        )}
                      >
                        {category}
                      </span>
                    ))}
                    {company.categories.length > 2 && (
                      <span className={clsx('text-xs', 'opacity-60')}>
                        +{company.categories.length - 2}
                      </span>
                    )}
                  </div>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompanyList;
