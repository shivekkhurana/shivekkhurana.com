import { useState, useMemo } from 'react';
import clsx from 'clsx';
import type { EnrichedCompany } from '@src/genomics/types';
import CompanyList from './CompanyList';

interface FilteredCompanyListProps {
  companies: EnrichedCompany[];
}

// Extract country from location string
function extractCountry(location: string | undefined): string {
  if (!location) return 'Unknown';
  const parts = location.split(',').map((p) => p.trim());
  const lastPart = parts[parts.length - 1];
  if (lastPart === 'US' || lastPart === 'USA' || lastPart === 'United States') {
    return 'USA';
  }
  if (lastPart === 'UK' || lastPart === 'United Kingdom') {
    return 'UK';
  }
  return lastPart || 'Unknown';
}

// Get founded decade group
function getFoundedGroup(founded: string | undefined): string {
  if (!founded) return 'Unknown';
  const year = parseInt(founded, 10);
  if (isNaN(year)) return 'Unknown';
  if (year >= 2020) return '2020s';
  if (year >= 2015) return '2015-2019';
  if (year >= 2010) return '2010-2014';
  if (year >= 2000) return '2000-2009';
  return 'Pre-2000';
}

// Get investor count group
function getInvestorGroup(count: number): string {
  if (count >= 10) return '10+';
  if (count >= 5) return '5-10';
  return '1-5';
}

type FilterType = 'country' | 'category' | 'founded' | 'investors';

interface FilterState {
  country: string | null;
  category: string | null;
  founded: string | null;
  investors: string | null;
}

function FilteredCompanyList({ companies }: FilteredCompanyListProps) {
  const [filters, setFilters] = useState<FilterState>({
    country: null,
    category: null,
    founded: null,
    investors: null,
  });

  // Extract unique filter values
  const filterOptions = useMemo(() => {
    const countries = new Map<string, number>();
    const categories = new Map<string, number>();
    const foundedGroups = new Map<string, number>();
    const investorGroups = new Map<string, number>();

    companies.forEach((company) => {
      // Country
      const country = extractCountry(company.location);
      countries.set(country, (countries.get(country) || 0) + 1);

      // Categories
      if (company.categories) {
        company.categories.forEach((category) => {
          categories.set(category, (categories.get(category) || 0) + 1);
        });
      }

      // Founded
      const foundedGroup = getFoundedGroup(company.founded);
      foundedGroups.set(
        foundedGroup,
        (foundedGroups.get(foundedGroup) || 0) + 1
      );

      // Investor count
      const uniqueInvestors = new Set(
        company.investments.map((inv) => inv.investorSlug)
      );
      const invGroup = getInvestorGroup(uniqueInvestors.size);
      investorGroups.set(invGroup, (investorGroups.get(invGroup) || 0) + 1);
    });

    return {
      countries: Array.from(countries.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 16), // top 16 countries
      categories: Array.from(categories.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 24), // top 24 categories
      foundedGroups: Array.from(foundedGroups.entries()).sort((a, b) => {
        const order = [
          '2020s',
          '2015-2019',
          '2010-2014',
          '2000-2009',
          'Pre-2000',
          'Unknown',
        ];
        return order.indexOf(a[0]) - order.indexOf(b[0]);
      }),
      investorGroups: Array.from(investorGroups.entries()).sort((a, b) => {
        const order = ['10+', '5-10', '1-5'];
        return order.indexOf(a[0]) - order.indexOf(b[0]);
      }),
    };
  }, [companies]);

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      // Country filter
      if (filters.country) {
        const country = extractCountry(company.location);
        if (country !== filters.country) return false;
      }

      // Category filter
      if (filters.category) {
        if (
          !company.categories ||
          !company.categories.includes(filters.category)
        ) {
          return false;
        }
      }

      // Founded filter
      if (filters.founded) {
        const foundedGroup = getFoundedGroup(company.founded);
        if (foundedGroup !== filters.founded) return false;
      }

      // Investor count filter
      if (filters.investors) {
        const uniqueInvestors = new Set(
          company.investments.map((inv) => inv.investorSlug)
        );
        const invGroup = getInvestorGroup(uniqueInvestors.size);
        if (invGroup !== filters.investors) return false;
      }

      return true;
    });
  }, [companies, filters]);

  const toggleFilter = (type: FilterType, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? null : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      country: null,
      category: null,
      founded: null,
      investors: null,
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== null);

  return (
    <div>
      {/* Filters */}
      <div className={clsx('mb-6', 'space-y-3')}>
        {/* Country */}
        <div className={clsx('flex flex-wrap gap-2 items-start')}>
          <span
            className={clsx(
              'text-xs',
              'opacity-50',
              'w-20',
              'shrink-0',
              'pt-1'
            )}
          >
            Country
          </span>
          <div className={clsx('flex flex-wrap gap-2', 'flex-1', 'min-w-0')}>
            {filterOptions.countries.map(([country, count]) => (
              <button
                key={country}
                onClick={() => toggleFilter('country', country)}
                className={clsx(
                  'px-2 py-0.5',
                  'rounded',
                  'text-xs',
                  'transition-colors',
                  'whitespace-nowrap',
                  filters.country === country
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                )}
              >
                {country} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className={clsx('flex flex-wrap gap-2 items-start')}>
          <span
            className={clsx(
              'text-xs',
              'opacity-50',
              'w-20',
              'shrink-0',
              'pt-1'
            )}
          >
            Category
          </span>
          <div className={clsx('flex flex-wrap gap-2', 'flex-1', 'min-w-0')}>
            {filterOptions.categories.map(([category, count]) => (
              <button
                key={category}
                onClick={() => toggleFilter('category', category)}
                className={clsx(
                  'px-2 py-0.5',
                  'rounded',
                  'text-xs',
                  'transition-colors',
                  'whitespace-nowrap',
                  filters.category === category
                    ? 'bg-green-600 text-white'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                )}
              >
                {category} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Founded */}
        <div className={clsx('flex flex-wrap gap-2 items-start')}>
          <span
            className={clsx(
              'text-xs',
              'opacity-50',
              'w-20',
              'shrink-0',
              'pt-1'
            )}
          >
            Founded
          </span>
          <div className={clsx('flex flex-wrap gap-2', 'flex-1', 'min-w-0')}>
            {filterOptions.foundedGroups.map(([group, count]) => (
              <button
                key={group}
                onClick={() => toggleFilter('founded', group)}
                className={clsx(
                  'px-2 py-0.5',
                  'rounded',
                  'text-xs',
                  'transition-colors',
                  'whitespace-nowrap',
                  filters.founded === group
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                )}
              >
                {group} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Investor Count */}
        <div className={clsx('flex flex-wrap gap-2 items-start')}>
          <span
            className={clsx(
              'text-xs',
              'opacity-50',
              'w-20',
              'shrink-0',
              'pt-1'
            )}
          >
            Investors
          </span>
          <div className={clsx('flex flex-wrap gap-2', 'flex-1', 'min-w-0')}>
            {filterOptions.investorGroups.map(([group, count]) => (
              <button
                key={group}
                onClick={() => toggleFilter('investors', group)}
                className={clsx(
                  'px-2 py-0.5',
                  'rounded',
                  'text-xs',
                  'transition-colors',
                  'whitespace-nowrap',
                  filters.investors === group
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                )}
              >
                {group} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <div className={clsx('flex items-center gap-2', 'pt-2')}>
            <button
              onClick={clearFilters}
              className={clsx(
                'text-xs',
                'text-gray-500 hover:text-gray-700',
                'underline'
              )}
            >
              Clear all filters
            </button>
            <span className={clsx('text-xs', 'opacity-50')}>
              Showing {filteredCompanies.length} of {companies.length}
            </span>
          </div>
        )}
      </div>

      {/* List */}
      <CompanyList companies={filteredCompanies} />
    </div>
  );
}

export default FilteredCompanyList;
