import { useState, useMemo } from 'react';
import clsx from 'clsx';
import type { EnrichedInvestor } from '@src/genomics/types';
import InvestorList from './InvestorList';

interface FilteredInvestorListProps {
  investors: EnrichedInvestor[];
}

// Extract country from location string (e.g., "New York, New York, USA" -> "USA")
function extractCountry(location: string | undefined): string {
  if (!location) return 'Unknown';
  const parts = location.split(',').map((p) => p.trim());
  // Last part is usually the country
  const lastPart = parts[parts.length - 1];
  // Normalize common variations
  if (lastPart === 'US' || lastPart === 'USA' || lastPart === 'United States') {
    return 'USA';
  }
  if (lastPart === 'UK' || lastPart === 'United Kingdom') {
    return 'UK';
  }
  return lastPart || 'Unknown';
}

// Parse AUM string to number in billions for grouping
function parseAUM(aum: string | undefined): number | null {
  if (!aum) return null;
  const match = aum.match(/\$?([\d.]+)\s*(B|M|billion|million)/i);
  if (!match) return null;
  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === 'b' || unit === 'billion') return value;
  if (unit === 'm' || unit === 'million') return value / 1000;
  return null;
}

// Get AUM group label
function getAUMGroup(aum: string | undefined): string {
  const value = parseAUM(aum);
  if (value === null) return 'Unknown';
  if (value >= 10) return '$10B+';
  if (value >= 5) return '$5B-$10B';
  if (value >= 1) return '$1B-$5B';
  return '<$1B';
}

// Get investment count group
function getInvestmentGroup(count: number): string {
  if (count >= 10) return '10+';
  if (count >= 5) return '5-10';
  return '1-5';
}

type FilterType = 'country' | 'stage' | 'aum' | 'investments';

interface FilterState {
  country: string | null;
  stage: string | null;
  aum: string | null;
  investments: string | null;
}

function FilteredInvestorList({ investors }: FilteredInvestorListProps) {
  const [filters, setFilters] = useState<FilterState>({
    country: null,
    stage: null,
    aum: null,
    investments: null,
  });

  // Extract unique filter values
  const filterOptions = useMemo(() => {
    const countries = new Map<string, number>();
    const stages = new Map<string, number>();
    const aumGroups = new Map<string, number>();
    const investmentGroups = new Map<string, number>();

    investors.forEach((investor) => {
      // Country
      const country = extractCountry(investor.location);
      countries.set(country, (countries.get(country) || 0) + 1);

      // Stages
      if (investor.stages) {
        investor.stages.forEach((stage) => {
          stages.set(stage, (stages.get(stage) || 0) + 1);
        });
      }

      // AUM
      const aumGroup = getAUMGroup(investor.aum);
      aumGroups.set(aumGroup, (aumGroups.get(aumGroup) || 0) + 1);

      // Investment count
      const uniqueCompanies = new Set(
        investor.investments.map((inv) => inv.companySlug)
      );
      const invGroup = getInvestmentGroup(uniqueCompanies.size);
      investmentGroups.set(invGroup, (investmentGroups.get(invGroup) || 0) + 1);
    });

    return {
      countries: Array.from(countries.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10), // Top 10 countries
      stages: Array.from(stages.entries()).sort((a, b) => b[1] - a[1]),
      aumGroups: Array.from(aumGroups.entries()).sort((a, b) => {
        const order = ['$10B+', '$5B-$10B', '$1B-$5B', '<$1B', 'Unknown'];
        return order.indexOf(a[0]) - order.indexOf(b[0]);
      }),
      investmentGroups: Array.from(investmentGroups.entries()).sort((a, b) => {
        const order = ['10+', '5-10', '1-5'];
        return order.indexOf(a[0]) - order.indexOf(b[0]);
      }),
    };
  }, [investors]);

  // Filter investors
  const filteredInvestors = useMemo(() => {
    return investors.filter((investor) => {
      // Country filter
      if (filters.country) {
        const country = extractCountry(investor.location);
        if (country !== filters.country) return false;
      }

      // Stage filter
      if (filters.stage) {
        if (!investor.stages || !investor.stages.includes(filters.stage)) {
          return false;
        }
      }

      // AUM filter
      if (filters.aum) {
        const aumGroup = getAUMGroup(investor.aum);
        if (aumGroup !== filters.aum) return false;
      }

      // Investment count filter
      if (filters.investments) {
        const uniqueCompanies = new Set(
          investor.investments.map((inv) => inv.companySlug)
        );
        const invGroup = getInvestmentGroup(uniqueCompanies.size);
        if (invGroup !== filters.investments) return false;
      }

      return true;
    });
  }, [investors, filters]);

  const toggleFilter = (type: FilterType, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? null : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      country: null,
      stage: null,
      aum: null,
      investments: null,
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

        {/* Stage */}
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
            Stage
          </span>
          <div className={clsx('flex flex-wrap gap-2', 'flex-1', 'min-w-0')}>
            {filterOptions.stages.map(([stage, count]) => (
              <button
                key={stage}
                onClick={() => toggleFilter('stage', stage)}
                className={clsx(
                  'px-2 py-0.5',
                  'rounded',
                  'text-xs',
                  'transition-colors',
                  'whitespace-nowrap',
                  filters.stage === stage
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                )}
              >
                {stage} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* AUM */}
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
            AUM
          </span>
          <div className={clsx('flex flex-wrap gap-2', 'flex-1', 'min-w-0')}>
            {filterOptions.aumGroups.map(([group, count]) => (
              <button
                key={group}
                onClick={() => toggleFilter('aum', group)}
                className={clsx(
                  'px-2 py-0.5',
                  'rounded',
                  'text-xs',
                  'transition-colors',
                  'whitespace-nowrap',
                  filters.aum === group
                    ? 'bg-green-600 text-white'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                )}
              >
                {group} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Investment Count */}
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
            Portfolio
          </span>
          <div className={clsx('flex flex-wrap gap-2', 'flex-1', 'min-w-0')}>
            {filterOptions.investmentGroups.map(([group, count]) => (
              <button
                key={group}
                onClick={() => toggleFilter('investments', group)}
                className={clsx(
                  'px-2 py-0.5',
                  'rounded',
                  'text-xs',
                  'transition-colors',
                  'whitespace-nowrap',
                  filters.investments === group
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
              Showing {filteredInvestors.length} of {investors.length}
            </span>
          </div>
        )}
      </div>

      {/* List */}
      <InvestorList investors={filteredInvestors} />
    </div>
  );
}

export default FilteredInvestorList;
