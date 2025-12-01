import React, { type PropsWithChildren } from 'react';
import clsx from 'clsx';
import type { EnrichedInvestor } from '../data/enricher';
import InvestorCard from './InvestorCard';

interface InvestorListProps extends PropsWithChildren {
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
    <div>
      {investors.map((investor) => (
        <InvestorCard
          key={investor.slug}
          investor={investor}
        />
      ))}
    </div>
  );
}

export default InvestorList;
