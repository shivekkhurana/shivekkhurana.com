import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { loadInvestors, loadCompanies, loadInvestments } from '../data/loader';
import { enrichInvestor, enrichCompany } from '../data/enricher';
import type { EnrichedInvestor, EnrichedCompany } from '../data/enricher';
import Tabs from './Tabs';
import InvestorList from './InvestorList';
import CompanyList from './CompanyList';

function GenomicsLandscape() {
  const [activeTab, setActiveTab] = useState<'investors' | 'companies'>(
    'investors'
  );
  const [investors, setInvestors] = useState<EnrichedInvestor[]>([]);
  const [companies, setCompanies] = useState<EnrichedCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const investorsData = loadInvestors();
    const companiesData = loadCompanies();
    const investmentsData = loadInvestments();

    const enrichedInvestors = investorsData.map((investor: any) =>
      enrichInvestor(investor, investmentsData, companiesData)
    );

    const enrichedCompanies = companiesData.map((company: any) =>
      enrichCompany(company, investmentsData, investorsData)
    );

    setInvestors(enrichedInvestors);
    setCompanies(enrichedCompanies);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={clsx('text-center', 'py-12')}>
        <div className={clsx('opacity-60')}>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={clsx('text-3xl font-bold', 'mb-8')}>Genomics Landscape</h1>
      <Tabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {activeTab === 'investors' ? (
        <InvestorList investors={investors} />
      ) : (
        <CompanyList companies={companies} />
      )}
    </div>
  );
}

export default GenomicsLandscape;
