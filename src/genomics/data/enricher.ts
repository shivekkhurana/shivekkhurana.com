import type { Investor, Company, Investment } from './loader';

export interface EnrichedInvestment extends Investment {
  investor?: Investor;
  company?: Company;
}

// EnrichedInvestor includes all Investor fields plus investments
export type EnrichedInvestor = Investor & {
  investments: EnrichedInvestment[];
};

// EnrichedCompany includes all Company fields plus investments
export type EnrichedCompany = Company & {
  investments: EnrichedInvestment[];
};

export function buildInvestorMap(
  investors: Investor[]
): Record<string, Investor> {
  return investors.reduce(
    (acc, investor) => {
      acc[investor.slug] = investor;
      return acc;
    },
    {} as Record<string, Investor>
  );
}

export function buildCompanyMap(companies: Company[]): Record<string, Company> {
  return companies.reduce(
    (acc, company) => {
      acc[company.slug] = company;
      return acc;
    },
    {} as Record<string, Company>
  );
}

export function enrichInvestor(
  investor: Investor,
  investments: Investment[],
  companies: Company[]
): EnrichedInvestor {
  const companyMap = buildCompanyMap(companies);
  const investorInvestments = investments
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

export function enrichCompany(
  company: Company,
  investments: Investment[],
  investors: Investor[]
): EnrichedCompany {
  const investorMap = buildInvestorMap(investors);
  const companyInvestments = investments
    .filter((inv) => inv.companySlug === company.slug)
    .map((inv) => ({
      ...inv,
      investor: investorMap[inv.investorSlug],
    }));

  return {
    ...company,
    investments: companyInvestments,
  };
}
