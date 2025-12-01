import React, { type PropsWithChildren } from 'react';
import clsx from 'clsx';
import type { EnrichedCompany } from '../data/enricher';
import CompanyCard from './CompanyCard';

interface CompanyListProps extends PropsWithChildren {
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
    <div>
      {companies.map((company) => (
        <CompanyCard
          key={company.slug}
          company={company}
        />
      ))}
    </div>
  );
}

export default CompanyList;
