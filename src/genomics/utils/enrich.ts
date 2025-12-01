import {
  allGenomicsInvestors,
  allGenomicsCompanies,
} from '@contentlayer/generated';
import type {
  GenomicsInvestor,
  GenomicsCompany,
} from '@contentlayer/generated';
import investmentsJson from '@src/genomics/investments.json';
import type {
  EnrichedInvestor,
  EnrichedCompany,
  Investment,
} from '@src/genomics/types';

export function enrichData() {
  const investorsData = allGenomicsInvestors;
  const companiesData = allGenomicsCompanies;
  const investmentsDataArray = investmentsJson.investments as Investment[];

  // Build maps for efficient lookup
  const companyMap = companiesData.reduce(
    (acc, company) => {
      if (company.slug) {
        acc[company.slug] = company;
      }
      return acc;
    },
    {} as Record<string, GenomicsCompany>
  );

  const investorMap = investorsData.reduce(
    (acc, investor) => {
      if (investor.slug) {
        acc[investor.slug] = investor;
      }
      return acc;
    },
    {} as Record<string, GenomicsInvestor>
  );

  // Enrich investors
  const enrichedInvestors: EnrichedInvestor[] = investorsData.map(
    (investor) => {
      const investorInvestments = investmentsDataArray
        .filter((inv) => inv.investorSlug === investor.slug)
        .map((inv) => ({
          ...inv,
          company: companyMap[inv.companySlug],
        }));

      return {
        ...investor,
        investments: investorInvestments,
      };
    }
  );

  // Enrich companies
  const enrichedCompanies: EnrichedCompany[] = companiesData.map((company) => {
    const companyInvestments = investmentsDataArray
      .filter((inv) => inv.companySlug === company.slug)
      .map((inv) => ({
        ...inv,
        investor: investorMap[inv.investorSlug],
      }));

    return {
      ...company,
      investments: companyInvestments,
    };
  });

  return {
    investors: enrichedInvestors,
    companies: enrichedCompanies,
  };
}
